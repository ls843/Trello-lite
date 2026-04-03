import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { Client } from '@stomp/stompjs';

describe('WebSocketService', () => {
  let service: WebSocketService;

  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      activate: jasmine.createSpy('activate'),
      deactivate: jasmine.createSpy('deactivate'),
      subscribe: jasmine.createSpy('subscribe'),
      onConnect: null,
      onStompError: null,
      active: false,
    };

    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        {
          provide: Client,
          useValue: mockClient
        }
      ]
    });

    service = TestBed.inject(WebSocketService);

    (service as any).client = mockClient;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should activate websocket on connect', () => {
    service.connect(() => {});
    expect(mockClient.activate).toHaveBeenCalled();
  });

  it('should subscribe to notifications on connect', () => {
    service.connect(() => {});

    mockClient.onConnect();

    expect(mockClient.subscribe).toHaveBeenCalledWith(
      '/topic/notifications',
      jasmine.any(Function)
    );
  });

  it('should call callback when message is received', () => {
    let receivedMessage: any;

    service.connect((msg) => {
      receivedMessage = msg;
    });

    mockClient.onConnect();

    const callback = mockClient.subscribe.calls.mostRecent().args[1];

    callback({ body: 'Test message' });

    expect(receivedMessage).toBe('Test message');
  });

  it('should deactivate websocket', () => {
    service.disconnect();
    expect(mockClient.deactivate).toHaveBeenCalled();
  });
});