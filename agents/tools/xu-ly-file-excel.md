# Công Cụ Agent: Xử Lý File Excel (Excel Data Processor Tool)

## Cấu hình
- **Tool Name**: `process_excel_file`
- **Engine**: Python openpyxl / pandas / SheetJS
- **Data Target**: `data/processed/`

## Tham số đầu vào
```json
{
  "file_path": "string (đường dẫn tới file trong data/raw/)",
  "sheet_name": "string (tên sheet, mặc định là active sheet)",
  "operations": ["clean_nulls", "remove_duplicates", "calculate_aggregations"],
  "output_format": "json | csv"
}
```

## Hướng dẫn cho Agent
1. Dữ liệu sau khi xử lý sẽ tự động được lưu vào `data/processed/` với hậu tố `_cleaned.json`.
2. Không bao giờ ghi đè trực tiếp lên file gốc trong `data/raw/`.
