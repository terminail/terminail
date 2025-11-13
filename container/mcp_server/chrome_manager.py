"""
Chrome Manager - Automatically start and manage Chrome with debug port
"""
import os
import sys
import subprocess
import time
import platform
from typing import Optional
import logging
import socket
import json

logger = logging.getLogger("terminai-chrome-manager")

class ChromeManager:
    """Manages Chrome browser lifecycle for debugging"""
    
    def __init__(self, debug_port: int = 9222):
        self.debug_port = debug_port
        self.chrome_process: Optional[subprocess.Popen] = None
        self.chrome_paths = self._get_chrome_paths()
        self.is_container = self._is_running_in_container()
    
    def _is_running_in_container(self) -> bool:
        """Check if we're running inside a container (Podman/Docker)"""
        # Check for common container indicators
        try:
            # Check if /.dockerenv exists (Docker) or /.containerenv (Podman)
            if os.path.exists('/.dockerenv') or os.path.exists('/.containerenv'):
                return True
            
            # Check if /proc/1/cgroup contains container indicators
            if os.path.exists('/proc/1/cgroup'):
                with open('/proc/1/cgroup', 'r') as f:
                    content = f.read()
                    container_indicators = ['docker', 'lxc', 'kubepods', 'podman']
                    for indicator in container_indicators:
                        if indicator in content:
                            return True
            
            # Additional check for container environment variables
            container_env_vars = ['container', 'KUBERNETES_SERVICE_HOST']
            for var in container_env_vars:
                if os.environ.get(var):
                    return True
                    
            return False
        except:
            # If we can't determine, assume we might be in container
            return True
    
    def _get_chrome_paths(self) -> list:
        """Get possible Chrome executable paths based on OS"""
        system = platform.system()
        paths = []
        
        if system == "Windows":
            paths = [
                "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
                "D:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                "D:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            ]
        elif system == "Darwin":  # macOS
            paths = [
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                "/usr/bin/google-chrome",
                "/usr/bin/chromium-browser"
            ]
        else:  # Linux
            paths = [
                "/usr/bin/google-chrome",
                "/usr/bin/chromium-browser",
                "/usr/bin/chromium",
                "/snap/bin/chromium"
            ]
        
        return paths
    
    def _find_chrome_executable(self) -> Optional[str]:
        """Find Chrome executable on the system"""
        for path in self.chrome_paths:
            if os.path.exists(path):
                return path
        return None
    
    def is_chrome_running(self) -> bool:
        """Check if Chrome is already running with debug port"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            # When in container, Chrome runs on host, so we check localhost
            result = sock.connect_ex(('127.0.0.1', self.debug_port))
            sock.close()
            return result == 0
        except:
            return False
    
    def start_chrome(self, headless: bool = False) -> bool:
        """Start Chrome with debug port"""
        try:
            # Check if Chrome is already running
            if self.is_chrome_running():
                logger.info(f"Chrome is already running on port {self.debug_port}")
                return True
            
            # If we're in a container, try to communicate with host service
            if self.is_container:
                logger.info("Running in Podman container - attempting to start host Chrome via service")
                
                # Try to connect to host Chrome service
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.connect(('127.0.0.1', 9223))  # Host service port
                    
                    # Send request to start Chrome
                    request = {'action': 'start_chrome'}
                    sock.send(json.dumps(request).encode('utf-8'))
                    
                    # Wait for response
                    response_data = sock.recv(1024)
                    response = json.loads(response_data.decode('utf-8'))
                    sock.close()
                    
                    if response.get('success'):
                        logger.info("Host Chrome service started Chrome successfully")
                        # Wait a bit for Chrome to fully start
                        time.sleep(3)
                        
                        # Check if Chrome is now running
                        if self.is_chrome_running():
                            logger.info(f"Chrome is now running on port {self.debug_port}")
                            return True
                        else:
                            logger.warning("Host service reported success but Chrome is not accessible")
                    else:
                        logger.error(f"Host service failed to start Chrome: {response.get('error')}")
                        
                except Exception as e:
                    logger.warning(f"Could not connect to host Chrome service: {e}")
                
                # If service communication failed, provide user instructions
                logger.info("Please start the host Chrome service:")
                logger.info("  On host machine, run: python scripts/host_chrome_service.py")
                logger.info(f"Then run your Podman container with proper port mapping:")
                logger.info(f"  podman run -p 9222:9222 -p 9223:9223 ...")
                logger.info(f"Or manually start Chrome with: --remote-debugging-port={self.debug_port}")
                
                # Wait a bit and check again
                time.sleep(5)
                if self.is_chrome_running():
                    logger.info(f"Chrome is now running on port {self.debug_port}")
                    return True
                else:
                    logger.warning("Chrome is still not running. Please start host service or Chrome manually.")
                    return False
            
            # Find Chrome executable (when running on host)
            chrome_path = self._find_chrome_executable()
            if not chrome_path:
                logger.error("Chrome executable not found")
                return False
            
            # Create user data directory
            user_data_dir = os.path.join(os.path.expanduser("~"), "terminai_chrome_data")
            os.makedirs(user_data_dir, exist_ok=True)
            
            # Build Chrome command
            cmd = [
                chrome_path,
                f"--remote-debugging-port={self.debug_port}",
                f"--user-data-dir={user_data_dir}",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-extensions",
                "--disable-plugins",
                "--disable-images"
            ]
            
            if headless:
                cmd.append("--headless=new")
            
            # Start Chrome process
            if platform.system() == "Windows":
                # On Windows, we need to use CREATE_NEW_PROCESS_GROUP
                self.chrome_process = subprocess.Popen(
                    cmd,
                    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
            else:
                self.chrome_process = subprocess.Popen(
                    cmd,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
            
            # Wait for Chrome to start
            for i in range(10):  # Wait up to 10 seconds
                if self.is_chrome_running():
                    logger.info(f"Chrome started successfully on port {self.debug_port}")
                    return True
                time.sleep(1)
            
            logger.error("Chrome failed to start within timeout")
            return False
            
        except Exception as e:
            logger.error(f"Failed to start Chrome: {e}")
            return False
    
    def stop_chrome(self):
        """Stop Chrome process"""
        if self.chrome_process:
            try:
                self.chrome_process.terminate()
                self.chrome_process.wait(timeout=5)
                logger.info("Chrome stopped successfully")
            except:
                try:
                    self.chrome_process.kill()
                    logger.info("Chrome killed forcefully")
                except Exception as e:
                    logger.error(f"Failed to stop Chrome: {e}")
            finally:
                self.chrome_process = None
    
    def __enter__(self):
        """Context manager entry"""
        if self.start_chrome():
            return self
        else:
            raise RuntimeError("Failed to start Chrome")
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.stop_chrome()


# Example usage
if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    
    # Example of automatic Chrome management
    try:
        with ChromeManager() as chrome_manager:
            print("Chrome started automatically!")
            print("You can now connect to Chrome on port 9222")
            input("Press Enter to stop Chrome...")
    except Exception as e:
        print(f"Failed to manage Chrome: {e}")