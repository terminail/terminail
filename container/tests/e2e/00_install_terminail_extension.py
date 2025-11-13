"""
00_install_terminail_extension.py
Install Terminail Extension to VS Code
"""
import subprocess
import time
import sys
import os
import glob
import platform

def find_vscode_command():
    """
    Find VS Code 'code' command automatically across different platforms and installations
    """
    # Common VS Code installation paths
    possible_paths = []
    
    if platform.system() == "Windows":
        # Windows paths
        possible_paths.extend([
            "C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd",
            "C:\\Program Files (x86)\\Microsoft VS Code\\bin\\code.cmd",
            "C:\\Users\\{}\\AppData\\Local\\Programs\\Microsoft VS Code\\bin\\code.cmd".format(os.getenv('USERNAME')),
            "C:\\VSCode\\bin\\code.cmd",
            "code.cmd",  # If it's in PATH
            "code"  # If it's in PATH without .cmd extension
        ])
    elif platform.system() == "Darwin":  # macOS
        possible_paths.extend([
            "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code",
            "/usr/local/bin/code",
            "code"
        ])
    else:  # Linux and other Unix-like systems
        possible_paths.extend([
            "/usr/bin/code",
            "/usr/local/bin/code",
            "/snap/bin/code",
            "code"
        ])
    
    # Check each possible path
    for path in possible_paths:
        try:
            # Check if file exists
            if os.path.isfile(path):
                print(f"   ✅ Found VS Code command at: {path}")
                return path
            
            # Check if command is in PATH
            result = subprocess.run(["which", path] if platform.system() != "Windows" else ["where", path], 
                                  capture_output=True, text=True, encoding='utf-8', errors='ignore')
            if result.returncode == 0:
                actual_path = result.stdout.strip().split('\n')[0]
                print(f"   ✅ Found VS Code command in PATH: {actual_path}")
                return actual_path
                
        except Exception as e:
            continue
    
    # If not found, try to use 'code' directly and hope it's in PATH
    print("   ⚠️  Could not find VS Code command, trying 'code' from PATH")
    return "code"

def install_terminail_extension():
    """Install Terminail extension in VS Code"""
    try:
        print("🚀 STEP 0: Install Terminail Extension")
        
        # Find VS Code command automatically
        print("   🔍 Finding VS Code command...")
        vscode_cmd = find_vscode_command()
        
        # First, try to uninstall if it exists
        print("   🧹 Uninstalling existing Terminail extension...")
        subprocess.run([vscode_cmd, "--uninstall-extension", "terminail.terminail"], 
                      capture_output=True, encoding='utf-8', errors='ignore')
        time.sleep(2)
        
        # Clean any existing vsix files
        print("   🧹 Cleaning existing vsix files...")
        # Use relative path to the project root (two levels up from current directory)
        project_root = os.path.join(os.path.dirname(__file__), "..", "..", "..")
        vsix_files = glob.glob(os.path.join(project_root, "*.vsix"))
        for vsix_file in vsix_files:
            try:
                os.remove(vsix_file)
                print(f"   🗑️  Removed {vsix_file}")
            except Exception as e:
                print(f"   ⚠️  Could not remove {vsix_file}: {e}")
        time.sleep(1)
        
        # Compile the extension from source
        print("   🏗️  Compiling extension from source...")
        # Change to the terminail directory (project root)
        original_cwd = os.getcwd()
        os.chdir(project_root)
        
        try:
            compile_result = subprocess.run(["npm", "run", "compile"], 
                                           capture_output=True, text=True, shell=True, encoding='utf-8', errors='ignore')
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
                                           capture_output=True, text=True, shell=True, encoding='utf-8', errors='ignore')
            if package_result.returncode != 0:
                print("   ❌ Failed to package extension")
                print(f"   Error: {package_result.stderr}")
                os.chdir(original_cwd)
                return False
            
            # Find the newly created vsix file
            vsix_files = glob.glob(os.path.join(project_root, "*.vsix"))
            if not vsix_files:
                print("   ❌ No vsix file found after packaging")
                os.chdir(original_cwd)
                return False
            
            vsix_path = vsix_files[0]
            print(f"   ✅ Extension packaged successfully: {vsix_path}")
            time.sleep(2)
            
            # Install the extension from vsix file
            print(f"   📦 Installing Terminail extension from {vsix_path}...")
            result = subprocess.run([vscode_cmd, "--install-extension", vsix_path], 
                                  capture_output=True, text=True, encoding='utf-8', errors='ignore')
            if result.returncode != 0:
                print("   ❌ Failed to install Terminail extension")
                print(f"   Error: {result.stderr}")
                os.chdir(original_cwd)
                return False
            
            print("   ✅ Terminail extension installed successfully")
            time.sleep(2)
            
            # Start VS Code with Terminail and specifically open the Terminail view
            print("   🚀 Starting VS Code with Terminail extension and opening Terminail view...")
            # Open VS Code and execute the command to open the Terminail terminal
            subprocess.Popen([vscode_cmd, project_root, 
                             "--command", "terminail.openTerminal"])
            time.sleep(5)
            
            # Change back to original directory
            os.chdir(original_cwd)
            
            response = input("   Did VS Code open with Terminail extension and view? (y/N): ")
            if response.lower().strip() in ['y', 'yes']:
                print("   ✅ VS Code opened with Terminail extension and view")
                return True
            else:
                print("   ❌ VS Code did not open with Terminail extension and view")
                return False
                
        finally:
            # Always change back to original directory
            os.chdir(original_cwd)
            
    except Exception as e:
        print(f"   ❌ Error installing Terminail extension: {e}")
        return False

if __name__ == "__main__":
    if install_terminail_extension():
        print("✅ Step 0 completed successfully!")
        sys.exit(0)
    else:
        print("❌ Step 0 failed!")
        sys.exit(1)