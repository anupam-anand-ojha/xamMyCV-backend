import Resume from '../models/Resume.js';
import { extractTextFromFile } from '../services/resumeParser.js';

//Resume and extract raw text

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const rawText = await extractTextFromFile(req.file.path);

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      rawText,
    });

    res.status(201).json({
      message: 'Resume uploaded and text extracted successfully',
      resumeId: resume._id,
      rawText: resume.rawText,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};