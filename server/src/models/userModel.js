// In-Memory User Mock Data Store for REST API
let users = [
  {
    id: 'usr-1',
    name: 'Sandeepa Ilangasingha',
    email: 'sandeepa@example.com',
    password: 'password123', // In milestone 2 mock auth
    role: 'Lead Developer',
    avatarColor: '#10b981',
    createdAt: '2026-08-10',
  },
  {
    id: 'usr-2',
    name: 'Amara Fernando',
    email: 'amara@example.com',
    password: 'password123',
    role: 'UI/UX Designer',
    avatarColor: '#ec4899',
    createdAt: '2026-08-10',
  },
  {
    id: 'usr-3',
    name: 'Kasun Perera',
    email: 'kasun@example.com',
    password: 'password123',
    role: 'Frontend Developer',
    avatarColor: '#6366f1',
    createdAt: '2026-08-11',
  }
];

export const UserModel = {
  findAll: () => users,
  findByEmail: (email) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  findById: (id) => users.find(u => u.id === id),
  create: (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'Team Member',
      avatarColor: userData.avatarColor || '#6366f1',
      createdAt: new Date().toISOString().split('T')[0],
    };
    users.push(newUser);
    return newUser;
  }
};
