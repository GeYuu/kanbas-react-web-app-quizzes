import React, { useState, useEffect } from 'react';

type TrueFalseQuestionProps = {
  question: {
    id: string;
    title: string;
    points: number;
    questionText: string;
    isTrue: boolean;
  };
  onUpdate: (updatedQuestion: any) => void;
};

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ question, onUpdate }) => {
  const [isTrue, setIsTrue] = useState(question.isTrue);
  const [questionText, setQuestionText] = useState(question.questionText);
  const [title, setTitle] = useState(question.title);
  const [points, setPoints] = useState(question.points);

  useEffect(() => {
    onUpdate({
      ...question,
      title,
      points,
      questionText,
      isTrue,
    });
  }, [title, points, questionText, isTrue]);

  return (
    <div className="true-false-question">
      <div className="mb-3">
        <label htmlFor={`question-title-${question.id}`} className="form-label">Title</label>
        <input
          type="text"
          id={`question-title-${question.id}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor={`question-points-${question.id}`} className="form-label">Points</label>
        <input
          type="number"
          id={`question-points-${question.id}`}
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor={`question-text-${question.id}`} className="form-label">Question</label>
        <textarea
          id={`question-text-${question.id}`}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Correct Answer</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`true-false-${question.id}`}
            id={`true-${question.id}`}
            checked={isTrue === true}
            onChange={() => setIsTrue(true)}
          />
          <label className="form-check-label" htmlFor={`true-${question.id}`}>
            True
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name={`true-false-${question.id}`}
            id={`false-${question.id}`}
            checked={isTrue === false}
            onChange={() => setIsTrue(false)}
          />
          <label className="form-check-label" htmlFor={`false-${question.id}`}>
            False
          </label>
        </div>
      </div>
    </div>
  );
};

export default TrueFalseQuestion;
