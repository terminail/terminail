"""
real_e2e_test.py
A real end-to-end test following the flow chart that executes individual step scripts
"""
import sys
import os
import subprocess

def run_step_script(script_name, step_name):
    """Run a step script directly using subprocess"""
    try:
        print(f"🚀 Running {step_name}...")
        
        # Get the full path to the script
        script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"{script_name}.py")
        
        # Check if script exists
        if not os.path.exists(script_path):
            print(f"❌ {step_name} script not found: {script_path}")
            return False
        
        # Run the script directly
        result = subprocess.run([sys.executable, script_path], 
                              cwd=os.path.dirname(os.path.abspath(__file__)),
                              text=True)
        
        if result.returncode == 0:
            print(f"✅ {step_name} completed successfully!")
            return True
        else:
            print(f"❌ {step_name} failed with exit code {result.returncode}!")
            return False
            
    except Exception as e:
        print(f"❌ Error running {step_name}: {e}")
        return False

def main():
    """Main function to run the complete E2E test by executing individual step scripts"""
    print("=" * 60)
    print("🎯 TERMINAI END-TO-END TESTING")
    print("=" * 60)
    print()
    
    # Define the steps in order
    steps = [
        ("00_install_terminail_extension", "Step 0: Install Terminail Extension"),
        ("01_check_podman_installation", "Step 1: Check Podman Installation"),
        ("02_check_chrome_installation", "Step 2: Check Chrome Installation"),
        ("03_check_container_installation", "Step 3: Check Container Installation"),
        ("04_start_podman", "Step 4: Start Podman"),
        ("05_start_chrome", "Step 5: Start Chrome"),
        ("06_start_container", "Step 6: Start Container"),
        ("07_verify_prerequisites", "Step 7: Verify Prerequisites"),
        ("08_send_cd_deepseek_command", "Step 8: Issue 'cd deepseek' Command"),
        ("09_send_qi_deepseek_command", "Step 9: Issue qi <question> Command"),
        ("10_confirm_e2e_success", "Step 10: E2E Success")
    ]
    
    # Run each step
    for script_name, step_name in steps:
        print(f"\n{'='*60}")
        if not run_step_script(script_name, step_name):
            print(f"❌ {step_name} failed! Terminating E2E test.")
            sys.exit(1)
        print(f"{'='*60}\n")
    
    print("=" * 60)
    print("🎉 TERMINAI E2E TEST COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    main()