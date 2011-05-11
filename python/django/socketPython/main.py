# -*-coding:UTF-8-*-
import socket
def socketHandler(conn, res):
	name = socket.gethostname()
	IP = socket.gethostbyname(name)
	conn.send(IP)