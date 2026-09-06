import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';

describe('SyncBoard Backend REST API & Real-Time Engine Tests', () => {
  test('GET /api - Status check returns online and real-time engine info', async () => {
    const res = await fetch(`${BASE_URL}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'online');
    assert.equal(data.realtime, 'Socket.io active');
  });

  test('GET /api/tasks returns 200 with tasks list', async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.tasks), 'tasks should be an array');
  });

  test('GET /api/projects without token should be protected (401)', async () => {
    const res = await fetch(`${BASE_URL}/projects`);
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  test('POST /api/auth/login with invalid credentials returns 401', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sandeepa@example.com', password: 'wrongpassword' }),
    });
    assert.equal(res.status, 401);
  });

  test('POST /api/auth/login with valid credentials returns authenticated JWT token', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sandeepa@example.com', password: 'password123' }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.token, 'Token must be present');
    assert.equal(data.user.email, 'sandeepa@example.com');
  });

  test('GET /api/projects with bearer token returns multi-project array', async () => {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sandeepa@example.com', password: 'password123' }),
    });
    const { token } = await loginRes.json();

    const projRes = await fetch(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(projRes.status, 200);
    const projData = await projRes.json();
    assert.equal(projData.success, true);
    assert.ok(Array.isArray(projData.projects), 'Projects should be an array');
  });
});
