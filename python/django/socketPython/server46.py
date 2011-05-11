# Echo server program
import socket
import sys
from main import socketHandler

HOST = '127.0.0.1'        # Symbolic name meaning all available interfaces
PORT = 50007              # Arbitrary non-privileged port
s = None
for res in socket.getaddrinfo(HOST, PORT, socket.AF_UNSPEC,
                              socket.SOCK_STREAM, 0, socket.AI_PASSIVE):
    af, socktype, proto, canonname, sa = res
    try:
        s = socket.socket(af, socktype, proto)
    except socket.error, msg:
        s = None
        continue
    try:
        s.bind(sa)
        s.listen(5)
    except socket.error, msg:
        s.close()
        s = None
        continue
    break
if s is None:
    print 'could not open socket'
    sys.exit(1)
while True:
    conn, addr = s.accept()
    try:
        conn.settimeout(5)
        data = conn.recv(1024)
        socketHandler(conn, data)
    except socket.timeout:  
        conn.send('Time out')
    except:
        conn.send("SocketHandle Error")
    finally:
        conn.close()
    