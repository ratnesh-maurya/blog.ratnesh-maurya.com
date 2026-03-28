import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    maxOutputTokens: 50,
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        content: { type: SchemaType.STRING },
      },
    }
  }
});

async function run() {
  const result = await model.generateContentStream("Write a very long 2000 word story.");
  let text = "";
  for await (const chunk of result.stream) {
    text += chunk.text();
  }
  console.log("Result ends with:", text.slice(-50));
  try {
    JSON.parse(text);
    console.log("Valid JSON: true");
  } catch (e: any) {
    console.log("Valid JSON: false", e.message);
  }
}
run();
