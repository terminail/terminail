"""
01_check_podman_installation.py
Check if Podman is installed and working
"""
import subprocess
import sys

def check_podman_installation():
    """Check if Podman is installed"""
    try:
        print("🚀 STEP 1: Check Podman Installation")
        
        # Check if Podman is installed
        result = subprocess.run(["podman", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"   ✅ Podman is installed: {result.stdout.strip()}")
            return True
        else:
            print("   ❌ Podman is not installed")
            print("   Please install Podman from: https://podman.io/getting-started/installation")
            response = input("   Have you installed Podman? (y/N): ")
            if response.lower().strip() in ['y', 'yes']:
                # Retry the check
                result = subprocess.run(["podman", "--version"], capture_output=True, text=True)
                if result.returncode == 0:
                    print(f"   ✅ Podman is now installed: {result.stdout.strip()}")
                    return True
                else:
                    print("   ❌ Podman is still not installed")
                    return False
            else:
                print("   Please install Podman and run this script again")
                return False
                
    except FileNotFoundError:
        print("   ❌ Podman command not found")
        print("   Please install Podman from: https://podman.io/getting-started/installation")
        response = input("   Have you installed Podman? (y/N): ")
        if response.lower().strip() in ['y', 'yes']:
            # Retry the check
            try:
                result = subprocess.run(["podman", "--version"], capture_output=True, text=True)
                if result.returncode == 0:
                    print(f"   ✅ Podman is now installed: {result.stdout.strip()}")
                    return True
                else:
                    print("   ❌ Podman is still not installed")
                    return False
            except:
                print("   ❌ Podman is still not installed")
                return False
        else:
            print("   Please install Podman and run this script again")
            return False
    except Exception as e:
        print(f"   ❌ Error checking Podman installation: {e}")
        return False

if __name__ == "__main__":
    if check_podman_installation():
        print("✅ Step 1 completed successfully!")
        sys.exit(0)
    else:
        print("❌ Step 1 failed!")
        sys.exit(1)