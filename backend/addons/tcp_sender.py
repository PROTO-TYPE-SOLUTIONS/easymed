import socket

HOST = "172.16.4.137"
PORT = 9000

# Data to send (convert to bytes before sending)
data = (
  "MSH|^~\&|EASYMED|LABNAME|20240101000000||ADT^O01^ADTOBR|MSG00001|P|2.4\r"
  "PID|||12345^DOE^JOHN^^^^^M^^^^^19800101|1234567890||"
  "OBR|||123456||LAB^TEST^1|20230101|20230101|^^^|"
  "OBX|||1|SN|12345|100|mg/dL|F|"
  "OBX|||2|SN|23456|200|U/L|F|"
  "OBX|||3|SN|34567|50|mmHg|F|"
  "OBX|||4|SN|45678|25|bpm|F|"
)
data_to_send = data.encode()

def check_endpoint(host, port):
    """Check if the endpoint is available by attempting to establish a connection."""
    try:
        with socket.create_connection((host, port), timeout=10) as sock:
            print(f"Successfully connected to {host}:{port}")
            return True
    except socket.error as err:
        print(f"Failed to connect to {host}:{port}. Error: {err}")
        return False

if check_endpoint(HOST, PORT):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((HOST, PORT))
            s.sendall(data_to_send)
            print(f"Sent data to {HOST}:{PORT}")
    except Exception as e:
        print(f"An error occurred while sending data: {e}")
else:
    print(f"Cannot send data. No service is listening on {HOST}:{PORT}")





# import socket

# HOST = "192.168.100.56"
# PORT = 9000

# # Data to send (convert to bytes before sending)
# data = (
#   "MSH|^~\&|EASYMED|LABNAME|20240101000000||ADT^O01^ADTOBR|MSG00001|P|2.4\r"
#   "PID|1||{patient_id}||{patient_name}^^^^PI||{date_of_birth}|{gender}^||{address}^^Postal^Jones^Mary||||||||||||||||||||||||||||\r"
#   "OBR|{obr_sequence}|||{sample}|{test_name}||||||||{ordering_physician}||||||||{specimen_collection_date_time}||||||{test_profile}||||\r")
# data_to_send = data.encode()

# try:
#   with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#     s.connect((HOST, PORT))
#     s.sendall(data_to_send)
#     print(f"Sent data to {HOST}:{PORT}")
# except Exception as e:
#   print(f"An error occurred: {e}")


