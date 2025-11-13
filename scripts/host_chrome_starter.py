#!/usr/bin/env python3
"""
Host Chrome Starter Service - Runs on host to start Chrome when requested by container
"""
import socket
import subprocess
import json
import sys
import os
import platform
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("host-chrome-starter")

class HostChromeStarter:
    """Service that runs on host to start Chrome when requested"""
    
    def __init__(self, port: int = 9223):
        self.port = port
        self.server_socket: Optional[socket.socket] = None
    
    def _find_chrome_executable(self) -> Optional[str]:
        """Find Chrome executable on the host system"""
        system = platform.system()
        paths = []
        
        if system == "Windows":
            paths = [
                "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            ]
        elif system == "Darwin":  # macOS
            paths = [
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            ]
        else:  # Linux
            paths = [
                "/usr/bin/google-chrome",
                "/usr/bin/chromium-browser",
                "/usr/bin/chromium"
            ]
        
        for path in paths:
            if os.path.exists(path):
                return path
        return None
    
    def start_chrome_on_host(self, debug_port: int = 9222) -> bool:
        """Start Chrome on the host machine"""
        try:
            # Check if Chrome is already running
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex(('127.0.0.1', debug_port))
            sock.close()
            
            if result == 0:
                logger.info(f"Chrome is already running on port {debug_port}")
                return True
            
            # Find Chrome executable
            chrome_path = self._find_chrome_executable()
            if not chrome_path:
                logger.error("Chrome executable not found on host")
                return False
            
            # Build Chrome command
            cmd = [
                chrome_path,
                f"--remote-debugging-port={debug_port}",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-extensions"
            ]
            
            # Start Chrome process
            if platform.system() == "Windows":
                subprocess.Popen(
                    cmd,
                    creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
            else:
                subprocess.Popen(
                    cmd,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
            
            logger.info(f"Chrome started on host with debug port {debug_port}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start Chrome on host: {e}")
            return False
    
    def start_service(self):
        """Start the TCP service to listen for Chrome start requests"""
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.server_socket.bind(('127.0.0.1', self.port))
            self.server_socket.listen(1)
            
            logger.info(f"Host Chrome Starter service listening on port {self.port}")
            logger.info("Send {'action': 'start_chrome', 'debug_port': 9222} to start Chrome")
            
            while True:
                client_socket, address = self.server_socket.accept()
                try:
                    data = client_socket.recv(1024)
                    if data:
                        request = json.loads(data.decode('utf-8'))
                        logger.info(f"Received request: {request}")
                        
                        if request.get('action') == 'start_chrome':
                            debug_port = request.get('debug_port', 9222)
                            success = self.start_chrome_on_host(debug_port)
                            
                            response = {'success': success}
                            client_socket.send(json.dumps(response).encode('utf-8'))
                        else:
                            response = {'error': 'Unknown action'}
                            client_socket.send(json.dumps(response).encode('utf-8'))
                except Exception as e:
                    logger.error(f"Error handling request: {e}")
                    error_response = {'error': str(e)}
                    client_socket.send(json.dumps(error_response).encode('utf-8'))
                finally:
                    client_socket.close()
                    
        except KeyboardInterrupt:
            logger.info("Service stopped by user")
        except Exception as e:
            logger.error(f"Service error: {e}")
        finally:
            if self.server_socket:
                self.server_socket.close()

def main():
    """Main entry point"""
    if len(sys.argv) > 1 and sys.argv[1] == '--start-chrome':
        # Direct command to start Chrome
        debug_port = int(sys.argv[2]) if len(sys.argv) > 2 else 9222
        starter = HostChromeStarter()
        success = starter.start_chrome_on_host(debug_port)
        sys.exit(0 if success else 1)
    else:
        # Start service mode
        starter = HostChromeStarter()
        starter.start_service()

if __name__ == "__main__":
    main()