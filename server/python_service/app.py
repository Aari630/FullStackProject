from flask import Flask, request, jsonify
import time
import os
import json
import random

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the AI service is running"""
    return jsonify({
        'status': 'ok',
        'services': {
            'transcription': 'online',
            'question_generation': 'online'
        }
    })

@app.route('/transcribe', methods=['POST'])
def transcribe_video():
    """
    Mock endpoint for transcribing videos
    
    In a real implementation, this would use Whisper or another ASR model
    """
    # Check if file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Simulate transcription processing
    time.sleep(2)  # Simulate processing delay
    
    # Mock transcript generation
    duration = 600  # 10 minutes
    transcript_segments = []
    
    for i in range(0, duration, 300):  # 5-minute segments
        end_time = min(i + 300, duration)
        
        # Generate mock transcript
        transcript_segments.append({
            'start': i,
            'end': end_time,
            'text': f"This is a mock transcript for segment {i//300 + 1}. In a real implementation, this would contain the actual transcribed text from the Whisper model."
        })
    
    return jsonify({
        'duration': duration,
        'segments': transcript_segments
    })

@app.route('/generate_questions', methods=['POST'])
def generate_questions():
    """
    Mock endpoint for generating questions from transcript segments
    
    In a real implementation, this would use a local LLM (e.g., LLaMA, Mistral)
    """
    # Get transcript text from request
    data = request.json
    
    if not data or 'text' not in data:
        return jsonify({'error': 'No transcript text provided'}), 400
    
    transcript_text = data['text']
    
    # Simulate processing delay
    time.sleep(1)
    
    # Generate mock questions (2-3 per segment)
    num_questions = random.randint(2, 3)
    questions = []
    
    for i in range(num_questions):
        correct_option = random.randint(0, 3)
        
        options = [
            {'text': f'Option {j+1}', 'isCorrect': j == correct_option} 
            for j in range(4)
        ]
        
        questions.append({
            'text': f'Question {i+1} about the transcript content?',
            'options': options,
            'correctOptionIndex': correct_option
        })
    
    return jsonify({
        'questions': questions
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)