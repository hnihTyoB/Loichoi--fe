# Công Cụ Agent: Kết Nối Máy Chủ Ngữ Cảnh (MCP - Model Context Protocol)

## Cấu hình
- **Tool Name**: `mcp_client_bridge`
- **Protocol Version**: MCP v1.0
- **Supported Transports**: `stdio` / `sse`

## Cấu hình máy chủ MCP (`mcp_config.json`)
```json
{
  "mcpServers": {
    "filesystem-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "d:\\NodeJS\\loichoi\\loichoi-fe\\data"]
    },
    "postgres-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/db"]
    }
  }
}
```

## Hướng dẫn cho Agent
1. Tự động khám phá danh sách công cụ (Tools discovery) qua giao thức MCP khi khởi động.
2. Đảm bảo giới hạn phạm vi truy cập của MCP Server trong các thư mục được cấp quyền.
