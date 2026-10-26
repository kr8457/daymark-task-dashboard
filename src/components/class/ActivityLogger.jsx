import React, { Component } from 'react';

const STORAGE_KEY = 'daymark-activity';

export default class ActivityLogger extends Component {
  state = { logs: [], toast: '' };
  toastTimer = null;

  componentDidMount() {
    try {
      const savedLogs = window.localStorage.getItem(STORAGE_KEY);
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs);
        if (Array.isArray(parsedLogs)) this.setState({ logs: parsedLogs });
      }
    } catch (error) {
      console.error('Could not load saved activity.', error);
    }
  }

  componentDidUpdate(previousProps, previousState) {
    if (this.props.activity && this.props.activity.id !== previousProps.activity?.id) {
      this.setState((state) => ({ logs: [this.props.activity, ...state.logs].slice(0, 20) }));
    }
    if (previousState.logs !== this.state.logs) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.logs));
      } catch (error) {
        console.error('Could not save activity.', error);
      }
      this.setState({ toast: this.state.logs[0]?.message || '' });
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => this.setState({ toast: '' }), 2800);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.toastTimer);
  }

  render() {
    const { logs, toast } = this.state;
    return (
      <>
        <section className="activity-section" aria-labelledby="activity-heading">
          <div className="activity-heading">
            <div><p className="eyebrow">YOUR MOMENTUM</p><h2 id="activity-heading">Recent activity</h2></div>
            <span className="activity-pulse" aria-hidden="true" />
          </div>
          {logs.length > 0 ? (
            <ol className="activity-list">
              {logs.slice(0, 4).map((log) => (
                <li className="activity-item" key={log.id}>
                  <span className={`activity-marker ${log.type}`} aria-hidden="true">{log.type === 'completed' ? '✓' : log.type === 'deleted' ? '−' : '+'}</span>
                  <div className="activity-copy">
                    <p>{log.message}</p>
                    <time dateTime={log.createdAt}>{new Date(log.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time>
                  </div>
                </li>
              ))}
            </ol>
          ) : <p className="activity-empty">Your task updates will show up here.</p>}
        </section>
        <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
          <span className="toast-check" aria-hidden="true">✓</span>{toast}
        </div>
      </>
    );
  }
}
