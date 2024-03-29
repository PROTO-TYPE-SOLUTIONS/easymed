import socket

HOST = "127.0.0.1"
PORT = 8090

# Data to send (convert to bytes before sending)
data = (
  "MSH|^~\&|EASYMED|LABNAME|20240101000000||ADT^O01^ADTOBR|MSG00001|P|2.4\r"
  "PID|1||{patient_id}||{patient_name}^^^^PI||{date_of_birth}|{gender}^||{address}^^Postal^Jones^Mary||||||||||||||||||||||||||||\r"
  "OBR|{obr_sequence}|||{sample}|{test_name}||||||||{ordering_physician}||||||||{specimen_collection_date_time}||||||{test_profile}||||\r")
data_to_send = data.encode()

try:
  with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    s.sendall(data_to_send)
    print(f"Sent data to {HOST}:{PORT}")
except Exception as e:
  print(f"An error occurred: {e}")