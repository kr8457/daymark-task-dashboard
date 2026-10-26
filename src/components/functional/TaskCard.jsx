import React from 'react';
import CardWrapper from './CardWrapper.jsx';

const priorityClass = { High: 'high', Medium: 'medium', Low: 'low' };

export default function TaskCard({ task, onToggleTask, onDeleteTask }) {
  return (
    <CardWrapper className={`task-card ${task.completed ? 'is-complete' : ''}`}>
      <button
        className={`task-check ${task.completed ? 'checked' : ''}`}
        type="button"
        onClick={() => onToggleTask(task.id)}
        aria-label={task.completed ? `Mark ${task.title} as active` : `Complete ${task.title}`}
        aria-pressed={task.completed}
      >
        {task.completed && <span aria-hidden="true">✓</span>}
      </button>
      <div className="task-content">
        <p className="task-title">{task.title}</p>
        <div className="task-meta">
          <span className={`priority-badge ${priorityClass[task.priority] || 'medium'}`}>
            <span className="priority-dot" aria-hidden="true" />{task.priority}
          </span>
          <span className="task-date">{task.completed ? 'Completed' : 'Added today'}</span>
        </div>
      </div>
      <button className="icon-button delete-button" type="button" onClick={() => onDeleteTask(task.id)} aria-label={`Delete ${task.title}`} title="Delete task">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12M8 6V4h4v2m2 0-.7 10H6.7L6 6m2.5 2.5v5m3-5v5" /></svg>
      </button>
    </CardWrapper>
  );
}
