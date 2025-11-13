"""
07_verify_prerequisites.py
Confirm all prerequisites are met for Terminail E2E testing
"""
import subprocess
import sys
import time
import os
import platform
import requests

def check_terminail_extension():
    """Check if Terminail extension is installed"""
    try:
        print("   🔍 Checking Terminail extension...")
        result = subprocess.run(["C:\\VSCode\\bin\\code.cmd", "--list-extensions"], 
                              capture_output=True, text=True)
        if "terminail" in result.stdout.lower():
            print("   ✅ Terminail extension is installed")
            return True
        else:
            print("   ❌ Terminail extension is not installed")
            return False
    except Exception as e:
        print(f"   ❌ Error checking Terminail extension: {e}")
        return False

def check_podman():
    """Check if Podman is installed and running"""
    try:
        print("   🔍 Checking Podman...")
        result = subprocess.run(["podman", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"   ✅ Podman is installed: {result.stdout.strip()}")
            
            # Check if Podman machine is running (Windows/macOS)
            if platform.system() in ["Windows", "Darwin"]:
                result = subprocess.run(["podman", "machine", "list"], capture_output=True, text=True)
                if "Running" in result.stdout and "true" in result.stdout:
                    print("   ✅ Podman machine is running")
                    return True
                else:
                    print("   ⚠️  Podman machine is not running")
                    return False
            else:
                # Linux - Podman runs natively
                print("   ✅ Podman runs natively on Linux")
                return True
        else:
            print("   ❌ Podman is not installed")
            return False
    except Exception as e:
        print(f"   ❌ Error checking Podman: {e}")
        return False

def check_container_image():
    """Check if terminail-mcp-server container image is built"""
    try:
        print("   🔍 Checking container image...")
        result = subprocess.run(["podman", "images"], capture_output=True, text=True)
        if "terminail-mcp-server" in result.stdout:
            print("   ✅ terminail-mcp-server image is available")
            return True
        else:
            print("   ❌ terminail-mcp-server image not found")
            return False
    except Exception as e:
        print(f"   ❌ Error checking container image: {e}")
        return False

def check_host_service():
    """Check if host Chrome service is running"""
    try:
        print("   🔍 Checking host Chrome service...")
        response = requests.get("http://localhost:9223/health", timeout=3)
        if response.status_code == 200:
            print("   ✅ Host Chrome service is running on port 9223")
            return True
        else:
            print("   ❌ Host Chrome service is not responding correctly")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Host Chrome service is not running on port 9223")
        return False
    except Exception as e:
        print(f"   ❌ Error checking host Chrome service: {e}")
        return False

def check_chrome():
    """Check if Chrome is installed"""
    try:
        print("   🔍 Checking Chrome installation...")
        chrome_path = None
        system = platform.system()
        
        if system == "Windows":
            possible_paths = [
                "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            ]
            for path in possible_paths:
                if os.path.exists(path):
                    chrome_path = path
                    break
        elif system == "Darwin":  # macOS
            chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        else:  # Linux
            try:
                result = subprocess.run(["which", "google-chrome"], capture_output=True, text=True)
                if result.returncode == 0:
                    chrome_path = result.stdout.strip()
            except:
                pass
        
        if chrome_path and os.path.exists(chrome_path):
            print(f"   ✅ Chrome found at: {chrome_path}")
            return True
        else:
            print("   ❌ Chrome not found on this system")
            return False
    except Exception as e:
        print(f"   ❌ Error checking Chrome installation: {e}")
        return False

def check_chrome_debug_port():
    """Check if Chrome is running with debug port"""
    try:
        print("   🔍 Checking Chrome debug port...")
        response = requests.get("http://localhost:9222/json", timeout=3)
        if response.status_code == 200:
            tabs = response.json()
            if tabs:
                print("   ✅ Chrome is running with debug port 9222")
                print(f"   📋 Chrome has {len(tabs)} tab(s) open")
                return True
            else:
                print("   ⚠️  Chrome debug port is open but no tabs found")
                return True
        else:
            print("   ❌ Chrome is not running with debug port 9222")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Chrome is not running with debug port 9222")
        return False
    except Exception as e:
        print(f"   ❌ Error checking Chrome debug port: {e}")
        return False

def verify_prerequisites():
    """Confirm all prerequisites are met"""
    try:
        print("🚀 STEP 7: Verify Prerequisites")
        print("   🔍 Validating all services and connections...")
        
        checks = [
            ("Terminail Extension", check_terminail_extension),
            ("Podman", check_podman),
            ("Container Image", check_container_image),
            ("Host Chrome Service", check_host_service),
            ("Chrome Installation", check_chrome),
            ("Chrome Debug Port", check_chrome_debug_port)
        ]
        
        all_passed = True
        for name, check_func in checks:
            print(f"\n   🧪 Checking {name}...")
            if not check_func():
                print(f"   ❌ {name} check failed")
                all_passed = False
            else:
                print(f"   ✅ {name} check passed")
        
        if all_passed:
            print("\n   🎉 All prerequisites are met!")
            return True
        else:
            print("\n   ❌ Some prerequisites are not met")
            response = input("   Are all prerequisites met? (y/N): ")
            if response.lower().strip() in ['y', 'yes']:
                print("   ✅ User confirmed all prerequisites are met")
                return True
            else:
                print("   ❌ User confirmed some prerequisites are NOT met")
                return False
            
    except Exception as e:
        print(f"   ❌ Error verifying prerequisites: {e}")
        return False

if __name__ == "__main__":
    if verify_prerequisites():
        print("✅ Step 7 completed successfully!")
        sys.exit(0)
    else:
        print("❌ Step 7 failed!")
        sys.exit(1)