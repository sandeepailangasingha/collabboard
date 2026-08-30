// In-Memory Task Mock Data Store for REST API
let tasks = [
  {
    id: 'task-1',
    title: 'Design Wireframes & UI Kit',
    description: 'Create Figma wireframes for dashboard, task cards, and modal dialogs with dark theme palette.',
    status: 'todo',
    priority: 'high',
    assignee: {
      name: 'Amara Fernando',
      initials: 'AF',
      color: '#ec4899',
    },
    createdDate: '2026-08-10',
    dueDate: '2026-08-18',
    tags: ['UI/UX', 'Design'],
  },
  {
    id: 'task-2',
    title: 'Setup React Project Structure',
    description: 'Initialize Vite React project, configure component directory structure and modular CSS architecture.',
    status: 'doing',
    priority: 'high',
    assignee: {
      name: 'Kasun Perera',
      initials: 'KP',
      color: '#6366f1',
    },
    createdDate: '2026-08-11',
    dueDate: '2026-08-15',
    tags: ['Frontend', 'Setup'],
  },
  {
    id: 'task-3',
    title: 'Create Reusable TaskCard Component',
    description: 'Build TaskCard component displaying title, description, priority badge, dates, edit and delete action buttons.',
    status: 'doing',
    priority: 'medium',
    assignee: {
      name: 'Nimali Silva',
      initials: 'NS',
      color: '#10b981',
    },
    createdDate: '2026-08-12',
    dueDate: '2026-08-16',
    tags: ['React', 'Components'],
  },
  {
    id: 'task-4',
    title: 'Implement Express REST API Server',
    description: 'Build Node.js and Express REST API backend with controllers, routes, and JWT authentication endpoints.',
    status: 'todo',
    priority: 'high',
    assignee: {
      name: 'Sandeepa Ilangasingha',
      initials: 'SI',
      color: '#10b981',
    },
    createdDate: '2026-08-13',
    dueDate: '2026-08-20',
    tags: ['Backend', 'Express', 'API'],
  },
  {
    id: 'task-5',
    title: 'Draft Project Requirements Document',
    description: 'Outline sprint backlog deliverables, component tree diagram, and state management strategy for group evaluation.',
    status: 'done',
    priority: 'high',
    assignee: {
      name: 'Amara Fernando',
      initials: 'AF',
      color: '#ec4899',
    },
    createdDate: '2026-08-08',
    dueDate: '2026-08-12',
    tags: ['Docs', 'Planning'],
  },
  {
    id: 'task-6',
    title: 'Configure Color Palette & Typography',
    description: 'Set up global CSS variables for dark mode theme, glassmorphism shadows, and responsive layout grid.',
    status: 'done',
    priority: 'low',
    assignee: {
      name: 'Kasun Perera',
      initials: 'KP',
      color: '#6366f1',
    },
    createdDate: '2026-08-09',
    dueDate: '2026-08-11',
    tags: ['CSS', 'Styling'],
  },
];

export const TaskModel = {
  findAll: (filter = {}) => {
    let result = [...tasks];
    if (filter.status && filter.status !== 'all') {
      result = result.filter(t => t.status === filter.status);
    }
    if (filter.priority && filter.priority !== 'all') {
      result = result.filter(t => t.priority === filter.priority);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        (t.assignee && t.assignee.name.toLowerCase().includes(q))
      );
    }
    return result;
  },
  findById: (id) => tasks.find(t => t.id === id),
  create: (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee || { name: 'Unassigned', initials: 'UN', color: '#6b7280' },
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      tags: taskData.tags || ['General'],
    };
    tasks.unshift(newTask);
    return newTask;
  },
  update: (id, updates) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
  },
  delete: (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  }
};
