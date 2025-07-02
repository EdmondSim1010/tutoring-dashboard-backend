# backend/app.py
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app) 

# --- Helper Functions (no change here) ---
def load_db():
    with open('db.json', 'r') as f:
        return json.load(f)

def save_db(db_data):
    with open('db.json', 'w') as f:
        json.dump(db_data, f, indent=2)

# --- API Endpoints ---

@app.route('/api/students', methods=['GET'])
def get_students():
    """
    UPDATED: Returns students with progress calculated per topic within each subject.
    The new progress object will look like:
    "progress": {
      "Physics": { "Special Relativity": 100, "The Motor Effect": 0 },
      "Mathematics Advanced": { "Calculus - Differentiation": 100, ... }
    }
    """
    db = load_db()
    all_students = db['students']
    all_questions = db['questions']

    # Calculate progress for each student
    for student in all_students:
        student['progress'] = {}
        # Iterate through the subjects the student is enrolled in
        for subject in student['subjects']:
            student['progress'][subject] = {}
            
            # Find all unique topics within this subject from the main question list
            subject_topics = set(q['topic'] for q in all_questions if q['subject'] == subject)
            
            # For each topic, calculate the student's accuracy
            for topic in subject_topics:
                # Get all questions for this specific subject and topic
                topic_questions = [q for q in all_questions if q['subject'] == subject and q['topic'] == topic]
                topic_question_ids = [q['id'] for q in topic_questions]
                
                # Get the student's results for these specific questions
                topic_results = [res for res in student['results'] if res['questionId'] in topic_question_ids]
                
                if not topic_results:
                    student['progress'][subject][topic] = 0  # No attempts for this topic
                else:
                    correct_count = sum(1 for res in topic_results if res['correct'])
                    student['progress'][subject][topic] = round((correct_count / len(topic_results)) * 100)

    return jsonify(all_students)


@app.route('/api/quiz', methods=['GET'])
def generate_quiz():
    """
    UPDATED: Generates 5 random questions for a given SUBJECT and TOPIC.
    """
    db = load_db()
    subject = request.args.get('subject')
    topic = request.args.get('topic')
    
    if not subject or not topic:
        return jsonify({"error": "Subject and Topic are required"}), 400

    # Filter questions by both subject and topic
    relevant_questions = [q for q in db['questions'] if q['subject'] == subject and q['topic'] == topic]
    
    if not relevant_questions:
        return jsonify({"error": "No questions found for this subject/topic combination"}), 404

    num_questions_to_select = min(len(relevant_questions), 5)
    selected_questions = random.sample(relevant_questions, num_questions_to_select)
    
    # Add the answer to the quiz data for the frontend
    return jsonify(selected_questions)


# The /api/result endpoint does not need any changes, it still works the same.
@app.route('/api/result', methods=['POST'])
def add_result():
    db = load_db()
    data = request.get_json()
    student_id = data.get('studentId')
    question_id = data.get('questionId')
    is_correct = data.get('correct')

    if student_id is None or question_id is None or is_correct is None:
        return jsonify({"error": "Missing studentId, questionId, or correct status"}), 400

    student_found = next((s for s in db['students'] if s['id'] == student_id), None)

    if not student_found:
        return jsonify({"error": "Student not found"}), 404

    student_found['results'].append({"questionId": question_id, "correct": is_correct})
    save_db(db)
    
    return jsonify({"message": "Result added successfully", "student": student_found}), 201


if __name__ == '__main__':
    app.run(debug=True, port=5001)