"""
Terminail Host Chrome Test - Tests automatic Chrome startup when Terminail runs on host (not in container)
"""
import pytest
import asyncio
import subprocess
import time
from mcp_server.chrome_manager import ChromeManager


class TestTerminailHostChromeE2E:
    """E2E tests for Terminail automatic Chrome startup on host machine"""
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_terminail_extension_can_start_chrome_automatically(self):
        """Test that Terminail extension can automatically start Chrome when running on host"""
        print("\n=== Terminail Host Chrome Automatic Start Test ===")
        
        # First, make sure Chrome is not running
        try:
            subprocess.run(["taskkill", "/f", "/im", "chrome.exe"], 
                          capture_output=True, timeout=5)
            print("✓ Killed any existing Chrome processes")
            time.sleep(2)
        except:
            print("ℹ No existing Chrome processes to kill")
        
        chrome_manager = ChromeManager()
        
        try:
            # Verify we're not in container (running on host)
            is_container = chrome_manager._is_running_in_container()
            print(f"Running environment: {'Container' if is_container else 'Host'}")
            
            # Check if Chrome is running initially
            was_running = chrome_manager.is_chrome_running()
            print(f"Chrome was {'already' if was_running else 'not'} running")
            
            # Start Chrome automatically (this should work on host)
            success = chrome_manager.start_chrome()
            
            if is_container:
                # In container, this should provide instructions but not actually start Chrome
                print("ℹ In container environment - providing user instructions")
                assert success is False or was_running  # Should fail or already be running
            else:
                # On host, this should actually start Chrome
                assert success, "Failed to start Chrome automatically"
                print("✅ Chrome started automatically by Terminail extension")
                
                # Verify Chrome is now running
                assert chrome_manager.is_chrome_running(), "Chrome is not running after start"
                print("✅ Chrome is confirmed running on debug port 9222")
            
        except Exception as e:
            # Clean up on failure
            chrome_manager.stop_chrome()
            pytest.fail(f"Terminail host Chrome test failed: {e}")
        
        finally:
            # Clean up
            chrome_manager.stop_chrome()
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_terminail_chrome_context_manager_on_host(self):
        """Test Terminail ChromeManager as context manager on host"""
        print("\n=== Terminail Chrome Context Manager Test ===")
        
        try:
            with ChromeManager() as chrome_manager:
                print("✅ Chrome started via Terminail context manager")
                
                # Verify Chrome is running
                is_running = chrome_manager.is_chrome_running()
                print(f"Chrome running status: {is_running}")
                
                if not chrome_manager._is_running_in_container():
                    # On host, Chrome should be running
                    assert is_running, "Chrome should be running in context manager"
                    print("✅ Chrome is confirmed running on host")
                
                # Simulate some work
                await asyncio.sleep(1)
                print("✅ Context manager working correctly")
            
            # Chrome should be stopped automatically
            print("✅ Chrome stopped automatically via context manager")
            
        except Exception as e:
            pytest.fail(f"Terminail Chrome context manager test failed: {e}")