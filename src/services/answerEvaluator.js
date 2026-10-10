import genAI from '../config/gemini.js';

export const evaluateAnswer = async (question, correctAnswer, userAnswer) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are grading a candidate's answer in a skill assessment test.

Question: ${question}
Expected/Reference Answer: ${correctAnswer}
Candidate's Answer: ${userAnswer || '(No any answer provided)'}


Evaluate how well the candidate's answer demonstrates real, genuine understanding (not just correct keywords).

Return ONLY valid JSON, no preamble, no markdown code fences, in exactly this format:
{
  "score": <number from 0 to 10>,
  "feedback": "One or two sentence explanation of the score, mentioning specifically what was right or missing"
}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleanJson = responseText.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleanJson);
  } catch (error) {
    throw new Error('AI returned invalid JSON format for evaluation');
  }
};


export const calculateFinalScores = (questions) => {
  let totalScore = 0;
  let maxScore = 0;

  questions.forEach((q) => {
    if (q.type === 'mcq') {
      maxScore += 10;
      if (q.userAnswer === q.correctAnswer) totalScore += 10;
    } else {
      maxScore += 10;
      totalScore += q.aiEvaluation.score || 0;
    }
  });

  const overallScore = Math.round((totalScore / maxScore) * 100);

  const deepDiveQuestions = questions.filter((q) => q.type === 'project-deep-dive');
  const deepDiveAvg =
    deepDiveQuestions.length > 0
      ? deepDiveQuestions.reduce((sum, q) => sum + (q.aiEvaluation.score || 0), 0) /
        deepDiveQuestions.length
      : 0;

  const authenticityScore = Math.round((deepDiveAvg / 10) * 100);

  return { overallScore, authenticityScore };
};