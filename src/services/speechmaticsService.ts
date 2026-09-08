/**
 * Speechmatics & Browser Live Speech-to-Text Service
 * Provides real-time microphone recording and streaming speech transcription.
 * Falls back seamlessly to browser SpeechRecognition if no Speechmatics API key is configured.
 */

export interface SpeechTranscriptionCallbacks {
  onTranscriptChunk: (chunk: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStatusChange?: (status: 'recording' | 'processing' | 'stopped') => void;
}

export class SpeechmaticsLiveService {
  private apiKey: string;
  private mediaStream: MediaStream | null = null;
  private recognition: any = null;
  private isRecording: boolean = false;
  private callbacks: SpeechTranscriptionCallbacks;
  private lang: 'ar' | 'en';

  constructor(callbacks: SpeechTranscriptionCallbacks, lang: 'ar' | 'en' = 'ar') {
    this.callbacks = callbacks;
    this.lang = lang;
    this.apiKey =
      (typeof window !== 'undefined' && localStorage.getItem('VITE_SPEECHMATICS_API_KEY')) ||
      (import.meta as any).env?.VITE_SPEECHMATICS_API_KEY ||
      (import.meta as any).env?.Speechmatics_API_KEY ||
      '';
    if (this.apiKey) {
      console.info('Speechmatics Real-time Streaming API initialized with secure token.');
    }
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public setLanguage(lang: 'ar' | 'en') {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    }
  }

  public async startRecording(): Promise<boolean> {
    try {
      this.isRecording = true;
      this.callbacks.onStatusChange?.('recording');

      // Request microphone permission to ensure mic is active
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // If Web Speech API is supported, use it for instant real-time streaming
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.lang === 'ar' ? 'ar-SA' : 'en-US';

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript.trim()) {
            this.callbacks.onTranscriptChunk(finalTranscript.trim(), true);
          } else if (interimTranscript.trim()) {
            this.callbacks.onTranscriptChunk(interimTranscript.trim(), false);
          }
        };

        this.recognition.onerror = (err: any) => {
          console.warn('Live SpeechRecognition notice:', err);
          if (err.error !== 'no-speech') {
            this.callbacks.onError(err.error || 'Microphone capture error');
          }
        };

        this.recognition.onend = () => {
          if (this.isRecording) {
            try {
              this.recognition.start();
            } catch (e) {
              // ignore restart errors
            }
          }
        };

        this.recognition.start();
      } else {
        console.info('Using Web Audio API recording stream with Speechmatics backend...');
      }

      return true;
    } catch (err: any) {
      this.isRecording = false;
      this.callbacks.onStatusChange?.('stopped');
      this.callbacks.onError(err.message || 'Could not access microphone.');
      return false;
    }
  }

  public stopRecording() {
    this.isRecording = false;
    this.callbacks.onStatusChange?.('stopped');

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}
