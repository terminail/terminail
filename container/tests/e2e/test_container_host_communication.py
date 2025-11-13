"""
Container-Host Communication Test - Tests ChromeManager communication with host service
"""
import pytest
import asyncio
import socket
import json
import threading
import time
from unittest.mock import patch
from mcp_server.chrome_manager import ChromeManager


class TestContainerHostCommunicationE2E:
    """E2E tests for container-host Chrome service communication"""
    
    def setup_mock_host_service(self):
        """Set up a mock host service for testing"""
        def mock_service():
            server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            server_socket.bind(('127.0.0.1', 9223))
            server_socket.listen(1)
            
            try:
                client_socket, _ = server_socket.accept()
                data = client_socket.recv(1024)
                if data:
                    request = json.loads(data.decode('utf-8'))
                    if request.get('action') == 'start_chrome':
                        # Simulate successful Chrome start
                        response = {'success': True, 'message': 'Chrome started', 'port': 9222}
                    else:
                        response = {'error': 'Unknown action'}
                    client_socket.send(json.dumps(response).encode('utf-8'))
                client_socket.close()
            except Exception as e:
                print(f"Mock service error: {e}")
            finally:
                server_socket.close()
        
        # Start mock service in background thread
        service_thread = threading.Thread(target=mock_service)
        service_thread.daemon = True
        service_thread.start()
        time.sleep(0.1)  # Give thread time to start
        return service_thread
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_chrome_manager_communicates_with_host_service(self):
        """Test ChromeManager communicates with host service when in container"""
        print("\n=== Container-Host Communication Test ===")
        
        # Set up mock host service
        service_thread = self.setup_mock_host_service()
        
        # Mock container environment
        with patch.object(ChromeManager, '_is_running_in_container', return_value=True):
            with patch.object(ChromeManager, 'is_chrome_running', side_effect=[False, True]):  # First false, then true
                chrome_manager = ChromeManager()
                
                # Verify we're in container mode
                assert chrome_manager.is_container is True
                print("✓ Detected container environment")
                
                # Try to start Chrome (should communicate with host service)
                success = chrome_manager.start_chrome()
                
                # Should succeed because mock service simulates success
                assert success is True
                print("✓ Successfully communicated with host service")
    
    @pytest.mark.e2e
    @pytest.mark.asyncio
    async def test_chrome_manager_host_service_unavailable(self):
        """Test ChromeManager handles unavailable host service gracefully"""
        print("\n=== Host Service Unavailable Test ===")
        
        # Mock container environment with no host service
        with patch.object(ChromeManager, '_is_running_in_container', return_value=True):
            with patch.object(ChromeManager, 'is_chrome_running', return_value=False):
                chrome_manager = ChromeManager()
                
                # Verify we're in container mode
                assert chrome_manager.is_container is True
                print("✓ Detected container environment")
                
                # Try to start Chrome (should handle unavailable service gracefully)
                success = chrome_manager.start_chrome()
                
                # Should fail gracefully since no service is running
                assert success is False
                print("✓ Gracefully handled unavailable host service")