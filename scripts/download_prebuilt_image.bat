@echo off
REM download_prebuilt_image.bat
REM Script to download pre-built container images from CI/CD

echo 🚀 Downloading pre-built TerminAI MCP Server container image...

REM Try to pull from GitHub Container Registry first
echo 🔍 Attempting to pull from GitHub Container Registry...
podman pull ghcr.io/6terminai/terminai-mcp-server:latest
if %ERRORLEVEL% EQU 0 (
    echo ✅ Successfully pulled image from GitHub Container Registry
    echo 📦 Image tag: ghcr.io/6terminai/terminai-mcp-server:latest
    exit /b 0
)

REM If GitHub fails, inform user
echo 🔄 GitHub registry unavailable, trying alternative sources...
echo ⚠️  Pre-built images are not yet available. Please build locally for now.

echo.
echo To build locally, run:
echo   cd container && podman build -t terminai-mcp-server .
echo.