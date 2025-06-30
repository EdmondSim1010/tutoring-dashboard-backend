// src/App.tsx
import React, { useState, useEffect } from 'react';
import StudentList, { IStudent } from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import './App.css';

function App() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error("API URL not configured. Please set REACT_APP_API_URL in .env");
        }
        const response = await fetch(`${apiUrl}/api/students`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}. Is the backend running and the API URL correct?</div>;

  return (
    <div className="App">
      <h1>Tutor Dashboard</h1>
      {selectedStudent ? (
        <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
      ) : (
        <StudentList students={students} onSelectStudent={setSelectedStudent} />
      )}
    </div>
  );
}

export default App;