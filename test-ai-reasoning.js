import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const openRouterKey = env.OPENROUTER_API_KEY || env.VITE_OPENROUTER_API_KEY;
const model = 'openai/gpt-4o-mini'; // or 'meta-llama/llama-3.3-70b-instruct'

const samplePatient = {
  name: "Ahmed Ali Alotaibi",
  age: 45,
  gender: "Male",
  mrn: "10293",
  allergies: ["Penicillin"],
  chronicConditions: ["Hypertension", "Type 2 Diabetes"],
  medications: [
    { name: "Amlodipine", dose: "5 mg", source: "MOH", status: "Active" },
    { name: "Metformin", dose: "500 mg", source: "Private", status: "Active" },
    { name: "Apixaban", dose: "5 mg", source: "NGHA", status: "Active" }
  ],
  previousProcedures: ["Appendectomy (2023)"],
  previousInvestigations: ["12-Lead ECG (Normal sinus rhythm, May 2024)"]
};

const sampleTranscript = `
Doctor: Hello Ahmed, how have you been feeling?
Patient: I've been feeling dizzy, especially when I stand up quickly. It started about 3 weeks ago.
Patient: I take something for my blood pressure, and also a blood thinner, but I don't remember the name of the blood thinner.
`;

async function testClinicalExtraction() {
  const systemPrompt = `You are Clinova AI, a Clinical Decision Support assistant for pre-operative assessment.
Analyze the doctor-patient dialogue in the context of the patient's EHR.
Strict guidelines:
1. Extract clinical entities: symptoms, duration, triggers, medications, allergies, history.
2. Contextual Patient Memory Retrieval: cross-reference mentioned medications/tests against EHR. If patient mentions a blood thinner, match with Apixaban 5mg but label as "Possible match from patient record - clinician verification required".
3. What Needs Attention: identify missing info, medication discrepancies, or potential clinical findings.
4. Smart Question: generate EXACTLY ONE relevant, targeted clarifying question (with yes/no/not sure options).
5. Clinical Possibilities: suggest 2-3 differential possibilities with qualitative likelihood (Higher likelihood, Moderate likelihood, Lower likelihood) and supporting evidence from conversation and from patient record, plus key discriminating questions.
6. Output MUST BE valid JSON only.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openRouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'Clinova - PreOp Insight'
    },
    body: JSON.stringify({
      model: model,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `PATIENT EHR:\n${JSON.stringify(samplePatient, null, 2)}\n\nTRANSCRIPT:\n${sampleTranscript}`
        }
      ]
    })
  });

  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Parsed Output:\n', JSON.stringify(JSON.parse(data.choices[0].message.content), null, 2));
}

testClinicalExtraction();
