import { Groq } from "groq-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askGroq(systemPrompt: string, userPrompt: string, retryCount = 0): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      // llama-3.3-70b-versatile or llama3-8b-8192
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    return chatCompletion.choices[0]?.message?.content || "{}";
  } catch (error) {
    console.error("Groq API Error:", error);
    if (retryCount < 2) {
      console.log("Retrying Groq API call...");
      await new Promise(r => setTimeout(r, 1000));
      return askGroq(systemPrompt, userPrompt, retryCount + 1);
    }
    throw error;
  }
}
