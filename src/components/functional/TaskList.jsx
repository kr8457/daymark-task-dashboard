import React, { useMemo, useState } from 'react';
import TaskCard from './TaskCard.jsx';

const filters = ['All', 'Active', 'Completed'];

export default function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All priorities');
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesStatus = statusFilter === 'All'
      || (statusFilter === 'Active' && !task.completed)
      || (statusFilter === 'Completed' && task.completed);
    const matchesPriority = priorityFilter === 'All priorities' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  }), [priorityFilter, statusFilter, tasks]);
  const activeCount = tasks.filter((task) => !task.completed).length;

  return (
    <section className="task-list-section" aria-labelledby="tasks-heading">
      <div className="section-heading">
        <div className="section-title-group"><h2 id="tasks-heading">Your tasks</h2><span className="task-count">{activeCount} left</span></div>
        <label className="filter-select-wrap">
          <span className="sr-only">Filter by priority</span>
          <select className="filter-select" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
            <option>All priorities</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
          <span className="select-chevron" aria-hidden="true">⌄</span>
        </label>
      </div>
      <div className="filter-tabs" role="tablist" aria-label="Filter tasks by status">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-tab ${statusFilter === filter ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={statusFilter === filter}
            onClick={() => setStatusFilter(filter)}
          >
            {filter}{filter === 'All' && <span className="filter-total">{tasks.length}</span>}
          </button>
        ))}
      </div>
      <div className="task-list">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} />
        )) : (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">{tasks.length ? '✦' : '✓'}</span>
            <h3>{tasks.length ? 'No tasks in this view' : 'A little breathing room'}</h3>
            <p>{tasks.length ? 'Try another filter, or add a task to this list.' : 'You’re all caught up. Add a task whenever you’re ready.'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
