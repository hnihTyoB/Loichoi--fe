# Công Cụ Agent: Tìm Kiếm Tài Liệu Nội Bộ (Document Retriever / RAG Tool)

## Cấu hình
- **Tool Name**: `search_documents`
- **Method**: Semantic Vector Search & Hybrid BM25
- **Data Source**: `data/processed/*_rag-chunks.json`

## Tham số đầu vào
```json
{
  "query": "string (câu hỏi hoặc từ khóa cần tìm kiếm)",
  "top_k": 5,
  "filter": {
    "industry": "string (tùy chọn)",
    "date_range": "string (tùy chọn)"
  }
}
```

## Hướng dẫn cho Agent
1. Luôn sử dụng từ khóa chuyên môn khi tìm kiếm.
2. Trích dẫn `chunk_id` và nguồn tài liệu khi sử dụng thông tin từ kết quả trả về.
3. Nếu không tìm thấy kết quả phù hợp, mở rộng phạm vi tìm kiếm hoặc thông báo rõ ràng cho người dùng.
