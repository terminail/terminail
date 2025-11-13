# TerminAI MCP Server Container

MCP (Model Context Protocol) Server container for TerminAI VS Code extension, providing browser automation capabilities for web-based AI chat services. TerminAI is not affiliated with or endorsed by any AI website.

## 📋 Features

- 🚀 **High-performance Web Server** - Built with FastAPI
- 🌐 **Browser Automation** - Chrome browser control via Playwright
- 🤖 **Multi-AI Support** - Support for DeepSeek, Tongyi Qianwen, Doubao, and other AI chat websites
- 🔄 **Real-time Communication** - WebSocket and HTTP API communication with VS Code extension
- 🐳 **Containerized Deployment** - Isolated dependencies using Podman
- 🇨🇳 **China-Optimized** - Configured with domestic mirrors for faster dependency downloads

## 🏗️ Project Structure

```
container/
├── Containerfile             # Podman/Docker container build file
├── config.yaml               # MCP server configuration
├── pyproject.toml            # Python project configuration and dependencies
└── mcp_server/               # MCP server source code
   ├── __init__.py
   ├── main.py               # FastAPI main application
   └── browser.py            # Browser management logic
```

## 🚀 Quick Start

### Prerequisites

- Podman 4.0+ or Docker
- Python 3.11+
- Chrome browser (for debug connection)

### Build Container Image

```bash
# Navigate to container directory
cd container

# Build image
podman build -t terminai-mcp-server -f Containerfile .
```

### Run Container

```bash
# Run MCP server container
podman run -d \
  -p 3000:3000 \
  --name terminai-mcp \
  terminai-mcp-server
```

### Development Mode

```bash
# Run container for development
podman run -it \
  -p 3000:3000 \
  -v $(pwd)/mcp_server:/app/mcp_server \
  --name terminai-mcp-dev \
  terminai-mcp-server
```

## 🔧 API Reference

### Health Check
```http
GET /health
```
Check server and browser connection status.

### Initialize Browser Connection
```http
POST /init?debug_port=9222
```
Connect to Chrome browser instance running on host.

### Get Supported AI List
```http
GET /ais
```
Returns list of currently supported AI chat websites.

### Switch AI Website
```http
POST /switch?ai=deepseek
```
Switch to specified AI chat website.

### Ask Question
```http
POST /ask?ai=deepseek&question=Hello, please introduce yourself
```
Ask question to specified AI and get response.

## 🛠️ Development Guide

### Local Development Environment Setup

1. **Install Python Dependencies**
```bash
pip install -e .
```

2. **Install Playwright Browsers**
```bash
playwright install
```

3. **Run Development Server**
```bash
python -m mcp_server.main
```

### Adding New AI Support

1. Add new AI website URL to `ai_urls` dictionary in `browser.py`
2. Adjust input field and button selectors according to website structure
3. Test question-answer functionality

### Debugging Tips

```bash
# View container logs
podman logs -f terminai-mcp

# Enter container for debugging
podman exec -it terminai-mcp /bin/bash

# Check browser connection status
curl http://localhost:3000/health
```

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PYTHONUNBUFFERED` | 1 | Disable Python output buffering |
| `PLAYWRIGHT_DOWNLOAD_HOST` | https://npmmirror.com/mirrors/playwright | Playwright China mirror |

### Configuration File

The MCP server uses a YAML configuration file (`config.yaml`) for its settings:

- **Server settings**: Host, port, and debug mode
- **Browser settings**: Debug port, timeouts for operations
- **AI services**: References the main extension configuration
- **Logging**: Log level and format

### Port Configuration

- **3000**: MCP server HTTP API port
- **9222**: Chrome browser debug port (host)

## 🔒 Security Notes

- Container runs as non-root user
- Only necessary port 3000 is exposed
- Uses official base images with regular security updates
- Browser connections limited to local debug port only

## 🐛 Troubleshooting

### Common Issues

1. **Browser Connection Failed**
   - Ensure host Chrome is running in debug mode
   - Check firewall settings and port accessibility

2. **Playwright Browser Startup Failed**
   - Verify system dependencies are fully installed
   - Check if container has sufficient privileges

3. **API Request Timeout**
   - Check network connectivity
   - Verify container has sufficient resources

### Logs Inspection

```bash
# View detailed logs
podman logs terminai-mcp

# Real-time log monitoring
podman logs -f terminai-mcp
```

## 📄 License

This project is licensed under the [TerminAI Personal and Commercial Use License](LICENSE) - allows personal and internal use, prohibits commercial sales.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📞 Support

If you encounter any issues:
- Create a GitHub Issue
- Check project documentation
- Contact maintainers

---

**Note**: Using this container requires compliance with each AI website's terms of service. Please use automation features responsibly. TerminAI is not affiliated with or endorsed by any AI website.
