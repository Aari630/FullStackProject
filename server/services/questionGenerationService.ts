import axios from 'axios';
import TranscriptSegment from '../models/Transcript';
import Question from '../models/Question';
import mongoose from 'mongoose';

/**
 * Generates MCQ questions for the given transcript segments
 * 
 * @param videoId The ID of the video
 * @param segmentIds Array of transcript segment IDs
 * @param progressCallback Callback function to report progress
 */
export async function generateQuestions(
  videoId: string,
  segmentIds: mongoose.Types.ObjectId[],
  progressCallback?: (progress: number) => void
): Promise<void> {
  try {
    // In a real implementation, this would call the Python LLM API
    // For this demo, we'll simulate question generation
    
    // Delete any existing questions for this video
    await Question.deleteMany({ videoId });
    
    // Process each segment
    for (let i = 0; i < segmentIds.length; i++) {
      const segmentId = segmentIds[i];
      
      // Get transcript text
      const segment = await TranscriptSegment.findById(segmentId);
      if (!segment) {
        console.error(`Segment ${segmentId} not found`);
        continue;
      }
      
      // Generate questions for this segment
      const questions = await simulateQuestionGeneration(segment.text);
      
      // Save questions to database
      for (const questionData of questions) {
        const question = new Question({
          videoId,
          segmentId,
          text: questionData.text,
          options: questionData.options,
          correctOptionIndex: questionData.correctOptionIndex,
        });
        
        await question.save();
      }
      
      // Report progress
      if (progressCallback) {
        progressCallback((i + 1) / segmentIds.length);
      }
      
      // Add a small delay to simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error('Question generation error:', error);
    throw error;
  }
}

/**
 * Simulates question generation for demo purposes
 * In a real implementation, this would call the LLM API
 */
async function simulateQuestionGeneration(
  text: string
): Promise<Array<{ text: string; options: Array<{ text: string; isCorrect: boolean }>; correctOptionIndex: number }>> {
  // Generate 2-3 questions per segment
  const numQuestions = Math.floor(Math.random() * 2) + 2;
  const questions = [];
  
  for (let i = 0; i < numQuestions; i++) {
    // Generate a question based on the segment text
    const questionText = generateQuestionText(text, i);
    
    // Generate 4 options (1 correct, 3 incorrect)
    const options = generateOptions();
    
    // Pick a random correct option
    const correctOptionIndex = Math.floor(Math.random() * 4);
    options[correctOptionIndex].isCorrect = true;
    
    questions.push({
      text: questionText,
      options,
      correctOptionIndex,
    });
  }
  
  return questions;
}

/**
 * Generates a question based on transcript text
 */
function generateQuestionText(text: string, questionIndex: number): string {
  // Extract topics from the text
  const topics = [
    'machine learning',
    'neural networks',
    'deep learning',
    'convolutional networks',
    'recurrent networks',
    'transformers',
    'attention mechanisms',
    'reinforcement learning',
    'natural language processing',
    'computer vision'
  ];
  
  // Find topics mentioned in the text
  const mentionedTopics = topics.filter(topic => text.toLowerCase().includes(topic));
  
  // Generate question templates
  const questionTemplates = [
    `What is the main focus of ${mentionedTopics[0] || 'this segment'}?`,
    `Which concept is most closely related to ${mentionedTopics[0] || 'the topic discussed'}?`,
    `What is a key application of ${mentionedTopics[0] || 'this technology'}?`,
    `Which statement best describes ${mentionedTopics[0] || 'the concept presented'}?`,
    `What is a limitation of ${mentionedTopics[0] || 'the approach discussed'}?`
  ];
  
  // Select a template based on question index
  return questionTemplates[questionIndex % questionTemplates.length];
}

/**
 * Generates options for a multiple choice question
 */
function generateOptions(): Array<{ text: string; isCorrect: boolean }> {
  const optionSets = [
    [
      'It uses supervised learning techniques',
      'It relies on unsupervised learning',
      'It combines multiple models into an ensemble',
      'It requires reinforcement learning'
    ],
    [
      'Neural networks with convolutional layers',
      'Traditional decision trees',
      'Support vector machines',
      'Linear regression models'
    ],
    [
      'Computer vision applications',
      'Financial forecasting',
      'Medical diagnosis',
      'Natural language processing'
    ],
    [
      'A model that learns representations through multiple layers',
      'A single-layer perceptron with linear activation',
      'A rule-based expert system',
      'A statistical method using Bayesian inference'
    ]
  ];
  
  // Select a random set of options
  const randomIndex = Math.floor(Math.random() * optionSets.length);
  const selectedOptions = optionSets[randomIndex];
  
  // Format as option objects (all initially incorrect)
  return selectedOptions.map(text => ({ text, isCorrect: false }));
}