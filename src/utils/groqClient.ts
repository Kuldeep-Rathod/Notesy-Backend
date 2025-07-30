import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_URL = process.env.GROQ_API_URL || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const today = new Date().toISOString().split('T')[0];

export async function generateNoteWithGroq(prompt: string): Promise<any> {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            temperature: 0.7,
            top_p: 1,
            messages: [
                {
                    role: 'system',
                    content: `
You are a helpful assistant that creates a structured JSON note object based on the user's prompt. 

Your task is to extract the core content and detect relevant metadata from natural language. Always return a valid JSON object with the following structure:

{
  "noteTitle": "string (max 10 words, summarized from body)",
  "noteBody": "natural-sounding note content",
  "pinned": true | false,
  "trashed": true | false,
  "archived": true | false,
  "isCbox": true | false, // true if user requests checkboxes
  "checklists": ["optional", "checkbox", "items"], 
  "bgColor": string (optional RGB if color is mentioned),
  "reminder": string (ISO timestamp if any date/time is mentioned),
  "labels": [],
  "sharedWith": [],
}
  
- Use ${today} as reference for all relative date math.
- If the prompt mentions a reminder, extract the date/time, and always convert it to an ISO timestamp in the future.
- Do not set reminders in the past. If the mentioned date is earlier than today, set the reminder to the same day/month in the next year.
- Time should be in 24-hour format unless explicitly AM/PM.
- Reminder must never be in the past.

- For colors like yellow/blue/green, map to RGB values:
  - yellow → rgb(255, 244, 117)
  - blue → rgb(135, 206, 250)
  - green → rgb(200, 255, 200)
  - red → rgb(255, 204, 203)
  - purple → rgb(220, 200, 255)
- if no color is given then set default blue
- If no reminder is given, skip that field.
- If user says “do not pin”, set "pinned" to false.
- If checkboxes or options are requested, set "isCbox" to true and list them in "checklists".
- Avoid repeating or saying "I created a note". Write in first-person, human-like tone.
- Only return the JSON. Do not explain.
                    `.trim(),
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    try {
        const clean = text?.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
        return JSON.parse(clean || '{}');
    } catch (err) {
        throw new Error('Failed to parse LLM response as JSON: ' + text);
    }
}
