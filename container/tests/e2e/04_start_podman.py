"""
04_start_podman.py
Start Podman service if not already running
"""
import subprocess
import sys
import time
import platform

def start_podman():
    """Start Podman service"""
    try:
        print("🚀 STEP 4: Start Podman")
        print("   🔧 Checking Podman status...")
        
        # Check if Podman is installed first
        try:
            result = subprocess.run(["podman", "--version"], capture_output=True, text=True)
            if result.returncode != 0:
                print("   ❌ Podman is not installed")
                print("   Please install Podman from: https://podman.io/getting-started/installation")
                return False
            else:
                print(f"   ✅ Podman is installed: {result.stdout.strip()}")
        except FileNotFoundError:
            print("   ❌ Podman command not found")
            print("   Please install Podman from: https://podman.io/getting-started/installation")
            return False
        
        # Check if Podman machine is already running (Windows/macOS)
        if platform.system() in ["Windows", "Darwin"]:
            print("   🔍 Checking Podman machine status...")
            result = subprocess.run(["podman", "machine", "list", "--format", "json"], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                import json
                try:
                    machines = json.loads(result.stdout) if result.stdout.strip() else []
                    running_machine = None
                    for machine in machines:
                        if machine.get("Running", False):
                            running_machine = machine
                            break
                    
                    if running_machine:
                        print(f"   ✅ Podman machine '{running_machine.get('Name', 'default')}' is already running")
                        return True
                    else:
                        print("   ⚠️  No running Podman machine found")
                        # Try to start the default machine
                        print("   🚀 Starting Podman machine...")
                        start_result = subprocess.run(["podman", "machine", "start"], 
                                                    capture_output=True, text=True)
                        if start_result.returncode == 0:
                            print("   ✅ Podman machine started successfully")
                            time.sleep(5)  # Wait for machine to fully start
                            return True
                        else:
                            print(f"   ❌ Failed to start Podman machine: {start_result.stderr}")
                            response = input("   Please start Podman manually and press Enter when ready...")
                            # Retry the check
                            result = subprocess.run(["podman", "machine", "list", "--format", "json"], 
                                                  capture_output=True, text=True)
                            if result.returncode == 0:
                                try:
                                    machines = json.loads(result.stdout) if result.stdout.strip() else []
                                    for machine in machines:
                                        if machine.get("Running", False):
                                            print("   ✅ Podman machine is now running")
                                            return True
                                except:
                                    pass
                            print("   ❌ Podman machine is still not running")
                            return False
                except json.JSONDecodeError:
                    # Fallback to simple check
                    result = subprocess.run(["podman", "machine", "list"], capture_output=True, text=True)
                    if "Running" in result.stdout and "true" in result.stdout:
                        print("   ✅ Podman machine is already running")
                        return True
                    elif "podman-machine-default" in result.stdout:
                        print("   🚀 Starting Podman machine...")
                        start_result = subprocess.run(["podman", "machine", "start"], 
                                                    capture_output=True, text=True)
                        if start_result.returncode == 0:
                            print("   ✅ Podman machine started successfully")
                            time.sleep(5)
                            return True
                        else:
                            print("   ❌ Failed to start Podman machine")
                            return False
                    else:
                        print("   ⚠️  No Podman machine found")
                        print("   Please create one with: podman machine init")
                        return False
            else:
                print("   ❌ Failed to list Podman machines")
                return False
        else:
            # Linux - Podman runs natively, check if it's working
            print("   🔍 Checking Podman on Linux...")
            result = subprocess.run(["podman", "version"], capture_output=True, text=True)
            if result.returncode == 0:
                print("   ✅ Podman is working on Linux")
                return True
            else:
                print("   ❌ Podman is not working properly on Linux")
                return False
            
    except Exception as e:
        print(f"   ❌ Error with Podman: {e}")
        response = input("   Please start Podman manually and press Enter when ready...")
        # Simple verification
        try:
            result = subprocess.run(["podman", "version"], capture_output=True, text=True)
            if result.returncode == 0:
                print("   ✅ Podman is now working")
                return True
        except:
            pass
        print("   ❌ Podman is still not working properly")
        return False

if __name__ == "__main__":
    if start_podman():
        print("✅ Step 4 completed successfully!")
        sys.exit(0)
    else:
        print("❌ Step 4 failed!")
        sys.exit(1)