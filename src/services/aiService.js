import genAI from '../config/gemini.js';

// Extracts structured data (skills, projects, experience)
export const parseResumeWithAI = async (rawText) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a resume parsing engine. Extract structured data from the resume text below.

Return ONLY valid JSON, no preamble, no markdown code fences, in exactly this format:
{
  "skills": ["skill1", "skill2"],
  "projects": [
    {
      "title": "Project name",
      "description": "Short description",
      "techStack": ["tech1", "tech2"]
    }
  ],
  "experience": [
    {
      "role": "Job title",
      "company": "Company name",
      "duration": "e.g. Jan 2023 - Present"
    }
  ],
  "education": ["Degree, Institution, Year"]
}

Resume text:
"""
${rawText}
"""`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleanJson = responseText.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleanJson);
  } catch (error) {
    throw new Error('AI returned invalid JSON format');
  }
};