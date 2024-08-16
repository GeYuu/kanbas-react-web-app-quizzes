import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-wysiwyg';
import { FaCircle, FaCheckCircle } from 'react-icons/fa';

type TrueFalseQuestionProps = {
  question: {
    id: string;
    title: string;
    points: number;
    questionText: string;
    correctAnswer: boolean;
  };
  onUpdate: (updatedQuestion: any) => void;
  onDelete: (questionId: string) => void;
};

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(question.title);
  const [points, setPoints] = useState(question.points);
  const [questionText, setQuestionText] = useState(question.questionText);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer);

  useEffect(() => {
    onUpdate({
      ...question,
      title,
      points,
      questionText,
      correctAnswer,
    });
  }, [title, points, questionText, correctAnswer]);

  const handleUpdate = () => {
    onUpdate({
      ...question,
      title,
      points,
      questionText,
      correctAnswer,
    });
  };

  const handleDelete = () => {
    onDelete(question.id);
  };

  return (
    <div className="true-false-question position-relative">
      <div className="mb-3 row">
        <div className="col-8">
          <label htmlFor={`question-title-${question.id}`} className="form-label">Question Title</label>
          <input
            type="text"
            id={`question-title-${question.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-4">
          <label htmlFor={`question-points-${question.id}`} className="form-label">Points</label>
          <input
            type="number"
            id={`question-points-${question.id}`}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="form-control"
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={`question-text-${question.id}`} className="form-label">Question</label>
        <Editor
          id={`question-text-${question.id}`}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Correct Answer</label>
        <div className="d-flex">
          <div className="me-4 d-flex align-items-center">
            {correctAnswer ? (
              <FaCheckCircle
                onClick={() => setCorrectAnswer(true)}
                className="me-2"
                style={{
                  cursor: 'pointer',
                  color: 'green',
                  fontSize: '1.2rem',
                }}
              />
            ) : (
              <FaCircle
                onClick={() => setCorrectAnswer(true)}
                className="me-2"
                style={{
                  cursor: 'pointer',
                  color: 'gray',
                  fontSize: '1.2rem',
                }}
              />
            )}
            <span>True</span>
          </div>
          <div className="d-flex align-items-center">
            {!correctAnswer ? (
              <FaCheckCircle
                onClick={() => setCorrectAnswer(false)}
                className="me-2"
                style={{
                  cursor: 'pointer',
                  color: 'green',
                  fontSize: '1.2rem',
                }}
              />
            ) : (
              <FaCircle
                onClick={() => setCorrectAnswer(false)}
                className="me-2"
                style={{
                  cursor: 'pointer',
                  color: 'gray',
                  fontSize: '1.2rem',
                }}
              />
            )}
            <span>False</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-start">
        <button type="button" className="btn btn-primary me-2" onClick={handleUpdate}>Update</button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TrueFalseQuestion;