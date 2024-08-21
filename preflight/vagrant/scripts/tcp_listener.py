import socket

def main():
    host = '127.0.0.1' 
    port = 8090 
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        # Bind the socket to the host and port
        server_socket.bind((host, port))

        # Listen for incoming connections
        server_socket.listen()

        print(f"Listening for incoming connections on {host}:{port}...")

        # Accept incoming connections
        while True:
            connection, address = server_socket.accept()
            print(f"Connection established from: {address}")

            try:
                received_data = b''
                while True:
                    data = connection.recv(1024)
                    received_data += data

                    if not data:
                        break

                print(f"Received data: {received_data.decode('utf-8')}")

            finally:
                # Close the connection
                connection.close()

if __name__ == "__main__":
    main()


