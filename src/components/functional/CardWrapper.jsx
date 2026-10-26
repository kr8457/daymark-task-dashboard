import React from 'react';

export default function CardWrapper({ children, className = '' }) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}
