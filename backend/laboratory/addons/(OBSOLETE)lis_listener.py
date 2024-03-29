import signal
import socket
import hl7
import json
import requests

def main():
    host = '127.0.0.1' 
    port = 8090 
    

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.bind((host, port))
        server_socket.listen()

        print(f"Listening for incoming connections on {host}:{port}...")

        while True:
            try:
                connection, address = server_socket.accept()
                print(f"Connection established from: {address}")

                try:
                    received_data = b''
                    while True:
                        data = connection.recv(1024)
                        received_data += data

                        if not data:
                            break

                    decoded_data = received_data.decode('utf-8')
                    print(f"Received data: {decoded_data}")

                    if decoded_data.startswith('MSH'):
                        hl7_message = hl7.parse(decoded_data)

                        send_to_lab_endpoints(hl7_message, 'hl7')
                        print("Message is:", hl7_message)

                    elif decoded_data.startswith('H|^&'):
                        astm_message_dict = astm_to_json(decoded_data)
                        send_to_lab_endpoints(astm_message_dict, 'astm')

                finally:
                    connection.close()

            except Exception as e:
                print(f"Exception while accepting incoming connection: {e}")


def signal_handler(signal, frame):
    print("Terminating process...")
    exit(0)



def astm_to_json(astm_data):
    pass

def send_to_lab_endpoints(data, format):
    endpoints = {
        'lab_test_results': 'http://127.0.0.1:8080/lab/lab-test-results/',
        'lab_test_results_panel': 'http://127.0.0.1:8080/lab/lab-test-results-panel/'
    }

    for endpoint in endpoints.values():
        response = requests.post(endpoint, json=data)
        if response.status_code == 200:
            print(f"Data sent successfully to {endpoint}")
        else:
            print(f"Failed to send data to {endpoint}. Status code: {response.status_code}")

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    main()