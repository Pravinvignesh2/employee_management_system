import { Component, OnInit } from '@angular/core';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  template: `
    <!-- Floating Chat Button -->
    <div class="chatbot-button" (click)="toggleChat()" *ngIf="!isOpen">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Chat Window -->
    <div class="chatbot-window" *ngIf="isOpen">
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>AI Assistant</span>
        </div>
        <button class="chatbot-close" (click)="toggleChat()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="chatbot-messages" #messagesContainer>
        <div class="message" [ngClass]="message.isUser ? 'user-message' : 'bot-message'" *ngFor="let message of messages">
          <div class="message-avatar" *ngIf="!message.isUser">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ message.timestamp | date:'shortTime' }}</div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="chatbot-input">
        <input 
          type="text" 
          placeholder="Type your message..." 
          [(ngModel)]="userInput"
          (keyup.enter)="sendMessage()"
          [disabled]="isLoading"
          class="chatbot-input-field">
        <button 
          class="chatbot-send" 
          (click)="sendMessage()"
          [disabled]="!userInput.trim() || isLoading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      z-index: 1000;
      color: white;
    }

    .chatbot-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
    }

    .chatbot-window {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      z-index: 1001;
      border: 1px solid #e1e5e9;
    }

    .chatbot-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px 12px 0 0;
    }

    .chatbot-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
    }

    .chatbot-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .chatbot-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .chatbot-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      display: flex;
      gap: 8px;
      max-width: 80%;
    }

    .bot-message {
      align-self: flex-start;
    }

    .user-message {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .message-content {
      background: #f8f9fa;
      padding: 12px 16px;
      border-radius: 18px;
      position: relative;
    }

    .user-message .message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .message-text {
      font-size: 14px;
      line-height: 1.4;
      margin-bottom: 4px;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.7;
    }

    .chatbot-input {
      display: flex;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid #e1e5e9;
    }

    .chatbot-input-field {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e1e5e9;
      border-radius: 24px;
      outline: none;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .chatbot-input-field:focus {
      border-color: #667eea;
    }

    .chatbot-input-field:disabled {
      background: #f8f9fa;
      cursor: not-allowed;
    }

    .chatbot-send {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .chatbot-send:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .chatbot-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 480px) {
      .chatbot-window {
        width: calc(100vw - 40px);
        height: 60vh;
        bottom: 10px;
        right: 20px;
      }
    }
  `]
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;

  ngOnInit() {
    // Add welcome message
    this.addBotMessage('Hello! I\'m your AI assistant. How can I help you today?');
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    this.userInput = '';
    this.isLoading = true;

    // Simulate AI response
    setTimeout(() => {
      this.generateAIResponse(userMessage);
      this.isLoading = false;
    }, 1000);
  }

  addUserMessage(text: string) {
    this.messages.push({
      id: Date.now(),
      text,
      isUser: true,
      timestamp: new Date()
    });
  }

  addBotMessage(text: string) {
    this.messages.push({
      id: Date.now(),
      text,
      isUser: false,
      timestamp: new Date()
    });
  }

  generateAIResponse(userMessage: string) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      this.addBotMessage('Hello! How can I assist you with the Employee management system today?');
    } else if (lowerMessage.includes('attendance') || lowerMessage.includes('punch')) {
      this.addBotMessage('You can manage your attendance by punching in and out daily. The attendance page shows your working hours and status. Need help with anything specific?');
    } else if (lowerMessage.includes('leave') || lowerMessage.includes('vacation')) {
      this.addBotMessage('You can request leave through the Leave Management section. You can view your leave balance and submit new requests there.');
    } else if (lowerMessage.includes('profile') || lowerMessage.includes('account')) {
      this.addBotMessage('You can update your profile information in the Profile section. You can edit your personal details, view documents, and manage projects.');
    } else if (lowerMessage.includes('payroll') || lowerMessage.includes('salary')) {
      this.addBotMessage('Your payroll information is available in the Payroll section. You can view salary breakdown, download payslips, and check deductions.');
    } else if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
      this.addBotMessage('You can view and manage your assigned projects in the Projects tab of your profile. Managers can assign new projects to employees.');
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      this.addBotMessage('I\'m here to help! You can ask me about attendance, leave management, profile updates, payroll, projects, or any other Employee Management-related questions.');
    } else {
      this.addBotMessage('I understand you\'re asking about "' + userMessage + '". For specific Employee Management system questions, try asking about attendance, leave, profile, payroll, or projects. How else can I help?');
    }
  }
} 