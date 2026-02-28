import { OpenAI } from "openai";
import { configDotenv } from "dotenv";

configDotenv();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateSecurityExplanation({
  packageName,
  severity,
  summary,
  patchedVersion,
}) {
  const prompt = `
You are a senior DevSecOps engineer.

Explain the following security vulnerability in a clear and professional way.

Package: ${packageName}
Severity: ${severity}
Summary: ${summary}
Patched Version: ${patchedVersion}

Provide:

1. What the vulnerability is
2. Why it is dangerous
3. Real-world impact
4. What the patched version fixes
5. Recommended developer actions

Keep it concise but professional.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a DevSecOps security expert." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
}

export { generateSecurityExplanation };