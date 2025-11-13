#!/bin/bash
# download_prebuilt_image.sh
# Script to download pre-built container images from CI/CD

set -e

echo "🚀 Downloading pre-built TerminAI MCP Server container image..."

# Try to pull from GitHub Container Registry first
echo "🔍 Attempting to pull from GitHub Container Registry..."
if docker pull ghcr.io/6terminai/terminai-mcp-server:latest; then
    echo "✅ Successfully pulled image from GitHub Container Registry"
    echo "📦 Image tag: ghcr.io/6terminai/terminai-mcp-server:latest"
    exit 0
fi

# If GitHub fails, try Gitee (you would need to replace with actual Gitee registry URL)
echo "🔄 GitHub registry unavailable, trying alternative sources..."
echo "⚠️  Pre-built images are not yet available. Please build locally for now."

echo ""
echo "To build locally, run:"
echo "  cd container && podman build -t terminai-mcp-server ."
echo ""