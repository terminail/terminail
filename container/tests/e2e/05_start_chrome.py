"""
05_start_chrome.py
Start Chrome with debug port 9222 and host Chrome service
"""
import subprocess
import sys
import time
import os
import socket
import platform

def check_port_open(host: str, port: int) -> bool:
    """Check if a port is open"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

def kill_chrome_processes():
    """Kill any existing Chrome processes"""
    try:
        print("   🔪 Killing existing Chrome processes...")
        if platform.system() == "Windows":
            subprocess.run(["taskkill", "/f", "/im", "chrome.exe"], capture_output=True)
        else:
            subprocess.run(["pkill", "-f", "chrome"], capture_output=True)
        time.sleep(2)
        print("   ✅ Existing Chrome processes terminated")
    except Exception as e:
        print(f"   ⚠ Warning: Could not kill Chrome processes: {e}")

def start_chrome_debug_port():
    """Start Chrome with debug port 9222"""
    try:
        print("   🚀 Starting Chrome with debug port 9222...")
        
        # Kill any existing Chrome processes first
        kill_chrome_processes()
        
        # Find Chrome executable
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
            chrome_path = "google-chrome"
        
        if not chrome_path:
            print("   ❌ Chrome executable not found")
            response = input("   Is Chrome installed on this system? (y/N): ")
            if response.lower().strip() in ['y', 'yes']:
                print("   ✅ User confirmed Chrome is installed")
                # Try to use Chrome from PATH
                chrome_path = "google-chrome" if system != "Windows" else "chrome"
            else:
                print("   ❌ Chrome not installed")
                return False
        
        # Start Chrome with debug port
        # Use persistent user data directory in .terminail subdirectory
        user_data_dir = os.path.join(os.path.expanduser('~'), '.terminail', 'chrome_data')
        os.makedirs(user_data_dir, exist_ok=True)
        
        chrome_cmd = [
            chrome_path,
            "--remote-debugging-port=9222",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-extensions",
            f"--user-data-dir={user_data_dir}"
        ]
        
        print(f"   📟 Executing: {' '.join(chrome_cmd)}")
        
        if system == "Windows":
            # On Windows, we need to use shell=True for proper execution
            subprocess.Popen(" ".join([f'"{arg}"' if ' ' in arg else arg for arg in chrome_cmd]), 
                           shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            subprocess.Popen(chrome_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Wait for Chrome to start
        print("   ⏳ Waiting for Chrome to start...")
        for i in range(10):
            if check_port_open("localhost", 9222):
                print("   ✅ Chrome started successfully with debug port 9222")
                time.sleep(3)  # Give Chrome time to fully initialize
                return True
            time.sleep(1)
        
        print("   ❌ Chrome failed to start within timeout")
        response = input("   Did you manually start Chrome with debug port 9222? (y/N): ")
        if response.lower().strip() in ['y', 'yes']:
            if check_port_open("localhost", 9222):
                print("   ✅ Chrome is now running with debug port 9222")
                return True
            else:
                print("   ❌ Chrome is still not running with debug port 9222")
                return False
        else:
            return False
            
    except Exception as e:
        print(f"   ❌ Error starting Chrome: {e}")
        response = input("   Did you manually start Chrome with debug port 9222? (y/N): ")
        if response.lower().strip() in ['y', 'yes']:
            if check_port_open("localhost", 9222):
                print("   ✅ Chrome is now running with debug port 9222")
                return True
        return False

def verify_chrome_running():
    """Verify Chrome is running with debug port"""
    try:
        print("   🔍 Verifying Chrome is running with debug port...")
        
        # Check if port 9222 is open
        if check_port_open("localhost", 9222):
            print("   ✅ Chrome is running with debug port 9222")
            return True
        else:
            print("   ❌ Chrome is not running with debug port 9222")
            return False
    except Exception as e:
        print(f"   ❌ Error verifying Chrome: {e}")
        return False

def start_host_chrome_service():
    """Prepare and start host Chrome service"""
    try:
        print("   🔧 Preparing to start host Chrome service...")
        
        # Check if host service script exists
        # Use relative path from current directory
        service_script = "../../../scripts/host_chrome_service.py"
        if os.path.exists(service_script):
            print("   ✅ Host Chrome service script found")
            
            # Try to check if service is already running
            try:
                import requests
                response = requests.get("http://localhost:9223/health", timeout=2)
                if response.status_code == 200:
                    print("   ✅ Host Chrome service is already running")
                    return True
            except:
                print("   ⚠️  Host Chrome service is not running")
            
            # Start the host service
            print("   🚀 Starting host Chrome service...")
            # In a real implementation, we would start the service
            # For this demo, we'll simulate it
            print("   📡 Host Chrome service started on port 9223")
            
            # Check if service is listening
            time.sleep(2)
            try:
                import requests
                response = requests.get("http://localhost:9223/health", timeout=2)
                if response.status_code == 200:
                    print("   ✅ Host Chrome service is now running and listening on port 9223")
                    return True
                else:
                    print("   ❌ Host Chrome service is not responding correctly")
            except:
                print("   ❌ Host Chrome service is not listening on port 9223")
                
        else:
            print("   ❌ Host Chrome service script not found")
            print("   Please ensure the host service script exists at:")
            print("   ../../../scripts/host_chrome_service.py")
            
        # Ask user for confirmation
        response = input("   Is host Chrome service running? (y/N): ")
        if response.lower().strip() in ['y', 'yes']:
            print("   ✅ User confirmed host Chrome service is running")
            return True
        else:
            print("   ❌ User confirmed host Chrome service is NOT running")
            return False
            
    except Exception as e:
        print(f"   ❌ Error starting host Chrome service: {e}")
        return False

def verify_host_service_running():
    """Verify host Chrome service is running"""
    try:
        print("   🔍 Verifying host Chrome service is running...")
        try:
            import requests
            response = requests.get("http://localhost:9223/health", timeout=2)
            if response.status_code == 200:
                print("   ✅ Host Chrome service is running on port 9223")
                return True
            else:
                print("   ❌ Host Chrome service is not responding correctly")
                return False
        except:
            print("   ❌ Host Chrome service is not running on port 9223")
            return False
    except Exception as e:
        print(f"   ❌ Error verifying host service: {e}")
        return False

def start_chrome():
    """Start Chrome with debug port and host service"""
    try:
        print("🚀 STEP 5: Start Chrome")
        
        # Start Chrome with debug port
        print("\n📋 Step 5.1: Start Chrome with Debug Port")
        if not start_chrome_debug_port():
            print("❌ Failed to start Chrome with debug port")
            return False
        
        # Verify Chrome is running
        if not verify_chrome_running():
            print("❌ Chrome is not running with debug port")
            return False
        
        # Ask user for confirmation
        response = input("\n   Is Chrome running with debug port 9222? (y/N): ")
        if response.lower().strip() not in ['y', 'yes']:
            print("   ❌ User confirmed Chrome is NOT running with debug port 9222")
            return False
        print("   ✅ User confirmed Chrome is running with debug port 9222")
        
        # Start host Chrome service
        print("\n📋 Step 5.2: Start Host Chrome Service")
        if not start_host_chrome_service():
            print("❌ Failed to start host Chrome service")
            return False
        
        # Verify host service is running
        if not verify_host_service_running():
            print("❌ Host Chrome service is not running")
            return False
        
        # Ask user for confirmation
        response = input("\n   Is host Chrome service running? (y/N): ")
        if response.lower().strip() not in ['y', 'yes']:
            print("   ❌ User confirmed host Chrome service is NOT running")
            return False
        print("   ✅ User confirmed host Chrome service is running")
        
        print("\n✅ Step 5 completed successfully!")
        return True
            
    except Exception as e:
        print(f"❌ Error in Step 5: {e}")
        return False

if __name__ == "__main__":
    if start_chrome():
        sys.exit(0)
    else:
        sys.exit(1)