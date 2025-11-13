"""
00_install_terminai_extension.py
Install TerminAI Extension to VS Code
"""
import subprocess
import time
import sys
import os
import glob

def install_terminai_extension():
    """Install TerminAI extension in VS Code"""
    try:
        print("🚀 STEP 0: Install TerminAI Extension")
        
        # First, try to uninstall if it exists
        print("   🧹 Uninstalling existing TerminAI extension...")
        subprocess.run(["C:\\VSCode\\bin\\code.cmd", "--uninstall-extension", "terminai.terminai"], 
                      capture_output=True)
        time.sleep(2)
        
        # Clean any existing vsix files
        print("   🧹 Cleaning existing vsix files...")
        vsix_files = glob.glob("D:\\git\\6terminai\\*.vsix")
        for vsix_file in vsix_files:
            try:
                os.remove(vsix_file)
                print(f"   🗑️  Removed {vsix_file}")
            except Exception as e:
                print(f"   ⚠️  Could not remove {vsix_file}: {e}")
        time.sleep(1)
        
        # Compile the extension from source
        print("   🏗️  Compiling extension from source...")
        # Change to the terminai directory
        original_cwd = os.getcwd()
        os.chdir("D:\\git\\6terminai")
        
        try:
            compile_result = subprocess.run(["npm", "run", "compile"], 
                                           capture_output=True, text=True, shell=True)
            if compile_result.returncode != 0:
                print("   ❌ Failed to compile extension")
                print(f"   Error: {compile_result.stderr}")
                os.chdir(original_cwd)
                return False
            print("   ✅ Extension compiled successfully")
            time.sleep(2)
            
            # Package the extension
            print("   📦 Packaging extension...")
            package_result = subprocess.run(["npm", "run", "package"], 
                                           capture_output=True, text=True, shell=True)
            if package_result.returncode != 0:
                print("   ❌ Failed to package extension")
                print(f"   Error: {package_result.stderr}")
                os.chdir(original_cwd)
                return False
            
            # Find the newly created vsix file
            vsix_files = glob.glob("D:\\git\\6terminai\\*.vsix")
            if not vsix_files:
                print("   ❌ No vsix file found after packaging")
                os.chdir(original_cwd)
                return False
            
            vsix_path = vsix_files[0]
            print(f"   ✅ Extension packaged successfully: {vsix_path}")
            time.sleep(2)
            
            # Install the extension from vsix file
            print(f"   📦 Installing TerminAI extension from {vsix_path}...")
            result = subprocess.run(["C:\\VSCode\\bin\\code.cmd", "--install-extension", vsix_path], 
                                  capture_output=True, text=True)
            if result.returncode != 0:
                print("   ❌ Failed to install TerminAI extension")
                print(f"   Error: {result.stderr}")
                os.chdir(original_cwd)
                return False
            
            print("   ✅ TerminAI extension installed successfully")
            time.sleep(2)
            
            # Start VS Code with TerminAI and specifically open the TerminAI view
            print("   🚀 Starting VS Code with TerminAI extension and opening TerminAI view...")
            # Open VS Code and execute the command to open the TerminAI terminal
            subprocess.Popen(["C:\\VSCode\\bin\\code.cmd", "D:\\git\\6terminai", 
                             "--command", "terminai.openTerminal"])
            time.sleep(5)
            
            # Change back to original directory
            os.chdir(original_cwd)
            
            response = input("   Did VS Code open with TerminAI extension and view? (y/N): ")
            if response.lower().strip() in ['y', 'yes']:
                print("   ✅ VS Code opened with TerminAI extension and view")
                return True
            else:
                print("   ❌ VS Code did not open with TerminAI extension and view")
                return False
                
        finally:
            # Always change back to original directory
            os.chdir(original_cwd)
            
    except Exception as e:
        print(f"   ❌ Error installing TerminAI extension: {e}")
        return False

if __name__ == "__main__":
    if install_terminai_extension():
        print("✅ Step 0 completed successfully!")
        sys.exit(0)
    else:
        print("❌ Step 0 failed!")
        sys.exit(1)