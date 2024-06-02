import signal
import socket
import hl7
import json
import requests
from decouple import config
from hl7_utils import HL7Utils

''''
Will listen for incoming data, convert to hl7 then send to backend
Purpose: Will run alongside main system, picks incoming lab results 
from equipments, converts to json then sends to results endpoint
'''

parser = HL7Utils()
def main():
    host = '127.0.0.1' 
    port = 9091
    

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
                        # hl7_message = hl7.parse(decoded_data)
                        convert_hl7_to_json(decoded_data)
                        send_to_lab_endpoints(decoded_data, 'hl7')
                        print("Message is:")

                    elif decoded_data.startswith('H|^&'):
                        astm_message_dict = astm_to_json(decoded_data)
                        send_to_lab_endpoints(astm_message_dict, 'astm')

                finally:
                    connection.close()

            except Exception as e:
                print(f"Exception while accepting incoming connection: {e}")




def convert_hl7_to_json(data: dict):
     json_message =  parser.parse(data)
     detaild= parser.detailed(json_message)
     
     print(json_message)
     return {"original":json_message,"detailed":detaild}




def astm_to_json(astm_data):
    pass



def signal_handler(signal, frame):
    print("Terminating process...")
    exit(0)

def send_to_lab_endpoints(data, format):
    endpoints = {
        'lab_test_results': 'http://127.0.0.1:8080/lab/lab-test-results/',
        'lab_test_results_panel': 'http://127.0.0.1:8080/lab/lab-test-results-panel/'
    }

    email = config('BACKEND_USERNAME')
    password = config('BACKEND_PASSWORD')

    auth = requests.post('http://127.0.0.1:8080/customuser/login/', data={'email': email, 'password': password})

    if auth.status_code == 200:
        access_token = auth.json()['access']
        refresh_token = auth.json()['refresh']

        for endpoint in endpoints.values():
            response = requests.post(
                endpoint,
                headers={'Authorization': f'Bearer {access_token}'},
                json=data
            )

            if response.status_code == 200:
                print(f"Data sent successfully to {endpoint}")
            else:
                print(f"Failed to send data to {endpoint}. Status code: {response.status_code}")
    else:
        print(f"Failed to obtain access tokens. Status code: {auth.status_code}")

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    main()


