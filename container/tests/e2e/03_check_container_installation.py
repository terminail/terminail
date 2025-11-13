"""
03_check_container_installation.py
Check if terminai-mcp-server container image is built
"""
import subprocess
import sys
import time
import os

def check_container_installation():
    """Check if terminai-mcp-server container image is built"""
    try:
        print("🚀 STEP 3: Check Container Installation")
        print("   🔍 Checking for terminai-mcp-server container image...")
        
        # List Podman images
        result = subprocess.run(["podman", "images"], capture_output=True, text=True)
        if result.returncode == 0:
            print("   📋 Available Podman images:")
            print(result.stdout)
            
            # Check if terminai-mcp-server image exists
            if "terminai-mcp-server" in result.stdout:
                print("   ✅ terminai-mcp-server image is available")
                return True
            else:
                print("   ❌ terminai-mcp-server image not found")
                print("   Please build the container image using:")
                print("   cd D:/git/6terminai/container && podman build -t terminai-mcp-server .")
                response = input("   Have you built the container image? (y/N): ")
                if response.lower().strip() in ['y', 'yes']:
                    # Retry the check
                    result = subprocess.run(["podman", "images"], capture_output=True, text=True)
                    if "terminai-mcp-server" in result.stdout:
                        print("   ✅ terminai-mcp-server image is now available")
                        return True
                    else:
                        print("   ❌ terminai-mcp-server image still not found")
                        return False
                else:
                    print("   Please build the container image and run this script again")
                    return False
        else:
            print("   ❌ Failed to list Podman images")
            print("   Error:", result.stderr)
            return False
            
    except Exception as e:
        print(f"   ❌ Error checking container image: {e}")
        return False

if __name__ == "__main__":
    if check_container_installation():
        print("✅ Step 3 completed successfully!")
        sys.exit(0)
    else:
        print("❌ Step 3 failed!")
        sys.exit(1)