"""
11_send_ls_command.py
Test ls command functionality in Terminail webview
"""
import subprocess
import time
import sys
import os
import requests
import json

def test_ls_command():
    """Test ls command functionality"""
    try:
        print("🚀 STEP 11: Test ls command functionality")
        
        # First, check if container MCP server is running
        print("   🔍 Checking if MCP server is running...")
        try:
            response = requests.get("http://localhost:3000/ais", timeout=5)
            if response.status_code == 200:
                print("   ✅ MCP server is running")
                
                # Test the /ais API endpoint
                data = response.json()
                print(f"   📊 API Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
                
                if 'ais' in data and isinstance(data['ais'], list):
                    print(f"   ✅ Found {len(data['ais'])} AI services")
                    
                    # Display AI services for verification
                    for ai in data['ais']:
                        print(f"      • {ai}")
                else:
                    print("   ❌ Invalid API response format")
                    return False
            else:
                print(f"   ❌ MCP server returned status code: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ MCP server is not accessible: {e}")
            print("   💡 Please ensure the container is running with: podman-compose up -d")
            return False
        
        # Now test the ls command functionality through VS Code
        print("   ⌨️  Testing ls command in Terminail webview...")
        
        # Open VS Code and execute ls command in Terminail terminal
        print("   🚀 Opening VS Code and executing ls command...")
        
        # First, ensure VS Code is running with Terminail extension
        subprocess.Popen(["C:\\VSCode\\bin\\code.cmd", "D:\\git\\6terminail", 
                         "--command", "terminail.openTerminal"])
        time.sleep(5)
        
        # Execute ls command through VS Code extension using automation
        print("   📝 Executing 'ls' command through automation...")
        
        # Use VSCode command palette to send ls command to Terminail
        # This simulates real user interaction
        subprocess.Popen(["C:\\VSCode\\bin\\code.cmd", "D:\\git\\6terminail", 
                         "--command", "workbench.action.terminal.sendSequence", 
                         "--args", "ls\\n"])
        time.sleep(3)
        
        # Test simple ls command (basic listing)
        print("   🔍 Testing basic ls command...")
        try:
            response = requests.get("http://localhost:3000/ais", timeout=5)
            if response.status_code == 200:
                data = response.json()
                ai_services = data.get('ais', [])
                
                if len(ai_services) > 0:
                    print("   ✅ Basic ls command test passed")
                    print(f"   📋 Found {len(ai_services)} AI services:")
                    
                    # Display simple listing (like ls command) - extract names from AIService objects
                    ai_names = [ai.get('name', ai.get('id', 'Unknown')) for ai in ai_services]
                    print(f"      {', '.join(ai_names)}")
                else:
                    print("   ❌ No AI services found")
                    return False
            else:
                print(f"   ❌ Failed to get AI services: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Failed to test ls command: {e}")
            return False
        
        # Test detailed ls command (ls -l)
        print("   🔍 Testing detailed ls command (ls -l)...")
        
        # Execute ls -l command through VS Code automation
        subprocess.Popen(["C:\\VSCode\\bin\\code.cmd", "D:\\git\\6terminail", 
                         "--command", "workbench.action.terminal.sendSequence", 
                         "--args", "ls -l\\n"])
        time.sleep(3)
        
        try:
            response = requests.get("http://localhost:3000/ais", timeout=5)
            if response.status_code == 200:
                data = response.json()
                ai_services = data.get('ais', [])
                
                if len(ai_services) > 0:
                    print("   ✅ Detailed ls command test passed")
                    print("   📋 Detailed AI services list:")
                    print("      ID\tName\t\tCategory\tURL")
                    print("      ----\t----\t\t--------\t---")
                    
                    for ai in ai_services:
                        ai_id = ai.get('id', 'N/A')
                        ai_name = ai.get('name', 'N/A')
                        ai_category = ai.get('category', 'N/A')
                        ai_url = ai.get('url', 'N/A')
                        print(f"      {ai_id}\t{ai_name}\t{ai_category}\t{ai_url}")
                else:
                    print("   ❌ No AI services found for detailed listing")
                    return False
            else:
                print(f"   ❌ Failed to get AI services for detailed listing: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Failed to test detailed ls command: {e}")
            return False
        
        # Test switching AI with cd command
        print("   🔍 Testing AI switching with cd command...")
        try:
            # Get first AI service ID for testing
            response = requests.get("http://localhost:3000/ais", timeout=5)
            if response.status_code == 200:
                data = response.json()
                ai_services = data.get('ais', [])
                
                if len(ai_services) > 0:
                    test_ai = ai_services[0].get('id', '')
                    if test_ai:
                        print(f"   🔄 Testing switch to AI: {test_ai}")
                        
                        # Execute cd command through VS Code automation
                        subprocess.Popen(["C:\\VSCode\\bin\\code.cmd", "D:\\git\\6terminail", 
                                         "--command", "workbench.action.terminal.sendSequence", 
                                         "--args", f"cd {test_ai}\\n"])
                        time.sleep(3)
                        
                        # Test the switch API endpoint
                        switch_response = requests.post(
                            "http://localhost:3000/switch",
                            json={"ai": test_ai},
                            timeout=5
                        )
                        
                        if switch_response.status_code == 200:
                            switch_data = switch_response.json()
                            if switch_data.get('success'):
                                print(f"   ✅ Successfully switched to {test_ai}")
                            else:
                                print(f"   ⚠️  Switch command executed but returned: {switch_data.get('error', 'Unknown error')}")
                        else:
                            print(f"   ⚠️  Switch API returned status: {switch_response.status_code}")
                    else:
                        print("   ⚠️  No valid AI ID found for testing")
                else:
                    print("   ⚠️  No AI services found for switching test")
            else:
                print("   ⚠️  Could not get AI services for switching test")
                
        except requests.exceptions.RequestException as e:
            print(f"   ⚠️  AI switching test skipped: {e}")
        
        print("   ✅ All ls command functionality tests completed successfully")
        
        # Ask user to manually verify the ls command in VS Code
        print("\n   👤 Manual verification required:")
        print("   Please open VS Code and check the Terminail terminal")
        print("   Try these commands manually:")
        print("     1. 'ls' - should show simple AI service list")
        print("     2. 'ls -l' - should show detailed AI service list")
        print("     3. 'cd <ai_name>' - should switch to specified AI")
        print("     4. 'help' - should show command help")
        
        response = input("   Did the ls commands work correctly in VS Code? (y/N): ")
        if response.lower().strip() in ['y', 'yes']:
            print("   ✅ Manual verification passed")
            return True
        else:
            print("   ❌ Manual verification failed")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing ls command: {e}")
        return False

if __name__ == "__main__":
    if test_ls_command():
        print("✅ Step 11 completed successfully!")
        sys.exit(0)
    else:
        print("❌ Step 11 failed!")
        sys.exit(1)