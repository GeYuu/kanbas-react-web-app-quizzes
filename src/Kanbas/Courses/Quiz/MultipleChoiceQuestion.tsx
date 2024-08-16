import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-wysiwyg';
import { FaCircle, FaCheckCircle, FaTrash } from 'react-icons/fa';

type Choice = {
  id: string;
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
  onDelete: (questionId: string) => void;
};

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(question.title);
  const [points, setPoints] = useState(question.points);
  const [questionText, setQuestionText] = useState(question.questionText);
  const [choices, setChoices] = useState<Choice[]>(question.choices);

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
      i === index
        ? { ...choice, ...updatedChoice }
        : { ...choice, isCorrect: false }
    );
    setChoices(updatedChoices);
  };

  const addChoice = () => {
    setChoices([...choices, { id: new Date().getTime().toString(), text: '', isCorrect: false }]);
  };

  const removeChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleDelete = () => {
    onDelete(question.id);
  };

  const handleUpdate = () => {
    onUpdate({
      ...question,
      title,
      points,
      questionText,
      choices,
    });
  };





  return (
    <div className="multiple-choice-question position-relative">
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
        <label className="form-label">Choices</label>
        {choices.map((choice, index) => (
          <div key={choice.id} className="mb-2 d-flex align-items-center">
            {choice.isCorrect ? (
              <FaCheckCircle
                onClick={() => handleChoiceChange(index, { isCorrect: false })}
                className="me-2"
                style={{
                  cursor: 'pointer',
                  color: 'green',
                  fontSize: '1.2rem',
                }}
              />
            ) : (
              <FaCircle
                onClick={() => handleChoiceChange(index, { isCorrect: true })}
                className="me-2"
                style={{
                  cursor: 'pointer',
                  color: 'gray',
                  fontSize: '1.2rem',
                }}
              />
            )}
            <div className="flex-grow-1" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                value={choice.text}
                onChange={(e) =>
                  handleChoiceChange(index, { text: e.target.value })
                }
              />
            </div>
            <button
              type="button"
              className="btn btn-link text-danger p-0 ms-3"
              onClick={() => removeChoice(index)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <p
          onClick={addChoice}
          style={{ cursor: 'pointer' }}
          className="text-danger d-flex justify-content-end mt-4"
        >
          + Add Another Choice
        </p>
      </div>

      <div className="d-flex justify-content-start">
        <button type="button" className="btn btn-primary me-2" onClick={handleUpdate}>Update</button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;