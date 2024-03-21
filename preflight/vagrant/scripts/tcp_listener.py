import socket

def main():
    # Define the host and port to listen on
    host = '127.0.0.1'  # Use '0.0.0.0' to listen on all available interfaces
    port = 8090        # Choose any available port number
    
    # Create a TCP socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        # Bind the socket to the host and port
        server_socket.bind((host, port))

        # Listen for incoming connections
        server_socket.listen()

        print(f"Listening for incoming connections on {host}:{port}...")

        # Accept incoming connections
        connection, address = server_socket.accept()
        print(f"Connection established from: {address}")

        try:
            while True:
                # Receive data from the client
                data = connection.recv(1024)

                if not data:
                    print("Connection closed by client.")
                    break

                print(f"Received data: {data.decode('utf-8')}")

        finally:
            # Close the connection
            connection.close()

if __name__ == "__main__":
    main()