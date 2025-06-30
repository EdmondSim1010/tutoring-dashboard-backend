# app.py
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
# IMPORTANT: This allows your frontend to make requests to this backend
CORS(app) 

# Load the "database"
with open('db.json', 'r') as f:
    db = json.load(f)

# --- API Endpoints ---

@app.route('/api/students', methods=['GET'])
def get_students():
    """Returns a list of all students with their progress calculated."""
    all_students = db['students']
    all_questions = db['questions']

    # Calculate progress for each student
    for student in all_students:
        student['progress'] = {}
        for topic in student['topics']:
            topic_questions = [q for q in all_questions if q['topic'] == topic]
            topic_results = [
                res for res in student['results'] 
                if res['questionId'] in [q['id'] for q in topic_questions]
            ]
            
            if not topic_results:
                student['progress'][topic] = 0
            else:
                correct_count = sum(1 for res in topic_results if res['correct'])
                student['progress'][topic] = round((correct_count / len(topic_results)) * 100)

    return jsonify(all_students)


@app.route('/api/quiz', methods=['GET'])
def generate_quiz():
    """Generates 5 random questions for a given topic."""
    topic = request.args.get('topic')
    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    topic_questions = [q for q in db['questions'] if q['topic'] == topic]
    
    # If not enough questions, return what we have
    num_questions_to_select = min(len(topic_questions), 5)
    
    selected_questions = random.sample(topic_questions, num_questions_to_select)
    
    return jsonify(selected_questions)

if __name__ == '__main__':
    # For local development, not used by Render
    app.run(debug=True, port=5001)