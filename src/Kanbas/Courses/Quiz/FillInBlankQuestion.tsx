import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-wysiwyg';
import { FaTrash } from 'react-icons/fa';

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
  onDelete: (questionId: string) => void;
};

const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({ question, onUpdate, onDelete }) => {
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

  const handleUpdate = () => {
    onUpdate({
      ...question,
      title,
      points,
      questionText,
      correctAnswers,
    });
  };

  const handleDelete = () => {
    onDelete(question.id);
  };

  return (
    <div className="fill-in-blank-question position-relative">
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
        <label className="form-label">Correct Answers</label>
        {correctAnswers.map((answer, index) => (
          <div key={answer.id} className="mb-2 d-flex align-items-center">
            <label className="me-2 text-nowrap">Possible Answer:</label>
            <div className="flex-grow-1" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                value={answer.text}
                onChange={(e) =>
                  handleAnswerChange(index, { text: e.target.value })
                }
              />
            </div>
            <button
              type="button"
              className="btn btn-link text-danger p-0 ms-3"
              onClick={() => removeAnswer(index)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <p
          onClick={addAnswer}
          style={{ cursor: 'pointer' }}
          className="text-danger d-flex justify-content-end mt-4"
        >
          + Add Another Answer
        </p>
      </div>


      {/* these two buttons are next to each other at the left side of the screen */}
      <div className="d-flex justify-content-start">
        {/* update button */}
        <div>
          <button type="button" className="btn  btn-primary me-2" onClick={handleUpdate}>Update</button>
        </div>
        {/* delete button */}
        <div>
          <button type="button" className="btn  btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>



    </div >
  );
};

export default FillInBlankQuestion;