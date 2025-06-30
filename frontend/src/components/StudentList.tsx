// src/components/StudentList.tsx
import React from 'react';

// Define the type for a student object
export interface IStudent {
  id: number;
  name: string;
  topics: string[];
  progress: { [key: string]: number };
}

interface StudentListProps {
  students: IStudent[];
  onSelectStudent: (student: IStudent) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent }) => {
  return (
    <div>
      <h2>Students</h2>
      <div className="student-list">
        {students.map(student => (
          <div key={student.id} className="student-card" onClick={() => onSelectStudent(student)}>
            <h3>{student.name}</h3>
            {Object.entries(student.progress).map(([topic, percent]) => (
              <div key={topic}>
                <p>{topic}</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${percent}%` }}>
                    {percent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;