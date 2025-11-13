"""
06_start_container.py
Start terminai-mcp-server container from image
"""
import subprocess
import sys
import time
import os

def start_container():
    """Start terminai-mcp-server container"""
    try:
        print("🚀 STEP 6: Start Container")
        print("   🔧 Starting terminai-mcp-server container...")
        
        # First check if container is already running
        result = subprocess.run(["podman", "ps"], capture_output=True, text=True)
        if "terminai-mcp-server" in result.stdout:
            print("   ✅ terminai-mcp-server container is already running")
            return True
        
        # Start the container
        # Note: We need to map the necessary ports for Chrome debugging (9222) and host service (9223)
        cmd = [
            "podman", "run", "-d",
            "--name", "terminai-mcp-server",
            "-p", "9222:9222",
            "-p", "9223:9223",
            "terminai-mcp-server"
        ]
        
        print(f"   📟 Executing: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("   ✅ terminai-mcp-server container started successfully")
            print(f"   📋 Container ID: {result.stdout.strip()}")
            time.sleep(5)  # Wait for container to fully start
            return True
        else:
            print("   ❌ Failed to start terminai-mcp-server container")
            print(f"   Error: {result.stderr}")
            
            # Check if image exists
            images_result = subprocess.run(["podman", "images"], capture_output=True, text=True)
            if "terminai-mcp-server" not in images_result.stdout:
                print("   ⚠️  Container image not found")
                print("   Please build the image first:")
                print("   cd D:/git/6terminai/container && podman build -t terminai-mcp-server .")
            
            response = input("   Have you built the container image and started the container? (y/N): ")
            if response.lower().strip() in ['y', 'yes']:
                # Verify container is running
                verify_result = subprocess.run(["podman", "ps"], capture_output=True, text=True)
                if "terminai-mcp-server" in verify_result.stdout:
                    print("   ✅ terminai-mcp-server container is now running")
                    return True
                else:
                    print("   ❌ terminai-mcp-server container is still not running")
                    return False
            else:
                print("   Please build the image and start the container")
                return False
            
    except Exception as e:
        print(f"   ❌ Error starting container: {e}")
        return False

def verify_container_running():
    """Verify container is running"""
    try:
        print("   🔍 Verifying container is running...")
        result = subprocess.run(["podman", "ps"], capture_output=True, text=True)
        if "terminai-mcp-server" in result.stdout:
            print("   ✅ terminai-mcp-server container is running")
            return True
        else:
            print("   ❌ terminai-mcp-server container is not running")
            return False
    except Exception as e:
        print(f"   ❌ Error verifying container: {e}")
        return False

if __name__ == "__main__":
    try:
        # Start container
        if not start_container():
            print("❌ Failed to start container")
            sys.exit(1)
        
        print()
        
        # Verify container is running
        if not verify_container_running():
            print("❌ Container is not running")
            sys.exit(1)
        
        print()
        response = input("   Is the terminai-mcp-server container running? (y/N): ")
        if response.lower().strip() in ['y', 'yes']:
            print("   ✅ User confirmed container is running")
            print("✅ Step 6 completed successfully!")
            sys.exit(0)
        else:
            print("   ❌ User confirmed container is NOT running")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Error in Step 6: {e}")
        sys.exit(1)