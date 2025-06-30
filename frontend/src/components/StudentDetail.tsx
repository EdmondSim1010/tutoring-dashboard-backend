// src/components/StudentDetail.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jsPDF } from 'jspdf';
import { IStudent } from './StudentList';

interface StudentDetailProps {
  student: IStudent;
  onBack: () => void;
}

const generateQuizPDF = async (studentName: string, topic: string) => {
    alert(`Generating quiz for ${topic}...`);
    try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/quiz?topic=${topic}`);
        if (!response.ok) throw new Error('Failed to fetch quiz questions');
        
        const questions = await response.json();

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Math & Physics Quiz: ${topic}`, 10, 20);
        doc.setFontSize(14);
        doc.text(`Student: ${studentName}`, 10, 30);
        
        doc.setFontSize(12);
        let yPos = 45;
        questions.forEach((q: any, index: number) => {
            const questionText = `${index + 1}. ${q.text} (Difficulty: ${q.difficulty})`;
            // Split text to handle wrapping
            const splitText = doc.splitTextToSize(questionText, 180);
            doc.text(splitText, 10, yPos);
            yPos += (splitText.length * 5) + 10; // Add space between questions
        });

        doc.save(`${studentName}-${topic}-Quiz.pdf`);

    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Could not generate quiz. See console for details.");
    }
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack }) => {
  const chartData = Object.entries(student.progress).map(([topic, accuracy]) => ({
    name: topic,
    accuracy,
  }));

  return (
    <div>
      <button onClick={onBack}>← Back to All Students</button>
      <h2>{student.name}'s Dashboard</h2>

      <h3>Progress by Topic</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Generate Weekly Quiz</h3>
      {student.topics.map(topic => (
        <button key={topic} className="quiz-button" onClick={() => generateQuizPDF(student.name, topic)}>
            Generate {topic} Quiz
        </button>
      ))}
    </div>
  );
};

export default StudentDetail;