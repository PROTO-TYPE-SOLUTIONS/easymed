
import socket

def main():
    host = '127.0.0.1'
    port = 9091

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.bind((host, port))
        server_socket.listen()

        print(f"Listening for incoming connections on {host}:{port}...")

        try:
            while True:
                connection, address = server_socket.accept()
                print(f"Connection established from: {address}")

                try:
                    while True:
                        data = connection.recv(1024)

                        if not data:
                            print(f"Connection closed by {address}.")
                            break

                        print(f"Received data from {address}: {data.decode('utf-8')}")

                except KeyboardInterrupt:
                    print("Terminating the connection...")
                finally:
                    connection.close()

        except KeyboardInterrupt:
            print("Terminating the server...")

if __name__ == "__main__":
    main()


