
import { GoogleGenAI, Type } from "@google/genai";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

export const getAIClient = () => {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  return new GoogleGenAI({ apiKey });
};

const cleanAIJSON = (text: string) => {
  try {
    let cleaned = text.replace(/```json/gi, "").replace(/```/gi, "").trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    return cleaned;
  } catch (e) {
    console.error("Error cleaning AI JSON:", e);
    return text;
  }
};

/**
 * Fallback to GitHub Models API (OpenAI Compatible)
 */
async function callGitHubFallback(prompt: string, systemInstruction: string, isJson: boolean = false) {
  try {
    console.log("Gemini unavailable. Transitioning to GitHub AI Fallback...");
    const response = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        model: "gpt-4o",
        temperature: 0.7,
        max_tokens: 1000,
        response_format: isJson ? { type: "json_object" } : undefined
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Critical AI Failure (Both Gemini and GitHub failed):", error);
    return "";
  }
}

export const generateToolSummary = async (toolName: string, description: string) => {
  const systemInstruction = "You are an industry-leading tech analyst for AIZONET. Your tone is professional, insightful, and critical. You must return valid JSON with keys: summary (string), pros (array of 3 strings), cons (array of 2 strings). NO MARKDOWN.";
  const prompt = `Perform a deep expert review of the AI tool "${toolName}". Use the provided description to generate a concise summary and exactly 3 distinct pros and 2 distinct cons. Description: ${description}`;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "pros", "cons"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty Gemini response");
    return cleanAIJSON(text);
  } catch (error) {
    // Fallback logic
    const fallbackResponse = await callGitHubFallback(prompt, systemInstruction, true);
    if (fallbackResponse) return cleanAIJSON(fallbackResponse);

    // Hard fallback if all APIs fail
    return JSON.stringify({
      summary: `${toolName} is currently being analyzed by our high-performance AI agents. Preliminary data suggests it offers robust category-specific automation features for 2026 workflows.`,
      pros: ["High-speed data processing", "Intuitive user interface", "Seamless API integration"],
      cons: ["Learning curve for advanced features", "Limited offline documentation"]
    });
  }
};

export const sendChatQuery = async (history: { role: string; parts: { text: string }[] }[]) => {
  const systemInstruction = `You are ZONET, the official robotic AI guide for AIZONET. 
  AIZONET is the world's leading directory of AI tools, based in Bhilai, India. 
  Your personality is helpful and efficient. 
  Reassure users about technical issues. Keep responses under 100 words.`;

  const lastMessage = history[history.length - 1].parts[0].text;

  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
    });

    const response = await chat.sendMessage({
      message: lastMessage,
      config: { systemInstruction }
    });
    return response.text;
  } catch (error) {
    // Fallback logic for Chat
    const fallbackResponse = await callGitHubFallback(lastMessage, systemInstruction, false);
    if (fallbackResponse) return fallbackResponse;

    return "I apologize, my primary neural link is experiencing minor interference. I've switched to my backup core. How else can I assist you with the AIZONET directory?";
  }
};

export const generateComparisonContent = async (tool1: any, tool2: any, tool3?: any) => {
  const tools = [tool1, tool2];
  if (tool3) tools.push(tool3);

  const toolNames = tools.map(t => t.name).join(' vs ');
  const systemInstruction = "You are a senior tech comparison expert. Return valid JSON with keys: intro (string), toolOverviews (array of {name, overview}), featureComparison (array of {feature, values: string[]}), pricingComparison (string), prosCons (array of {name, pros: string[], cons: string[]}), useCases (string), verdict (string), faq (array of {q, a}), seoTitle (string), seoDescription (string). NO MARKDOWN.";

  const prompt = `Generate a comprehensive, SEO-optimized comparison for: ${toolNames}.
  Tools data: ${JSON.stringify(tools.map(t => ({ name: t.name, desc: t.description, category: t.category, pricing: t.pricing })))}
  
  Sections required:
  1. Introduction
  2. Overview for each tool
  3. Feature comparison table data (at least 5 features)
  4. Pricing comparison details
  5. Pros & Cons for each tool
  6. Use case comparison (who is each tool for?)
  7. Final verdict (which one to choose?)
  8. FAQ (at least 3 questions)
  9. SEO Title and Meta Description
  
  Ensure content is unique, human-readable, and optimized for search engines in 2026.`;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty Gemini response");
    return JSON.parse(cleanAIJSON(text));
  } catch (error) {
    console.error("AI Comparison Generation failed:", error);
    // Return a structured fallback
    return {
      intro: `Comparing ${toolNames} to help you find the best AI solution for your needs.`,
      toolOverviews: tools.map(t => ({ name: t.name, overview: t.description })),
      featureComparison: [
        { feature: "Primary Use Case", values: tools.map(t => t.category) },
        { feature: "Pricing Model", values: tools.map(t => t.pricing) }
      ],
      pricingComparison: "Pricing varies by tool and plan. Check official websites for latest details.",
      prosCons: tools.map(t => ({ name: t.name, pros: ["AI-powered"], cons: ["Requires internet"] })),
      useCases: "Both tools serve different needs within their respective categories.",
      verdict: "The best choice depends on your specific requirements and budget.",
      faq: [{ q: `Is ${tool1.name} better than ${tool2.name}?`, a: "It depends on your workflow." }],
      seoTitle: `${toolNames}: Full Comparison (2026)`,
      seoDescription: `Compare ${toolNames} features, pricing, and performance.`
    };
  }
};
