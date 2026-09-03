import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing old collections for fresh Milestone 3 seed...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    // 1. Create Users
    console.log('Creating demo team users...');
    const users = await User.create([
      {
        name: 'Sandeepa Ilangasingha',
        email: 'sandeepa@example.com',
        password: 'password123',
        role: 'Team Lead & Full-Stack Developer',
        avatarColor: '#10b981',
      },
      {
        name: 'Amara Fernando',
        email: 'amara@example.com',
        password: 'password123',
        role: 'UI/UX Designer',
        avatarColor: '#ec4899',
      },
      {
        name: 'Kasun Perera',
        email: 'kasun@example.com',
        password: 'password123',
        role: 'Frontend Engineer',
        avatarColor: '#6366f1',
      },
      {
        name: 'Nirman Jayarathna',
        email: 'nirman@example.com',
        password: 'password123',
        role: 'Backend Architect',
        avatarColor: '#f59e0b',
      },
    ]);

    const leadUser = users[0];

    // 2. Create Multiple Projects
    console.log('Creating multiple projects...');
    const project1 = await Project.create({
      name: 'Project Alpha — SyncBoard Client',
      description: 'Collaborative Kanban task board integrated with Node.js Express REST API & MongoDB Atlas.',
      color: '#6366f1',
      owner: leadUser._id,
      members: users.map(u => u._id),
      status: 'active',
    });

    const project2 = await Project.create({
      name: 'Mobile App — Team Tracker',
      description: 'React Native companion app for cross-platform team attendance and real-time task notifications.',
      color: '#10b981',
      owner: leadUser._id,
      members: [users[0]._id, users[1]._id],
      status: 'active',
    });

    const project3 = await Project.create({
      name: 'E-Commerce Microservices Engine',
      description: 'Scalable cloud backend microservices handling inventory, payment gateways, and order queues.',
      color: '#f59e0b',
      owner: leadUser._id,
      members: [users[0]._id, users[3]._id],
      status: 'active',
    });

    // 3. Create Tasks for Project 1 (SyncBoard Client)
    console.log('Creating tasks for Project 1...');
    await Task.create([
      {
        title: 'Setup MongoDB Atlas Cluster & Mongoose ODM',
        description: 'Configure cloud database cluster, secure connection string, and build Mongoose schemas for users, projects, and tasks.',
        status: 'done',
        priority: 'high',
        assignee: 'Sandeepa Ilangasingha',
        dueDate: '2026-09-02',
        tags: ['Database', 'MongoDB', 'Backend'],
        project: project1._id,
        createdBy: leadUser._id,
      },
      {
        title: 'Design Multi-Project UI Switcher & Navigation',
        description: 'Create responsive project dropdown selector and modal in Navbar to switch boards seamlessly.',
        status: 'doing',
        priority: 'high',
        assignee: 'Kasun Perera',
        dueDate: '2026-09-05',
        tags: ['Frontend', 'UI/UX', 'Navbar'],
        project: project1._id,
        createdBy: leadUser._id,
      },
      {
        title: 'Implement JWT Authentication Guard & Profile State',
        description: 'Store JWT bearer token in localStorage, handle auto-login, and verify auth token via /api/auth/me.',
        status: 'done',
        priority: 'medium',
        assignee: 'Amara Fernando',
        dueDate: '2026-08-30',
        tags: ['Security', 'JWT', 'Auth'],
        project: project1._id,
        createdBy: leadUser._id,
      },
      {
        title: 'Build Comprehensive Postman Collection Export',
        description: 'Document all REST API endpoints for Auth, Projects, and Tasks with sample JSON payloads.',
        status: 'todo',
        priority: 'medium',
        assignee: 'Nirman Jayarathna',
        dueDate: '2026-09-08',
        tags: ['API', 'Postman', 'Documentation'],
        project: project1._id,
        createdBy: leadUser._id,
      },
      {
        title: 'Prepare Milestone 3 Assignment Report with Atlas Screenshots',
        description: 'Compile Word report covering Introduction (6 sections), Atlas Cluster, Mongoose code, and test proofs.',
        status: 'todo',
        priority: 'low',
        assignee: 'Sandeepa Ilangasingha',
        dueDate: '2026-09-12',
        tags: ['Report', 'Milestone 3'],
        project: project1._id,
        createdBy: leadUser._id,
      },
    ]);

    // 4. Create Tasks for Project 2 (Mobile App)
    console.log('Creating tasks for Project 2...');
    await Task.create([
      {
        title: 'Setup React Native Expo Boilerplate',
        description: 'Initialize Expo managed project with TypeScript and React Navigation stack.',
        status: 'done',
        priority: 'high',
        assignee: 'Kasun Perera',
        dueDate: '2026-09-04',
        tags: ['Mobile', 'Expo'],
        project: project2._id,
        createdBy: leadUser._id,
      },
      {
        title: 'Design Mobile Kanban Card Gestures',
        description: 'Implement swipeable gesture handlers for quick status updates on mobile touch screens.',
        status: 'doing',
        priority: 'medium',
        assignee: 'Amara Fernando',
        dueDate: '2026-09-09',
        tags: ['Gestures', 'Mobile UI'],
        project: project2._id,
        createdBy: leadUser._id,
      },
      {
        title: 'Integrate Push Notification Service via Firebase',
        description: 'Send alerts when tasks are assigned or moved to review columns.',
        status: 'todo',
        priority: 'medium',
        assignee: 'Sandeepa Ilangasingha',
        dueDate: '2026-09-15',
        tags: ['Notifications', 'FCM'],
        project: project2._id,
        createdBy: leadUser._id,
      },
    ]);

    // 5. Create Tasks for Project 3 (E-Commerce Engine)
    console.log('Creating tasks for Project 3...');
    await Task.create([
      {
        title: 'Implement Stripe Payment Webhook Listener',
        description: 'Verify cryptographic signatures and dispatch order completion events.',
        status: 'doing',
        priority: 'high',
        assignee: 'Nirman Jayarathna',
        dueDate: '2026-09-07',
        tags: ['Stripe', 'Payment', 'Backend'],
        project: project3._id,
        createdBy: leadUser._id,
      },
      {
        title: 'Setup Redis Caching for Product Catalog',
        description: 'Cache high-velocity read requests to reduce primary database load.',
        status: 'todo',
        priority: 'low',
        assignee: 'Sandeepa Ilangasingha',
        dueDate: '2026-09-14',
        tags: ['Redis', 'Cache', 'Performance'],
        project: project3._id,
        createdBy: leadUser._id,
      },
    ]);

    console.log('================================================');
    console.log('SUCCESS: Seeded MongoDB Atlas with 4 Users, 3 Projects, and 10 Tasks!');
    console.log('================================================');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
