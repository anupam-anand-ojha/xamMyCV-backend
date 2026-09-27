import Test from '../models/Test.js';
import Resume from '../models/Resume.js';
import { generateQuestions } from '../services/questionGenerator.js';
import { evaluateAnswer, calculateFinalScores } from '../services/answerEvaluator.js';

export const generateTest = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!resume.parsedData || !resume.parsedData.skills?.length) {
      return res.status(400).json({
        message: 'Resume must be parsed first before generating a test',
      });
    }

    const questions = await generateQuestions(resume.parsedData);

    const test = await Test.create({
      user: req.user._id,
      resume: resume._id,
      questions,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Test generated successfully',
      testId: test._id,
      totalQuestions: test.questions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (test.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const safeQuestions = test.questions.map((q) => ({
      _id: q._id,
      type: q.type,
      question: q.question,
      relatedSkill: q.relatedSkill,
      options: q.options,
    }));

    res.status(200).json({
      testId: test._id,
      status: test.status,
      questions: safeQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit answers, evaluate them, and calculate final scores

export const submitTest = async (req, res) => {
  try {
    const { answers } = req.body; // questionId, userAnswer

    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (test.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Loop through each question, attach user's answer, evaluate if needed
    for (const question of test.questions) {
      const submitted = answers.find(
        (a) => a.questionId === question._id.toString()
      );

      if (!submitted) continue;

      question.userAnswer = submitted.userAnswer;

      if (question.type === 'mcq') {
        // Direct check, no AI needed
        question.aiEvaluation.score =
          question.userAnswer === question.correctAnswer ? 10 : 0;
        question.aiEvaluation.feedback =
          question.userAnswer === question.correctAnswer
            ? 'Correct answer.'
            : `Incorrect. Correct answer was: ${question.correctAnswer}`;
      } else {
        // AI evaluation for scenario / project-deep-dive
        const evaluation = await evaluateAnswer(
          question.question,
          question.correctAnswer,
          question.userAnswer
        );
        question.aiEvaluation.score = evaluation.score;
        question.aiEvaluation.feedback = evaluation.feedback;
      }
    }

    const { overallScore, authenticityScore } = calculateFinalScores(test.questions);

    test.overallScore = overallScore;
    test.authenticityScore = authenticityScore;
    test.status = 'completed';

    await test.save();

    res.status(200).json({
      message: 'Test submitted and evaluated successfully',
      overallScore,
      authenticityScore,
      questionResults: test.questions.map((q) => ({
        question: q.question,
        userAnswer: q.userAnswer,
        score: q.aiEvaluation.score,
        feedback: q.aiEvaluation.feedback,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};