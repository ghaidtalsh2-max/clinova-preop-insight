/**
 * Speechmatics Real-time WebSocket & Audio Streaming Client
 * 
 * Features:
 * 1. Fetches ephemeral JWT token securely from backend /api/speechmatics/token
 * 2. Streams 16kHz PCM audio from navigator.mediaDevices.getUserMedia
 * 3. Connects via wss://eu2.rt.speechmatics.com/v2?jwt=<token>
 * 4. Dispatches live partial and final transcript events
 * 5. Provides live audio volume level (0-100) for real-time waveform visualization
 * 6. Gracefully falls back to browser Web Speech API if WebSocket or network is restricted
 */

export interface SpeechmaticsCallbacks {
  onTranscriptChunk: (chunk: string, isFinal: boolean, speaker?: string) => void;
  onAudioLevel?: (level: number) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: 'connecting' | 'recording' | 'processing' | 'stopped') => void;
}

export class SpeechmaticsRealtimeClient {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private recognitionFallback: any = null;
  private isRecording: boolean = false;
  private callbacks: SpeechmaticsCallbacks;
  private lang: 'ar' | 'en';
  private animFrameId: number | null = null;

  constructor(callbacks: SpeechmaticsCallbacks, lang: 'ar' | 'en' = 'ar') {
    this.callbacks = callbacks;
    this.lang = lang;
  }

  public setLanguage(lang: 'ar' | 'en') {
    this.lang = lang;
    if (this.recognitionFallback) {
      this.recognitionFallback.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    }
  }

  public async startRecording(): Promise<boolean> {
    if (this.isRecording) return true;

    try {
      this.callbacks.onStatusChange?.('connecting');

      // 1. Request microphone permission
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.isRecording = true;

      // 2. Setup Web Audio Analyser for real-time volume / waveform
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 16000 });

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.sourceNode.connect(this.analyser);

      this.startAudioLevelLoop();

      // 3. Attempt Speechmatics WebSocket connection via secure backend token
      let speechmaticsConnected = false;
      try {
        const tokenRes = await fetch('/api/speechmatics/token');
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const token = tokenData.token || tokenData.key_value;
          if (token) {
            speechmaticsConnected = await this.connectSpeechmaticsWebSocket(token);
          }
        }
      } catch (wsErr) {
        console.warn('Speechmatics WebSocket token retrieval failed, falling back to Web Speech API:', wsErr);
      }

      // 4. If Speechmatics WebSocket couldn't connect, seamlessly activate native Web Speech API
      if (!speechmaticsConnected) {
        this.startWebSpeechFallback();
      }

      this.callbacks.onStatusChange?.('recording');
      return true;
    } catch (err: any) {
      console.error('Failed to start audio recording:', err);
      this.stopRecording();
      this.callbacks.onError?.(err.message || 'Microphone access denied');
      return false;
    }
  }

  private connectSpeechmaticsWebSocket(jwtToken: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const wsUrl = `wss://eu2.rt.speechmatics.com/v2?jwt=${encodeURIComponent(jwtToken)}`;
        const socket = new WebSocket(wsUrl);
        this.ws = socket;

        const timeout = setTimeout(() => {
          if (socket.readyState !== WebSocket.OPEN) {
            try { socket.close(); } catch (e) {}
            resolve(false);
          }
        }, 4000);

        socket.onopen = () => {
          clearTimeout(timeout);
          console.info('Connected to Speechmatics Real-Time WebSocket with Speaker Diarization.');

          // Send StartRecognition message with speaker diarization enabled
          const startMsg = {
            message: 'StartRecognition',
            audio_format: {
              type: 'raw',
              encoding: 'pcm_s16le',
              sample_rate: 16000
            },
            transcription_config: {
              language: this.lang === 'ar' ? 'ar' : 'en',
              operating_point: 'enhanced',
              enable_partials: true,
              max_delay: 2.0,
              diarization: 'speaker'
            }
          };

          socket.send(JSON.stringify(startMsg));
          this.startAudioStreamingToWebSocket();
          resolve(true);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.message === 'AddPartialTranscript') {
              const text = data.metadata?.transcript || '';
              if (text.trim()) {
                this.callbacks.onTranscriptChunk(text.trim(), false);
              }
            } else if (data.message === 'AddTranscript') {
              const text = data.metadata?.transcript || '';
              let speaker = 'S1';
              if (Array.isArray(data.results) && data.results.length > 0) {
                for (const r of data.results) {
                  if (r.alternatives?.[0]?.speaker) {
                    speaker = r.alternatives[0].speaker;
                    break;
                  }
                }
              }
              if (text.trim()) {
                this.callbacks.onTranscriptChunk(text.trim(), true, speaker);
              }
            } else if (data.message === 'Error') {
              console.warn('Speechmatics WebSocket error message:', data.reason);
            }
          } catch (e) {
            // non-json message
          }
        };

        socket.onerror = (err) => {
          console.warn('Speechmatics WebSocket error event:', err);
          clearTimeout(timeout);
          resolve(false);
        };

        socket.onclose = () => {
          if (this.isRecording) {
            console.info('Speechmatics WebSocket closed, switching to browser Web Speech API.');
            this.startWebSpeechFallback();
          }
        };
      } catch (err) {
        resolve(false);
      }
    });
  }

  private startAudioStreamingToWebSocket() {
    if (!this.audioContext || !this.sourceNode || !this.ws) return;

    // Buffer size 4096 gives ~256ms of 16kHz audio per chunk
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      if (!this.isRecording || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);
      // Convert Float32Array to 16-bit signed PCM
      const pcmBuffer = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcmBuffer[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      this.ws.send(pcmBuffer.buffer);
    };

    this.sourceNode.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  private startWebSpeechFallback() {
    if (this.recognitionFallback) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Native SpeechRecognition not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      this.recognitionFallback = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = this.lang === 'ar' ? 'ar-SA' : 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final.trim()) {
          this.callbacks.onTranscriptChunk(final.trim(), true);
        } else if (interim.trim()) {
          this.callbacks.onTranscriptChunk(interim.trim(), false);
        }
      };

      recognition.onerror = (err: any) => {
        if (err.error !== 'no-speech') {
          console.warn('Web Speech API notification:', err.error);
        }
      };

      recognition.onend = () => {
        if (this.isRecording && this.recognitionFallback) {
          try {
            this.recognitionFallback.start();
          } catch (e) {
            // ignore
          }
        }
      };

      recognition.start();
    } catch (e) {
      console.warn('Failed to start Web Speech API fallback:', e);
    }
  }

  private startAudioLevelLoop() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const updateLoop = () => {
      if (!this.isRecording || !this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const level = Math.min(100, Math.round((avg / 128) * 100));

      this.callbacks.onAudioLevel?.(level);
      this.animFrameId = requestAnimationFrame(updateLoop);
    };

    this.animFrameId = requestAnimationFrame(updateLoop);
  }

  public stopRecording() {
    this.isRecording = false;
    this.callbacks.onStatusChange?.('stopped');

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ message: 'EndOfStream', last_seq_no: 0 }));
        }
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }

    if (this.recognitionFallback) {
      try {
        this.recognitionFallback.stop();
      } catch (e) {}
      this.recognitionFallback = null;
    }

    if (this.processor) {
      try {
        this.processor.disconnect();
      } catch (e) {}
      this.processor = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    this.callbacks.onAudioLevel?.(0);
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}
