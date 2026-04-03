import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client!: Client;
  private subscription: any;

  connect(onMessage: (msg: any) => void) {
    if (this.client && this.client.active) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      console.log('✅ WebSocket Connected');

      this.subscription = this.client.subscribe(
        '/topic/notifications',
        (message: IMessage) => {
          try {
            const parsed = JSON.parse(message.body);
            onMessage(parsed);
          } catch {
            onMessage(message.body);
          }
        }
      );
    };

    this.client.onStompError = (frame) => {
      console.error('❌ STOMP Error:', frame);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.client) {
      this.client.deactivate();
    }
  }
}