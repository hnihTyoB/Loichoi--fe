# Công Cụ Agent: Tạo Lịch Hẹn (Calendar Scheduler Tool)

## Cấu hình
- **Tool Name**: `create_calendar_event`
- **Integration**: Google Calendar API / Microsoft Outlook Calendar

## Tham số đầu vào
```json
{
  "summary": "string (tên sự kiện/cuộc họp)",
  "description": "string (nội dung cuộc họp và link tài liệu)",
  "start_time": "2026-08-26T09:00:00+07:00",
  "end_time": "2026-08-26T10:30:00+07:00",
  "attendees": ["email1@domain.com", "email2@domain.com"],
  "location": "string (phòng họp hoặc link meeting trực tuyến)"
}
```

## Hướng dẫn cho Agent
1. Luôn xác nhận múi giờ chuẩn (`Asia/Ho_Chi_Minh` UTC+7) trước khi đặt lịch.
2. Kiểm tra tính khả dụng (Free/Busy) của người tham gia trước khi chốt giờ.
