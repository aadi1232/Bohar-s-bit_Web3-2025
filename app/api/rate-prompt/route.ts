import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not set." }, { status: 500 });
  }

  // Ask OpenAI to rate the prompt from 1 to 10 only
  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert prompt evaluator. Rate the effectiveness of the following prompt on a scale of 1 to 10. Only reply with a single integer between 1 and 10. No explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 5,
      temperature: 0.2,
    }),
  });

  const data = await openaiRes.json();
  let score = data.choices?.[0]?.message?.content?.match(/\d+/)?.[0] || null;
  if (score) score = Math.max(1, Math.min(10, parseInt(score, 10))).toString();

  return NextResponse.json({ score });
}
