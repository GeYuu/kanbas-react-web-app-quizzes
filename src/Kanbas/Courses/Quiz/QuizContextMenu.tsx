import React from 'react';

interface QuizContextMenuProps {
    quizId: string;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onPublish: () => void;
    isPublished: boolean;
}

const QuizContextMenu: React.FC<QuizContextMenuProps> = ({ onClose, onEdit, onDelete, onPublish, isPublished }) => {
    return (
        <div className="quiz-context-menu bg-white border rounded shadow-sm p-2" style={{ position: 'absolute' }}>
            <button className="btn btn-link text-start w-100" onClick={onEdit}>Edit</button>
            <button className="btn btn-link text-start w-100 text-danger" onClick={onDelete}>Delete</button>
            <button className="btn btn-link text-start w-100" onClick={onPublish}>
                {isPublished ? 'Unpublish' : 'Publish'}
            </button>
            <button className="btn btn-link text-start w-100" onClick={onClose}>Close</button>
        </div>
    );
};

export default QuizContextMenu;