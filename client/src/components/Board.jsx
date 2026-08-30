import React from 'react';
import Column from './Column';
import '../styles/Board.css';

export default function Board({ tasks, onEditTask, onDeleteTask, onStatusChange, onAddTaskClick }) {
  const columns = [
    { key: 'todo', title: 'To Do' },
    { key: 'doing', title: 'Doing' },
    { key: 'done', title: 'Done' },
  ];

  return (
    <div className="kanban-board">
      <div className="board-grid">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.key);
          return (
            <Column
              key={col.key}
              statusKey={col.key}
              title={col.title}
              tasks={columnTasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onStatusChange={onStatusChange}
              onAddTaskClick={onAddTaskClick}
            />
          );
        })}
      </div>
    </div>
  );
}
