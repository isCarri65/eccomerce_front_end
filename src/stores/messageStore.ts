import { create } from "zustand";

interface Message {
  id: string;
  message: string;
  type: 'success' | 'error';
  duration?: number;
}

interface MessageState {
  messages: Message[];
  addMessage: (message: string, type: 'success' | 'error', duration?: number) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  
  addMessage: (message: string, type: 'success' | 'error', duration = 5000) => {
    const id = Date.now().toString();
    const newMessage: Message = { id, message, type, duration };
    
  set((state) => ({
      messages: [...state.messages, newMessage]
    }));

    // Auto-remove message after duration
    setTimeout(() => {
      get().removeMessage(id);
    }, duration);
  },

  removeMessage: (id: string) => {
    set((state) => ({
      messages: state.messages.filter(msg => msg.id !== id)
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  }
})); 