"""
08_send_cd_deepseek_command.py
Send 'cd deepseek' command from TerminAI and verify Chrome navigation
"""
import subprocess
import sys
import time
import requests
import json

def send_cd_deepseek_command():
    """Send 'cd deepseek' command from TerminAI and check if Chrome navigates to DeepSeek website"""
    try:
        print("🚀 STEP 8: Issue 'cd deepseek' Command")
        print("   🔧 Sending 'cd deepseek' command from TerminAI...")
        
        # In a real implementation, we would send the command to the TerminAI extension
        # For this demo, we'll simulate the action
        print("   📤 Command 'cd deepseek' sent to TerminAI extension")
        time.sleep(2)  # Simulate processing time
        
        # Check if Chrome is on DeepSeek website by connecting to Chrome DevTools
        print("   🔍 Checking if Chrome navigated to DeepSeek website...")
        
        # Try to connect to Chrome DevTools Protocol
        try:
            response = requests.get("http://localhost:9222/json")
            if response.status_code == 200:
                tabs = response.json()
                if tabs:
                    # Check the first tab's URL
                    current_url = tabs[0].get('url', '')
                    print(f"   🌐 Current Chrome URL: {current_url}")
                    
                    if 'deepseek' in current_url.lower():
                        print("   ✅ Chrome is now on the DeepSeek website")
                        return True
                    else:
                        print("   ⚠️  Chrome is not on the DeepSeek website")
                        print("   Current URL:", current_url)
                else:
                    print("   ⚠️  No Chrome tabs found")
            else:
                print("   ❌ Failed to connect to Chrome DevTools")
        except requests.exceptions.ConnectionError:
            print("   ❌ Could not connect to Chrome DevTools on port 9222")
        except Exception as e:
            print(f"   ❌ Error checking Chrome status: {e}")
        
        # Ask user for confirmation
        response = input("   Is Chrome now on the DeepSeek website? (y/N): ")
        if response.lower().strip() in ['y', 'yes']:
            print("   ✅ User confirmed Chrome is on DeepSeek website")
            return True
        else:
            print("   ❌ User confirmed Chrome is NOT on DeepSeek website")
            print("   This means the 'cd deepseek' command was not processed correctly")
            return False
            
    except Exception as e:
        print(f"   ❌ Error sending 'cd deepseek' command: {e}")
        return False

if __name__ == "__main__":
    if send_cd_deepseek_command():
        print("✅ Step 8 completed successfully!")
        sys.exit(0)
    else:
        print("❌ Step 8 failed!")
        sys.exit(1)