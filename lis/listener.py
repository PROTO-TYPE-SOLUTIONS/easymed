''''
This script will server as a Lab Equipment Listening for TestRequests
Whenever the EquipmentTestRequest model get's a new record, a signal will
be fired which will convirt the data to appropriate format and send to this listener
'''

import socket

def main():
    # Define host and port to listen on
    host = '127.0.0.1'
    port = 6060

    # Create a socket object
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        # Bind the socket to the host and port
        server_socket.bind((host, port))

        # Start listening for incoming connections
        server_socket.listen(1)
        print(f"Listening for incoming connections on {host}:{port}")

        # Accept incoming connection
        client_socket, client_address = server_socket.accept()
        print(f"Connection from {client_address} established.")

        # Receive data from the client
        while True:
            data = client_socket.recv(1024)
            if not data:
                break
            print("Received:", data.decode('utf-8', errors='ignore'))

    except Exception as e:
        print("An error occurred:", e)
    # finally:
    #     # Close the connection
    #     server_socket.close()

if __name__ == "__main__":
    main()
