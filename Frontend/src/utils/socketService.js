import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      return this.socket;
    }

    try {
      this.socket = io('http://localhost:5000', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: this.maxReconnectAttempts,
      });

      this.setupEventHandlers();
      return this.socket;
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      return null;
    }
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;

      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      this.reconnectAttempts++;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });
  }

  getSocket() {
    if (!this.socket || !this.isConnected) {
      return this.connect();
    }
    return this.socket;
  }

  on(event, callback) {
    const socket = this.getSocket();
    if (!socket) {
      console.error('Socket not available');
      return;
    }

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);

    socket.on(event, callback);
  }

  off(event, callback) {
    const socket = this.getSocket();
    if (!socket) return;

    if (callback) {
      socket.off(event, callback);
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    } else {
      socket.off(event);
      this.eventListeners.delete(event);
    }
  }

  emit(event, data) {
    const socket = this.getSocket();
    if (!socket) {
      console.error('Socket not available for emit');
      return;
    }

    socket.emit(event, data);
  }

  isSocketConnected() {
    return this.socket && this.isConnected;
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');

      this.eventListeners.forEach((listeners, event) => {
        listeners.forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      this.eventListeners.clear();

      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;

      console.log('✅ Socket disconnected');
    }
  }

  cleanup() {
    // Component cleanup - remove event listeners only
  }
}

const socketService = new SocketService();

export default socketService;