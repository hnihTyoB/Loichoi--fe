# Công Cụ Agent: Truy Vấn API (REST API Query Tool)

## Cấu hình
- **Tool Name**: `call_rest_api`
- **Client**: Axios / Fetch with TLS 1.3

## Tham số đầu vào
```json
{
  "method": "GET | POST | PUT | DELETE",
  "url": "https://api.domain.com/v1/resource",
  "headers": {
    "Authorization": "Bearer <TOKEN_VARIABLE>",
    "Content-Type": "application/json"
  },
  "params": {},
  "data": {}
}
```

## Hướng dẫn cho Agent
1. Không đưa trực tiếp API Token bí mật vào chuỗi code; sử dụng biến môi trường.
2. Kiểm tra mã lỗi phản hồi để có phương án retry hoặc báo lỗi chính xác.
