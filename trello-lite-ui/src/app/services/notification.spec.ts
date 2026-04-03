import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8080/api/notifications';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService],
    });

    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch notifications', () => {
    const mockNotifications = [
      { id: 1, message: 'Test', read: false }
    ];

    service.getNotifications().subscribe((res) => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockNotifications);
  });

  it('should mark notification as read', () => {
    service.markNotificationAsRead(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1/read`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });
});