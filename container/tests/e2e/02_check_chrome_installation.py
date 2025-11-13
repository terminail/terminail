"""
02_check_chrome_installation.py
Check if Chrome is installed on the system
"""
import subprocess
import sys
import os
import platform

def check_chrome_installation():
    """Check if Chrome is installed on the system"""
    try:
        print("🚀 STEP 2: Check Chrome Installation")
        print("   🔍 Locating Chrome executable on system...")
        
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
            # Try to find Chrome in PATH
            try:
                result = subprocess.run(["which", "google-chrome"], capture_output=True, text=True)
                if result.returncode == 0:
                    chrome_path = result.stdout.strip()
                else:
                    result = subprocess.run(["which", "chromium"], capture_output=True, text=True)
                    if result.returncode == 0:
                        chrome_path = result.stdout.strip()
            except:
                pass
        
        if chrome_path and os.path.exists(chrome_path):
            print(f"   ✅ Chrome found at: {chrome_path}")
            return True
        else:
            print("   ❌ Chrome not found on this system")
            print("   Please install Chrome from: https://www.google.com/chrome/")
            
            # Ask user for confirmation
            response = input("   Is Chrome installed on this system? (y/N): ")
            if response.lower().strip() in ['y', 'yes']:
                print("   ✅ User confirmed Chrome is installed")
                return True
            else:
                print("   ❌ User confirmed Chrome is NOT installed")
                print("   Please install Chrome and run this script again")
                return False
            
    except Exception as e:
        print(f"   ❌ Error checking Chrome installation: {e}")
        # Ask user for confirmation as fallback
        response = input("   Is Chrome installed on this system? (y/N): ")
        if response.lower().strip() in ['y', 'yes']:
            print("   ✅ User confirmed Chrome is installed")
            return True
        else:
            print("   ❌ User confirmed Chrome is NOT installed")
            return False

if __name__ == "__main__":
    if check_chrome_installation():
        print("✅ Step 2 completed successfully!")
        sys.exit(0)
    else:
        print("❌ Step 2 failed!")
        sys.exit(1)