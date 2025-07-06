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
        # Check if we should serve from build/runFiles or root
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)
        build_dir = os.path.join(project_root, 'build', 'runFiles')
        
        # Use build/runFiles if it exists and contains index.html
        if os.path.exists(os.path.join(build_dir, 'index.html')):
            serve_dir = build_dir
        else:
            serve_dir = project_root
            
        super().__init__(*args, directory=serve_dir, **kwargs)
    
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

def start_server(port=8080, open_path=""):
    """Start the development server"""
    local_ip = get_local_ip()
    
    # Determine which directory we're serving
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    build_dir = os.path.join(project_root, 'build', 'runFiles')
    
    if os.path.exists(os.path.join(build_dir, 'index.html')):
        serve_dir = build_dir
        serve_msg = "📁 Serving from: build/runFiles (built files)"
    else:
        serve_dir = project_root
        serve_msg = "📁 Serving from: project root (source files)"
    
    with socketserver.TCPServer(("", port), DevServer) as httpd:
        print(f"\n🏴‍☠️ Skull King Score Keeper Development Server")
        print(f"=" * 50)
        print(f"🌐 Local URL: http://localhost:{port}")
        print(f"📱 Network URL: http://{local_ip}:{port}")
        print(f"{serve_msg}")
        print(f"\n💡 Tips:")
        print(f"   - Use the Network URL to test on mobile devices")
        print(f"   - Make sure your mobile is on the same network")
        print(f"   - Refresh browser after making CSS/JS changes")
        print(f"\n⚡ Server is running... Press Ctrl+C to stop")
        print(f"=" * 50 + "\n")
        
        # Open in default browser
        url = f'http://localhost:{port}'
        if open_path:
            url = f'{url}/{open_path}'
        webbrowser.open(url)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped")
            sys.exit(0)

if __name__ == "__main__":
    # Check if a specific path was provided
    if len(sys.argv) > 1 and not sys.argv[1].isdigit():
        open_path = sys.argv[1]
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 8080
    else:
        port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
        open_path = ""
    
    start_server(port, open_path)