import socket

HOST = "127.0.0.1"
PORT = 8090

# Data to send (convert to bytes before sending)
data = "This is some test data to send through TCP."
data_to_send = data.encode()

try:
  with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    s.sendall(data_to_send)
    print(f"Sent data to {HOST}:{PORT}")
except Exception as e:
  print(f"An error occurred: {e}")