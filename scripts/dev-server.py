#!/usr/bin/env python3
"""
Simple development server with auto-reload and mobile preview capabilities
"""
import http.server
import socketserver
import os
import sys
import time
import threading
import webbrowser
from pathlib import Path
import socket

class DevServer(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.dirname(os.path.abspath(__file__))), **kwargs)
    
    def end_headers(self):
        # Add cache control headers to prevent caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

def get_local_ip():
    """Get the local IP address for network access"""
    try:
        # Create a socket to determine the local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "localhost"

def start_server(port=8080):
    """Start the development server"""
    local_ip = get_local_ip()
    
    with socketserver.TCPServer(("", port), DevServer) as httpd:
        print(f"\n🏴‍☠️ Skull King Score Keeper Development Server")
        print(f"=" * 50)
        print(f"🌐 Local URL: http://localhost:{port}")
        print(f"📱 Network URL: http://{local_ip}:{port}")
        print(f"\n💡 Tips:")
        print(f"   - Use the Network URL to test on mobile devices")
        print(f"   - Make sure your mobile is on the same network")
        print(f"   - Refresh browser after making CSS/JS changes")
        print(f"\n⚡ Server is running... Press Ctrl+C to stop")
        print(f"=" * 50 + "\n")
        
        # Open in default browser
        webbrowser.open(f'http://localhost:{port}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped")
            sys.exit(0)

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    start_server(port)