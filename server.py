#!/usr/bin/env python3
"""
LayoutForge Local Server
Servidor HTTP com integração completa para Adobe InDesign (.jsx), PDF, SVG e PNG.
Garante:
1. Salvamento direto de arquivos no Windows (C:\\Users\\...\\Downloads e exports/).
2. Instalação automática de scripts .jsx no painel de Scripts do Adobe InDesign instalado
   (C:\\Users\\...\\AppData\\Roaming\\Adobe\\InDesign\\Version ...\\pt_BR\\Scripts\\Scripts Panel).
3. Execução direta no InDesign via endpoint /api/run-indesign.
"""

import http.server
import socketserver
import urllib.parse
import json
import base64
import os
import sys
import glob
import subprocess
import webbrowser

PORT = 8188
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
EXPORTS_DIR = os.path.join(DIRECTORY, 'exports')
os.makedirs(EXPORTS_DIR, exist_ok=True)

DOWNLOADS_DIR = os.path.join(os.path.expanduser('~'), 'Downloads')

INDESIGN_EXE_PATHS = [
    r"D:\Arquivos e Programas\Adobe\Adobe InDesign 2026\InDesign.exe",
    r"C:\Program Files\Adobe\Adobe InDesign 2026\InDesign.exe",
    r"C:\Program Files\Adobe\Adobe InDesign 2025\InDesign.exe",
    r"C:\Program Files\Adobe\Adobe InDesign 2024\InDesign.exe",
]

def find_indesign_exe():
    for p in INDESIGN_EXE_PATHS:
        if os.path.exists(p):
            return p
    return None

def get_indesign_scripts_panels():
    """Localiza todos os painéis de Scripts do Adobe InDesign instalados no sistema (C: e D:)."""
    panels = []
    
    # 1. Pastas do Usuário no AppData (Roaming)
    appdata = os.environ.get('APPDATA', '')
    indesign_root = os.path.join(appdata, 'Adobe', 'InDesign')
    if os.path.exists(indesign_root):
        panels.extend(glob.glob(os.path.join(indesign_root, '*', '*', 'Scripts', 'Scripts Panel')))
    
    # 2. Pasta de Scripts do Aplicativo InDesign no Drive D ou C
    app_dirs = [
        r"D:\Arquivos e Programas\Adobe\Adobe InDesign 2026\Scripts\Scripts Panel",
        r"C:\Program Files\Adobe\Adobe InDesign 2026\Scripts\Scripts Panel",
        r"C:\Program Files\Adobe\Adobe InDesign 2025\Scripts\Scripts Panel",
    ]
    for ad in app_dirs:
        if os.path.exists(ad) and ad not in panels:
            panels.append(ad)
            
    return list(set(panels))

class LayoutForgeHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        if self.path.endswith('.js') or self.path.endswith('.css') or self.path.endswith('.html'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            pass

    def do_POST(self):
        try:
            if self.path == '/api/download':
                self.handle_download_request()
                return
            elif self.path == '/api/open-downloads':
                self.handle_open_downloads()
                return
            elif self.path == '/api/run-indesign':
                self.handle_run_indesign()
                return
            elif self.path == '/api/open-browser':
                self.handle_open_browser()
                return
            super().do_POST()
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            pass
        except Exception as e:
            print(f"[ERRO POST]: {e}", file=sys.stderr)

    def do_GET(self):
        try:
            clean_path = self.path.split('?')[0]
            if clean_path in ('/', ''):
                self.path = '/index.html'

            if self.path.startswith('/api/status'):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'{"status":"online"}')
                return
            elif self.path.startswith('/api/download'):
                self.handle_download_request_get()
                return
            elif self.path.startswith('/api/open-downloads'):
                self.handle_open_downloads()
                return
            elif self.path.startswith('/api/run-indesign'):
                self.handle_run_indesign()
                return
            elif self.path.startswith('/api/open-browser'):
                self.handle_open_browser()
                return
            super().do_GET()
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            pass
        except Exception as e:
            print(f"[ERRO GET]: {e}", file=sys.stderr)

    def save_file_to_disk(self, safe_filename, file_bytes):
        """Salva o arquivo diretamente na pasta Downloads do Windows, exports/ e InDesign Scripts Panel."""
        saved_paths = []
        try:
            # 1. Salvar na pasta Downloads do usuário Windows
            if os.path.exists(DOWNLOADS_DIR):
                dl_file_path = os.path.join(DOWNLOADS_DIR, safe_filename)
                with open(dl_file_path, 'wb') as f:
                    f.write(file_bytes)
                saved_paths.append(dl_file_path)
                print(f"[SALVO EM DOWNLOADS]: {dl_file_path}")
        except Exception as e:
            print(f"[ERRO AO SALVAR EM DOWNLOADS]: {e}", file=sys.stderr)

        try:
            # 2. Salvar na pasta exports/ do projeto
            export_file_path = os.path.join(EXPORTS_DIR, safe_filename)
            with open(export_file_path, 'wb') as f:
                f.write(file_bytes)
            saved_paths.append(export_file_path)
            print(f"[SALVO EM EXPORTS]: {export_file_path}")
        except Exception as e:
            print(f"[ERRO AO SALVAR EM EXPORTS]: {e}", file=sys.stderr)

        # 3. Se for script JSX, instalar diretamente em todos os painéis de Scripts do Adobe InDesign
        if safe_filename.endswith('.jsx'):
            try:
                panels = get_indesign_scripts_panels()
                for panel in panels:
                    dest_file = os.path.join(panel, safe_filename)
                    with open(dest_file, 'wb') as f:
                        f.write(file_bytes)
                    
                    alias_file = os.path.join(panel, 'LayoutForge_Grade.jsx')
                    with open(alias_file, 'wb') as f:
                        f.write(file_bytes)
                    saved_paths.append(dest_file)
                    print(f"[INSTALADO NO INDESIGN SCRIPTS PANEL]: {dest_file}")
            except Exception as e:
                print(f"[ERRO AO COPIAR P/ INDESIGN SCRIPTS PANEL]: {e}", file=sys.stderr)

        return saved_paths

    def handle_download_request(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            content_type_header = self.headers.get('Content-Type', '')
            
            if 'application/json' in content_type_header:
                data = json.loads(post_data.decode('utf-8'))
                filename = data.get('filename', 'layoutforge-export.txt')
                content = data.get('content', '')
                mime_type = data.get('mimeType', 'application/octet-stream')
                is_base64 = data.get('isBase64', False)
            else:
                parsed = urllib.parse.parse_qs(post_data.decode('utf-8'))
                filename = parsed.get('filename', ['layoutforge-export.txt'])[0]
                content = parsed.get('content', [''])[0]
                mime_type = parsed.get('mimeType', ['application/octet-stream'])[0]
                is_base64 = parsed.get('isBase64', ['false'])[0].lower() in ('true', '1')

            if is_base64:
                if ',' in content:
                    content = content.split(',', 1)[1]
                file_bytes = base64.b64decode(content)
            else:
                file_bytes = content.encode('utf-8')

            if not filename:
                filename = 'layoutforge-export.txt'

            safe_filename = filename.replace('"', '').replace('\r', '').replace('\n', '')
            encoded_filename = urllib.parse.quote(safe_filename)

            self.save_file_to_disk(safe_filename, file_bytes)

            self.send_response(200)
            self.send_header('Content-Type', f'{mime_type}')
            self.send_header('Content-Disposition', f'attachment; filename="{safe_filename}"; filename*=UTF-8\'\'{encoded_filename}')
            self.send_header('Content-Length', str(len(file_bytes)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-cache')
            super().end_headers()
            self.wfile.write(file_bytes)
            
            print(f"[DOWNLOAD SUCESSO] '{safe_filename}' ({len(file_bytes)} bytes)")
        except Exception as e:
            print(f"[DOWNLOAD ERROR] {e}", file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-Type', 'text/plain')
            super().end_headers()
            self.wfile.write(f"Erro no download: {e}".encode('utf-8'))

    def handle_download_request_get(self):
        try:
            url_parts = urllib.parse.urlparse(self.path)
            query = urllib.parse.parse_qs(url_parts.query)
            
            filename = query.get('filename', ['layoutforge-export.txt'])[0]
            content = query.get('content', [''])[0]
            mime_type = query.get('mimeType', ['application/octet-stream'])[0]
            is_base64 = query.get('isBase64', ['false'])[0].lower() in ('true', '1')

            if is_base64:
                if ',' in content:
                    content = content.split(',', 1)[1]
                file_bytes = base64.b64decode(content)
            else:
                file_bytes = content.encode('utf-8')

            safe_filename = filename.replace('"', '').replace('\r', '').replace('\n', '')
            encoded_filename = urllib.parse.quote(safe_filename)

            self.save_file_to_disk(safe_filename, file_bytes)

            self.send_response(200)
            self.send_header('Content-Type', f'{mime_type}')
            self.send_header('Content-Disposition', f'attachment; filename="{safe_filename}"; filename*=UTF-8\'\'{encoded_filename}')
            self.send_header('Content-Length', str(len(file_bytes)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-cache')
            super().end_headers()
            self.wfile.write(file_bytes)
        except Exception as e:
            print(f"[DOWNLOAD GET ERROR] {e}", file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-Type', 'text/plain')
            super().end_headers()
            self.wfile.write(f"Erro no download: {e}".encode('utf-8'))

    def handle_open_downloads(self):
        try:
            url_parts = urllib.parse.urlparse(self.path)
            query = urllib.parse.parse_qs(url_parts.query)
            target_filename = query.get('file', [None])[0]

            if target_filename and os.path.exists(os.path.join(DOWNLOADS_DIR, target_filename)):
                target_path = os.path.join(DOWNLOADS_DIR, target_filename)
                subprocess.Popen(['explorer.exe', '/select,', target_path])
            elif os.path.exists(DOWNLOADS_DIR):
                subprocess.Popen(['explorer.exe', DOWNLOADS_DIR])
            else:
                subprocess.Popen(['explorer.exe', EXPORTS_DIR])

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            super().end_headers()
            self.wfile.write(b'{"status":"ok"}')
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'text/plain')
            super().end_headers()
            self.wfile.write(str(e).encode('utf-8'))

    def handle_run_indesign(self):
        """Abre o script diretamente no Adobe InDesign instalado."""
        try:
            url_parts = urllib.parse.urlparse(self.path)
            query = urllib.parse.parse_qs(url_parts.query)
            target_filename = query.get('file', ['layoutforge-a4_portrait.jsx'])[0]
            target_path = os.path.join(DOWNLOADS_DIR, target_filename)

            if not os.path.exists(target_path):
                target_path = os.path.join(EXPORTS_DIR, target_filename)

            indesign_exe = find_indesign_exe()
            if indesign_exe and os.path.exists(target_path):
                subprocess.Popen([indesign_exe, target_path])
                print(f"[EXECUTANDO NO INDESIGN DIRETO]: {indesign_exe} '{target_path}'")
            elif os.path.exists(target_path):
                os.startfile(target_path)
                print(f"[EXECUTANDO VIA SHELL]: {target_path}")

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            super().end_headers()
            self.wfile.write(b'{"status":"ok"}')
        except Exception as e:
            print(f"[ERRO AO EXECUTAR INDESIGN]: {e}", file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-Type', 'text/plain')
            super().end_headers()
            self.wfile.write(str(e).encode('utf-8'))

    def handle_open_browser(self):
        try:
            url = f"http://localhost:{PORT}/index.html"
            webbrowser.open(url)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            super().end_headers()
            self.wfile.write(b'{"status":"ok"}')
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'text/plain')
            super().end_headers()
            self.wfile.write(str(e).encode('utf-8'))

class ReusableThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        exc_type, exc_val, _ = sys.exc_info()
        if exc_type in (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            return
        super().handle_error(request, client_address)

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    print(f"Iniciando LayoutForge Server na porta {port}...")
    print(f"Diretório Downloads: {DOWNLOADS_DIR}")
    indesign_exe = find_indesign_exe()
    print(f"Executável InDesign detectado: {indesign_exe}")
    panels = get_indesign_scripts_panels()
    print(f"Painéis InDesign detectados: {len(panels)}")
    for p in panels:
        print(f"  - {p}")
    with ReusableThreadingServer(("", port), LayoutForgeHandler) as httpd:
        print(f"Servidor LayoutForge ativo em http://localhost:{port}")
        httpd.serve_forever()

if __name__ == '__main__':
    main()
