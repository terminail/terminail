#!/usr/bin/env python3
"""
Host Chrome Service - Runs on HOST to start Chrome when requested by CONTAINER
"""
import socket
import subprocess
import json
import sys
import os
import platform
import logging
import threading
import time
from typing import Optional

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("host-chrome-service")

class HostChromeService:
    """Service that runs on HOST to start Chrome when requested by CONTAINER"""
    
    def __init__(self, listen_port: int = 9223, chrome_debug_port: int = 9222):
        self.listen_port = listen_port
        self.chrome_debug_port = chrome_debug_port
        self.server_socket: Optional[socket.socket] = None
        self.running = False
    
    def _find_chrome_executable(self) -> Optional[str]:
        """Find Chrome executable on the HOST system"""
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
    
    def start_chrome_on_host(self) -> dict:
        """Start Chrome on the HOST machine"""
        try:
            # Check if Chrome is already running
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex(('127.0.0.1', self.chrome_debug_port))
            sock.close()
            
            if result == 0:
                logger.info(f"Chrome is already running on port {self.chrome_debug_port}")
                return {'success': True, 'message': 'Chrome already running', 'port': self.chrome_debug_port}
            
            # Find Chrome executable
            chrome_path = self._find_chrome_executable()
            if not chrome_path:
                logger.error("Chrome executable not found on host")
                return {'success': False, 'error': 'Chrome executable not found on host'}
            
            # Build Chrome command
            cmd = [
                chrome_path,
                f"--remote-debugging-port={self.chrome_debug_port}",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-extensions",
                "--disable-plugins"
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
            
            # Wait a bit for Chrome to start
            time.sleep(3)
            
            logger.info(f"Chrome started on host with debug port {self.chrome_debug_port}")
            return {'success': True, 'message': 'Chrome started', 'port': self.chrome_debug_port}
            
        except Exception as e:
            logger.error(f"Failed to start Chrome on host: {e}")
            return {'success': False, 'error': str(e)}
    
    def handle_client(self, client_socket, address):
        """Handle a client connection"""
        try:
            data = client_socket.recv(1024)
            if data:
                request = json.loads(data.decode('utf-8'))
                logger.info(f"Received request from {address}: {request}")
                
                if request.get('action') == 'start_chrome':
                    result = self.start_chrome_on_host()
                    response = json.dumps(result)
                    client_socket.send(response.encode('utf-8'))
                else:
                    response = json.dumps({'error': 'Unknown action'})
                    client_socket.send(response.encode('utf-8'))
        except Exception as e:
            logger.error(f"Error handling client {address}: {e}")
            error_response = json.dumps({'error': str(e)})
            client_socket.send(error_response.encode('utf-8'))
        finally:
            client_socket.close()
    
    def start_service(self):
        """Start the TCP service to listen for Chrome start requests"""
        try:
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self.server_socket.bind(('127.0.0.1', self.listen_port))
            self.server_socket.listen(5)
            self.running = True
            
            logger.info(f"Host Chrome Service listening on 127.0.0.1:{self.listen_port}")
            logger.info("Send {'action': 'start_chrome'} to start Chrome on host")
            logger.info("Make sure to run your container with: podman run -p 9223:9223 ...")
            
            while self.running:
                try:
                    client_socket, address = self.server_socket.accept()
                    # Handle each client in a separate thread
                    client_thread = threading.Thread(
                        target=self.handle_client, 
                        args=(client_socket, address)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                except socket.error:
                    if self.running:
                        logger.error("Socket error in service loop")
                    break
                    
        except Exception as e:
            logger.error(f"Service error: {e}")
        finally:
            if self.server_socket:
                self.server_socket.close()
    
    def stop_service(self):
        """Stop the service"""
        self.running = False
        if self.server_socket:
            self.server_socket.close()

def main():
    """Main entry point"""
    if len(sys.argv) > 1 and sys.argv[1] == '--start-chrome':
        # Direct command to start Chrome
        service = HostChromeService()
        result = service.start_chrome_on_host()
        print(json.dumps(result))
        sys.exit(0 if result['success'] else 1)
    else:
        # Start service mode
        service = HostChromeService()
        try:
            service.start_service()
        except KeyboardInterrupt:
            logger.info("Service stopped by user")
            service.stop_service()

if __name__ == "__main__":
    main()