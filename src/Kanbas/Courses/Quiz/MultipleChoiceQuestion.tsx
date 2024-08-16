import React, { useState, useEffect } from 'react';

type Choice = {
  text: string;
  isCorrect: boolean;
};

type MultipleChoiceQuestionProps = {
  question: {
    id: string;
    title: string;
    points: number;
    questionText: string;
    choices: Choice[];
  };
  onUpdate: (updatedQuestion: any) => void;
};

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, onUpdate }) => {
  const [choices, setChoices] = useState<Choice[]>(question.choices);
  const [questionText, setQuestionText] = useState(question.questionText);
  const [title, setTitle] = useState(question.title);
  const [points, setPoints] = useState(question.points);

  useEffect(() => {
    onUpdate({
      ...question,
      title,
      points,
      questionText,
      choices,
    });
  }, [title, points, questionText, choices]);

  const handleChoiceChange = (index: number, updatedChoice: Partial<Choice>) => {
    const updatedChoices = choices.map((choice, i) =>
      i === index ? { ...choice, ...updatedChoice } : choice
    );
    setChoices(updatedChoices);
  };

  const addChoice = () => {
    setChoices([...choices, { text: '', isCorrect: false }]);
  };

  const removeChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  return (
    <div className="multiple-choice-question">
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
        <label className="form-label">Choices</label>
        {choices.map((choice, index) => (
          <div key={index} className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              value={choice.text}
              onChange={(e) =>
                handleChoiceChange(index, { text: e.target.value })
              }
            />
            <div className="input-group-text">
              <input
                type="radio"
                name={`correct-answer-${question.id}`}
                checked={choice.isCorrect}
                onChange={() => handleChoiceChange(index, { isCorrect: true })}
              />
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeChoice(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={addChoice}>
          + Add Choice
        </button>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
