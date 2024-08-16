import React, { useState, useEffect } from 'react';

type BlankAnswer = {
  id: string;
  text: string;
};

type FillInBlankQuestionProps = {
  question: {
    id: string;
    title: string;
    points: number;
    questionText: string;
    correctAnswers: BlankAnswer[];
  };
  onUpdate: (updatedQuestion: any) => void;
};

const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({ question, onUpdate }) => {
  const [questionText, setQuestionText] = useState(question.questionText);
  const [title, setTitle] = useState(question.title);
  const [points, setPoints] = useState(question.points);
  const [correctAnswers, setCorrectAnswers] = useState<BlankAnswer[]>(question.correctAnswers);

  useEffect(() => {
    onUpdate({
      ...question,
      title,
      points,
      questionText,
      correctAnswers,
    });
  }, [title, points, questionText, correctAnswers]);

  const handleAnswerChange = (index: number, updatedAnswer: Partial<BlankAnswer>) => {
    const updatedAnswers = correctAnswers.map((answer, i) =>
      i === index ? { ...answer, ...updatedAnswer } : answer
    );
    setCorrectAnswers(updatedAnswers);
  };

  const addAnswer = () => {
    setCorrectAnswers([...correctAnswers, { id: new Date().getTime().toString(), text: '' }]);
  };

  const removeAnswer = (index: number) => {
    setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
  };

  return (
    <div className="fill-in-blank-question">
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
        <label className="form-label">Correct Answers</label>
        {correctAnswers.map((answer, index) => (
          <div key={answer.id} className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              value={answer.text}
              onChange={(e) =>
                handleAnswerChange(index, { text: e.target.value })
              }
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeAnswer(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={addAnswer}>
          + Add Answer
        </button>
      </div>
    </div>
  );
};

export default FillInBlankQuestion;
