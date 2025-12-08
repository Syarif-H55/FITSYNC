import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    // Debug logs
    console.log("Gemini API Key:", process.env.GEMINI_API_KEY?.slice(0, 10) + "...");
    console.log("Content-Type:", req.headers.get("content-type"));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    const genAI = new GoogleGenerativeAI(apiKey);

    let prompt = "";
    let imageBase64 = "";
    let imageType = "image/jpeg";

    // 🔹 Terima dua jenis input: JSON atau multipart form
    if (contentType.includes("application/json")) {
      const body = await req.json();
      prompt = body.prompt;
      imageBase64 = body.imageBase64 || "";
      imageType = body.imageType || "image/jpeg";
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      prompt = formData.get("prompt") as string;
      
      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        // Validate image type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(imageFile.type)) {
          return new Response(
            JSON.stringify({ error: 'Invalid image type. Only JPEG, PNG, and WebP are supported.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const bytes = await imageFile.arrayBuffer();
        imageBase64 = Buffer.from(bytes).toString("base64");
        imageType = imageFile.type;
      }
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported Content-Type. Use application/json or multipart/form-data" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔹 Tentukan model otomatis
    const modelName = "gemini-2.5-flash";
    console.log(`🧠 Using model: ${modelName}`);

    const model = genAI.getGenerativeModel({ model: modelName });

    const result = imageBase64
      ? await model.generateContent([
          prompt,
          { inlineData: { data: imageBase64, mimeType: imageType } },
        ])
      : await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    // Try to return structured response
    let structuredResponse;
    
    // If the prompt asks for JSON format, try to parse it
    if (prompt.toLowerCase().includes('return json') || prompt.toLowerCase().includes('json object')) {
      try {
        // Look for JSON in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonString = jsonMatch[0];
          structuredResponse = JSON.parse(jsonString);
        } else {
          // If we can't find JSON, try to parse the whole text
          structuredResponse = JSON.parse(text);
        }
      } catch (parseError) {
        console.warn('Could not parse AI response as JSON, returning as text:', parseError);
        // Return as plain text response with structured format
        structuredResponse = {
          reply: text
        };
      }
    } else {
      // For regular prompts, return as text
      structuredResponse = {
        reply: text
      };
    }

    return new Response(
      JSON.stringify({ success: true, ...structuredResponse }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("❌ Error in Gemini API call:", error);
    
    // Handle specific error types
    if (error.message && error.message.includes("API key")) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing API key" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Failed to process request", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}