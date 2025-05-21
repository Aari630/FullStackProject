import express from 'express';
import Question from '../models/Question';
import mongoose from 'mongoose';

const router = express.Router();

// Get all questions for a video
router.get('/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    // Validate videoId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    
    const questions = await Question.find({ videoId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching questions', error: err });
  }
});

// Get questions for a specific segment
router.get('/segment/:segmentId', async (req, res) => {
  try {
    const segmentId = req.params.segmentId;
    
    // Validate segmentId
    if (!mongoose.Types.ObjectId.isValid(segmentId)) {
      return res.status(400).json({ message: 'Invalid segment ID' });
    }
    
    const questions = await Question.find({ segmentId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching questions for segment', error: err });
  }
});

// Update a question
router.patch('/:questionId', async (req, res) => {
  try {
    const questionId = req.params.questionId;
    
    // Validate questionId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    
    const { text, options, correctOptionIndex } = req.body;
    
    // Build update object
    const updateData: any = {};
    if (text) updateData.text = text;
    if (options) updateData.options = options;
    if (correctOptionIndex !== undefined) updateData.correctOptionIndex = correctOptionIndex;
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      updateData,
      { new: true }
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Error updating question', error: err });
  }
});

// Delete a question
router.delete('/:questionId', async (req, res) => {
  try {
    const questionId = req.params.questionId;
    
    // Validate questionId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }
    
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting question', error: err });
  }
});

// Export questions for a video
router.get('/:videoId/export', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    // Validate videoId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    
    const questions = await Question.find({ videoId });
    
    // Format questions for export
    const formattedQuestions = questions.map(q => ({
      id: q._id,
      question: q.text,
      options: q.options.map(opt => ({
        text: opt.text,
        isCorrect: opt.isCorrect
      })),
      correctOptionIndex: q.correctOptionIndex
    }));
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=questions-${videoId}.json`);
    
    res.json(formattedQuestions);
  } catch (err) {
    res.status(500).json({ message: 'Error exporting questions', error: err });
  }
});

export default router;