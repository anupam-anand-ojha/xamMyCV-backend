import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    // extracted text from PDF/DOCX
    rawText: {
      type: String, 
    },
    parsedData: {
      skills: [String],
      projects: [
        {
          title: String,
          description: String,
          techStack: [String],
        },
      ],
      experience: [
        {
          role: String,
          company: String,
          duration: String,
        },
      ],
      education: [String],
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;