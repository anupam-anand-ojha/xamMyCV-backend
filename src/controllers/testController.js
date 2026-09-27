import Test from '../models/Test.js';
import Resume from '../models/Resume.js';
import { generateQuestions } from '../services/questionGenerator.js';



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

// Get a test by ID (for taking the test)

export const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (test.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Hide correct answers from the candidate while taking the test
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