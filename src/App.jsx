import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ActivityLogger from './components/class/ActivityLogger.jsx';
import TaskForm from './components/functional/TaskForm.jsx';
import TaskList from './components/functional/TaskList.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import useLocalStorage from './hooks/useLocalStorage.js';

const starterTasks = [
  { id: 'welcome-1', title: 'Plan the week ahead', priority: 'High', completed: false },
  { id: 'welcome-2', title: 'Review notes from yesterday', priority: 'Medium', completed: false },
  { id: 'welcome-3', title: 'Make a little time for a break', priority: 'Low', completed: true },
];

function Header({ pendingCount }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="topbar">
      <a className="brand" href="#" aria-label="Daymark home">
        <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M8 17.5 13 22l11-12" /><path d="M16 3.5a12.5 12.5 0 1 0 12.5 12.5" /></svg></span>
        <span className="brand-name">daymark<span>.</span></span>
      </a>
      <div className="topbar-right">
        <div className="today-label"><span className="today-dot" /><span>{pendingCount === 0 ? 'All clear for today' : `${pendingCount} ${pendingCount === 1 ? 'task' : 'tasks'} in focus`}</span></div>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
          {theme === 'light' ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16.2 12.3A6.8 6.8 0 0 1 7.7 3.8 6.8 6.8 0 1 0 16.2 12.3Z" /></svg> : <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.5" /><path d="M10 1.8v2m0 12.4v2m8.2-8.2h-2M3.8 10h-2m14-5.8-1.4 1.4m-8.8 8.8-1.4 1.4m11.6 0-1.4-1.4m-8.8-8.8L4.2 4.2" /></svg>}
        </button>
        <div className="avatar" aria-label="Your profile">K</div>
      </div>
    </header>
  );
}

function Dashboard() {
  const [tasks, setTasks] = useLocalStorage('daymark-tasks', starterTasks);
  const [activity, setActivity] = useState(null);
  const pendingCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  useEffect(() => {
    document.title = pendingCount > 0 ? `(${pendingCount}) Daymark — your work, in focus` : 'Daymark — all caught up';
  }, [pendingCount]);

  const addTask = useCallback(({ title, priority }) => {
    const task = { id: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, title, priority, completed: false };
    setTasks((currentTasks) => [task, ...currentTasks]);
    setActivity({ id: `${task.id}-added`, type: 'added', message: `Added “${title}” to your tasks`, createdAt: new Date().toISOString() });
  }, [setTasks]);

  const toggleTask = useCallback((taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    setTasks((currentTasks) => currentTasks.map((item) => item.id === taskId ? { ...item, completed: !item.completed } : item));
    setActivity({
      id: `${taskId}-${Date.now()}`,
      type: task.completed ? 'added' : 'completed',
      message: task.completed ? `Reopened “${task.title}”` : `Completed “${task.title}”`,
      createdAt: new Date().toISOString(),
    });
  }, [setTasks, tasks]);

  const deleteTask = useCallback((taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    setTasks((currentTasks) => currentTasks.filter((item) => item.id !== taskId));
    setActivity({ id: `${taskId}-${Date.now()}`, type: 'deleted', message: `Removed “${task.title}”`, createdAt: new Date().toISOString() });
  }, [setTasks, tasks]);

  return (
    <>
      <Header pendingCount={pendingCount} />
      <main className="dashboard">
        <section className="welcome-section">
          <div className="welcome-copy">
            <p className="date-line"><span className="date-sparkle" aria-hidden="true">✳</span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1>A little progress<br /><span>goes a long way.</span></h1>
            <p className="welcome-subtitle">Keep your focus on what matters today.</p>
          </div>
          <div className="progress-card" aria-label={`${pendingCount} tasks remaining`}>
            <div className="progress-ring">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle className="ring-track" cx="50" cy="50" r="43" />
                <circle className="ring-progress" cx="50" cy="50" r="43" style={{ strokeDashoffset: 270 - (tasks.length ? (tasks.filter((task) => task.completed).length / tasks.length) * 270 : 0) }} />
              </svg>
              <div className="ring-label"><strong>{tasks.length ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0}<span>%</span></strong><small>complete</small></div>
            </div>
            <div className="progress-copy">
              <span className="progress-kicker">TODAY’S PROGRESS</span>
              <strong>{pendingCount === 0 ? 'Beautifully done' : `${pendingCount} to go`}</strong>
              <span>{tasks.filter((task) => task.completed).length} of {tasks.length} tasks complete</span>
            </div>
            <span className="progress-sparkle" aria-hidden="true">✦</span>
          </div>
        </section>
        <div className="workspace-grid">
          <div className="main-column">
            <TaskForm onAddTask={addTask} />
            <TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
          </div>
          <aside className="side-column">
            <ActivityLogger activity={activity} />
            <div className="quote-card">
              <span className="quote-mark" aria-hidden="true">“</span>
              <p>Small steps every day add up to big change.</p>
              <span className="quote-credit">A GENTLE REMINDER</span>
              <span className="quote-decoration" aria-hidden="true">✳</span>
            </div>
          </aside>
        </div>
        <footer className="footer"><span>Made for a more mindful workday.</span><span><span className="footer-dot" /> Your tasks stay on this device</span></footer>
      </main>
    </>
  );
}

export default function App() {
  return <ThemeProvider><Dashboard /></ThemeProvider>;
}
