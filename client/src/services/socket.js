import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.origin : 'http://localhost:5000');

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.currentRoom = null;
  }

  connect() {
    if (this.socket && this.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('[Socket.io] Connected to server with ID:', this.socket.id);
      if (this.currentRoom) {
        this.socket.emit('join_project', this.currentRoom);
      }
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('[Socket.io] Disconnected from server');
    });

    return this.socket;
  }

  joinProjectRoom(projectId) {
    if (!projectId) return;
    this.currentRoom = projectId;
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_project', projectId);
    }
  }

  leaveProjectRoom(projectId) {
    if (!projectId) return;
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave_project', projectId);
    }
    if (this.currentRoom === projectId) {
      this.currentRoom = null;
    }
  }

  on(event, callback) {
    if (!this.socket) this.connect();
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
export default socketService;
