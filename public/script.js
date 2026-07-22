class ChatBot {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
    this.initializeTheme();
    this.messageHistory = [];
    this.isTyping = false;
  }

  initializeElements() {
    // Main elements
    this.welcomeSection = document.getElementById('welcomeSection');
    this.messagesContainer = document.getElementById('messagesContainer');
    this.messages = document.getElementById('messages');
    this.messageInput = document.getElementById('messageInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.toastContainer = document.getElementById('toastContainer');
    
    // Header elements
    this.themeToggle = document.getElementById('themeToggle');
    this.clearChat = document.getElementById('clearChat');
    
    // Input elements
    this.charCount = document.getElementById('charCount');
    this.attachBtn = document.getElementById('attachBtn');
    
    // Suggestion chips
    this.suggestionChips = document.querySelectorAll('.chip');
  }

  initializeEventListeners() {
    // Send message events
    this.sendBtn.addEventListener('click', () => this.handleSendMessage());
    this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.messageInput.addEventListener('input', () => this.handleInputChange());
    
    // Header actions
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.clearChat.addEventListener('click', () => this.clearConversation());
    
    // Suggestion chips
    this.suggestionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const message = chip.dataset.message;
        this.messageInput.value = message;
        this.handleInputChange();
        this.handleSendMessage();
      });
    });

    // Auto-resize textarea
    this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('chatbot-theme') || 'light';
    this.setTheme(savedTheme);
  }

  handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    }
  }

  handleInputChange() {
    const value = this.messageInput.value.trim();
    const length = this.messageInput.value.length;
    
    // Update character count
    this.charCount.textContent = `${length}/2000`;
    
    // Update send button state
    this.sendBtn.disabled = !value || this.isTyping;
    
    // Update character count color
    if (length > 1800) {
      this.charCount.style.color = 'var(--error-color)';
    } else if (length > 1500) {
      this.charCount.style.color = 'var(--warning-color)';
    } else {
      this.charCount.style.color = 'var(--text-tertiary)';
    }
  }

  autoResizeTextarea() {
    this.messageInput.style.height = 'auto';
    this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 128) + 'px';
  }

  async handleSendMessage() {
    const message = this.messageInput.value.trim();
    if (!message || this.isTyping) return;

    // Hide welcome section and show messages
    this.showMessagesContainer();
    
    // Add user message
    this.addMessage(message, 'user');
    
    // Clear input
    this.messageInput.value = '';
    this.handleInputChange();
    this.autoResizeTextarea();
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      const response = await this.sendMessageToServer(message);
      this.hideTypingIndicator();
      
      if (response.reply) {
        this.addMessage(response.reply, 'bot');
      } else {
        throw new Error(response.error || 'Unknown error occurred');
      }
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      this.showToast('Error', error.message, 'error');
      console.error('Chat error:', error);
    }
  }

  async sendMessageToServer(message) {
    const endpoint =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? '/chat'
        : '/.netlify/functions/chat';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  showMessagesContainer() {
    this.welcomeSection.classList.add('hidden');
    this.messagesContainer.classList.add('visible');
  }

  addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = this.formatTime(new Date());
    
    content.appendChild(bubble);
    content.appendChild(time);
    messageElement.appendChild(avatar);
    messageElement.appendChild(content);
    
    this.messages.appendChild(messageElement);
    this.scrollToBottom();
    
    // Store message in history
    this.messageHistory.push({ text, sender, timestamp: new Date() });
  }

  showTypingIndicator() {
    this.isTyping = true;
    this.sendBtn.disabled = true;
    
    const typingElement = document.createElement('div');
    typingElement.className = 'message bot typing';
    typingElement.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-content">
        <div class="typing-indicator">
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
          <span>AI is thinking...</span>
        </div>
      </div>
    `;
    
    this.messages.appendChild(typingElement);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isTyping = false;
    this.handleInputChange();
    
    const typingElement = this.messages.querySelector('.typing');
    if (typingElement) {
      typingElement.remove();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 100);
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('chatbot-theme', theme);
    
    const icon = this.themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
      this.themeToggle.title = 'Switch to light mode';
    } else {
      icon.className = 'fas fa-moon';
      this.themeToggle.title = 'Switch to dark mode';
    }
  }

  clearConversation() {
    if (this.messageHistory.length === 0) {
      this.showToast('Info', 'No conversation to clear', 'warning');
      return;
    }

    // Show confirmation
    if (confirm('Are you sure you want to clear the conversation?')) {
      this.messages.innerHTML = '';
      this.messageHistory = [];
      this.messagesContainer.classList.remove('visible');
      this.welcomeSection.classList.remove('hidden');
      this.showToast('Success', 'Conversation cleared', 'success');
    }
  }

  showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="${iconMap[type]}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;
    
    this.toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('visible'), 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  showLoadingOverlay() {
    this.loadingOverlay.classList.add('visible');
  }

  hideLoadingOverlay() {
    this.loadingOverlay.classList.remove('visible');
  }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ChatBot();
});

// Add some utility functions for enhanced UX
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Focus input when user returns to tab
    const messageInput = document.getElementById('messageInput');
    if (messageInput && !messageInput.disabled) {
      messageInput.focus();
    }
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K to focus input
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
      messageInput.focus();
    }
  }
  
  // Escape to clear input
  if (e.key === 'Escape') {
    const messageInput = document.getElementById('messageInput');
    if (messageInput && document.activeElement === messageInput) {
      messageInput.value = '';
      messageInput.dispatchEvent(new Event('input'));
    }
  }
});
