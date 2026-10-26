import React, { useEffect, useRef, useState } from 'react';
import CardWrapper from './CardWrapper.jsx';

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      inputRef.current?.focus();
      return;
    }
    onAddTask({ title: trimmedTitle, priority });
    setTitle('');
    setPriority('Medium');
    inputRef.current?.focus();
  }

  return (
    <CardWrapper className="quick-add-card">
      <div className="card-heading">
        <div><p className="eyebrow">MAKE IT HAPPEN</p><h2>Add a task</h2></div>
        <span className="heading-icon" aria-hidden="true">＋</span>
      </div>
      <form className="task-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="task-title">Task name</label>
        <input
          ref={inputRef}
          id="task-title"
          className="task-input"
          type="text"
          placeholder="What needs your attention?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
        />
        <div className="form-footer">
          <label className="priority-select-label" htmlFor="task-priority">
            <span className={`priority-dot ${priority.toLowerCase()}`} aria-hidden="true" />
            <span className="sr-only">Priority</span>
            <select id="task-priority" value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Task priority">
              <option value="Low">Low priority</option>
              <option value="Medium">Medium priority</option>
              <option value="High">High priority</option>
            </select>
            <span className="select-chevron" aria-hidden="true">⌄</span>
          </label>
          <button className="button button-primary add-button" type="submit"><span aria-hidden="true">＋</span> Add task</button>
        </div>
      </form>
      <p className="form-hint">Press enter to quickly add a task</p>
    </CardWrapper>
  );
}
