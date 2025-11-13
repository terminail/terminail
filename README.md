# Terminail - Your AI Chat Terminal Companion

> "I am a knife, I cut the code. I just lie down here, I won't cut you. But use me or not, it depends on your needs. I am just a knife, I won't cut you. But you can use me to cut the code."

## 🚀 What is Terminail?

Terminail is a VS Code extension that turns AI chat websites into terminal commands! Imagine:

- `cd deepseek` - Switch to DeepSeek chat interface
- `ls` - View all supported AI services
- `qi help me write Python code` - Send questions to the current AI

**In simple terms: Terminail lets you operate AI chat websites like you're using a terminal!**

## 🎯 Core Features

### 🤖 Smart Browser Automation
- Automated browser control via Playwright MCP
- Support for pre-logged-in AI websites (DeepSeek, Qwen, Doubao, etc.)
- Fully automated Q&A workflow, no manual intervention needed

### 🐳 Podman Containerized Deployment
- Automatic Podman container startup for MCP server
- Cross-platform support (Windows, macOS, Linux)
- Resource isolation for security and reliability

### 💻 Terminal-Style User Experience
- Familiar `cd`, `ls`, `qi` commands
- Real-time response display
- Command history tracking
- Automatic error recovery

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Podman or Docker
- VS Code

### Installation Steps

1. **Install the Extension**
   ```bash
   # Install Terminail from VS Code Extension Marketplace
   ```

2. **Launch the Terminal**
   ```bash
   # Run "Open Terminail Terminal" command in VS Code
   ```

3. **Configure Browser**
   - Extension will guide you to start browser with debug port
   - Manually log into your preferred AI websites
   - Keep browser open - Terminail will take over automatically

4. **Start Chatting!**
   ```bash
   cd deepseek          # Switch to DeepSeek
   qi Hello, please introduce yourself  # Send question
   ```

## 🎮 Available Commands

| Command | Function | Example |
|---------|----------|---------|
| `cd <service>` | Switch AI service | `cd deepseek` |
| `ls` | List available services | `ls` |
| `qi <question>` | Send question | `qi help me write code` |
| `status` | Check system status | `status` |
| `help` | Show help | `help` |

## 🔧 Technical Architecture

Terminail uses a three-layer architecture:

1. **VS Code Extension Layer** - Provides terminal interface and user interaction
2. **Podman Container Layer** - Runs Playwright MCP server
3. **Browser Control Layer** - Controls logged-in browser via CDP protocol

This design ensures:
- **Security**: Browser operations are isolated in containers
- **Stability**: Automatic error detection and recovery
- **Usability**: No technical background required

## 🎨 Why Choose Terminail?

### For Developers
- 🚀 **Efficiency Boost**: No need to switch between browser and IDE
- 🔄 **Workflow Integration**: AI assistant directly integrated into development environment
- 📚 **History Tracking**: All conversations automatically saved

### For Non-Technical Users
- 🎯 **Easy to Use**: As simple as using a terminal
- 🔒 **Secure & Reliable**: No complex API configuration needed
- 🌐 **Multi-Service Support**: One tool for all major AI services

## 🤝 Contributing

We welcome all forms of contributions! Whether it's code, documentation, or ideas.

### Development Environment Setup
```bash
git clone https://github.com/your-org/terminail.git
cd terminail
npm install
npm run compile
```

### Running Tests
```bash
npm test              # Run unit tests
npm run test:integration  # Run integration tests
npm run test:e2e      # Run end-to-end tests
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Getting Help

- 📖 **Documentation**: Check the [doc](doc/) directory for detailed documentation
- 🐛 **Issue Reporting**: Report issues in GitHub Issues
- 💬 **Discussion**: Join our community discussions
- 🔧 **Technical Support**: Encountering technical issues? Check the troubleshooting guide

---

**Remember: I'm just a knife, sharp but harmless. Use me to cut code, not fingers!** 🔪✨

*Terminail - Making AI chat as simple as terminal operations!*