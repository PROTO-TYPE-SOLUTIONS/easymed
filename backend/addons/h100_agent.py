import os
import time
import socket
import requests
import threading
from pathlib import Path
from decouple import config
import signal
import sys

''''
This code will run as a server on HumaStar computer
It will listen for incoming data on a specified port, get the
incoming data and save to \ProgramData\HI\Human\LIS\ASTM\Input
It will periodicall check the \ProgramData\HI\Human\LIS\ASTM\Output
where the equipment posts results, if there is any, it will be picked and sent to 
lab endpoint
'''

# Define constants for directories and server address
INPUT_DIR = r"C:\Program Files\Hi\input"
OUTPUT_DIR = r"C:\Program Files\Hi\output"
LAB_TEST_RESULTS_ENDPOINT = 'http://127.0.0.1:8080/lab/lab-test-results/'
LOGIN_ENDPOINT = 'http://127.0.0.1:8080/customuser/login/'

# Ensure input and output directories exist
Path(INPUT_DIR).mkdir(parents=True, exist_ok=True)
Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)

def handle_client_connection(client_socket):
    with client_socket:
        data = client_socket.recv(1024)
        if data:
            timestamp = int(time.time())
            input_file_path = os.path.join(INPUT_DIR, f"input_{timestamp}.txt")
            with open(input_file_path, 'wb') as f:
                f.write(data)
            print(f"Data received and saved to {input_file_path}")

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(("0.0.0.0", 9091))
    server_socket.listen(5)
    print("Server listening on port 9091")
    
    while True:
        client_sock, address = server_socket.accept()
        client_handler = threading.Thread(
            target=handle_client_connection,
            args=(client_sock,)
        )
        client_handler.start()

def send_to_lab_endpoints(data):
    email = config('BACKEND_USERNAME')
    password = config('BACKEND_PASSWORD')

    auth_response = requests.post(LOGIN_ENDPOINT, data={'email': email, 'password': password})

    if auth_response.status_code == 200:
        access_token = auth_response.json()['access']
        headers = {'Authorization': f'Bearer {access_token}'}

        response = requests.post(
            LAB_TEST_RESULTS_ENDPOINT,
            headers=headers,
            json=data
        )

        if response.status_code == 200:
            print(f"Data sent successfully to {LAB_TEST_RESULTS_ENDPOINT}")
        else:
            print(f"Failed to send data to {LAB_TEST_RESULTS_ENDPOINT}. Status code: {response.status_code}")
    else:
        print(f"Failed to obtain access tokens. Status code: {auth_response.status_code}")

def check_output_folder():
    while True:
        for filename in os.listdir(OUTPUT_DIR):
            file_path = os.path.join(OUTPUT_DIR, filename)
            if os.path.isfile(file_path):
                with open(file_path, 'r') as f:
                    data = f.read()
                    send_to_lab_endpoints(data)
                os.remove(file_path)
                print(f"Processed and removed file {file_path}")
        time.sleep(60)

def signal_handler(sig, frame):
    print('Exiting...')
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)

    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()

    check_output_thread = threading.Thread(target=check_output_folder)
    check_output_thread.daemon = True
    check_output_thread.start()

    server_thread.join()
    check_output_thread.join()
