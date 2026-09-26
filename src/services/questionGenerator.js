import genAI from '../config/gemini.js';




export const generateQuestions = async (parsedData) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a technical interviewer creating a personalized skill assessment test based on a candidate's resume.

Candidate's extracted resume data:
${JSON.stringify(parsedData, null, 2)}

Generate exactly 10 questions total:
- 4 MCQ questions (testing specific skills listed, with 4 options each)
- 3 scenario-based questions (real-world situations using their claimed skills)
- 3 project deep-dive questions (specific, probing questions about the projects they listed — ask about implementation details a real builder would know)

Return ONLY valid JSON, no preamble, no markdown code fences, in exactly this array format:
[
  {
    "type": "mcq",
    "question": "Question text",
    "relatedSkill": "Skill name",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": "the correct option text"
  },
  {
    "type": "scenario",
    "question": "Scenario question text",
    "relatedSkill": "Skill name",
    "correctAnswer": "expected answer or key points"
  },
  {
    "type": "project-deep-dive",
    "question": "Specific question about their project",
    "relatedSkill": "Related tech/skill",
    "correctAnswer": "what a genuine builder would mention"
  }
]`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleanJson = responseText.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleanJson);
  } catch (error) {
    throw new Error('AI returned invalid JSON format for questions');
  }
};