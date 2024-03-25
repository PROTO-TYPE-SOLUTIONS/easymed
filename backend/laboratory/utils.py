import serial
import hl7
import socket
# from astm import records
from datetime import datetime
from decouple import config
from smb.SMBConnection import SMBConnection
import os


from .models import LabTestRequest


def create_hl7_message(test_request):
    patient = test_request.patient
    hl7_message = (
        "MSH|^~\&|Sender|Receiver|HL7APP|TEST|20240101000000||ORU^R01|MSG00001|P|2.4\r"
        "PID|||{patient_id}||{patient_name}||{date_of_birth}|{gender}\r"
        "OBR|1|||{test_id}||||||||||||||||"
    ).format(
        patient_id=patient.id,
        patient_name=patient.first_name + " " + patient.second_name,
        date_of_birth=patient.date_of_birth.strftime("%Y%m%d") if patient.date_of_birth else "",
        gender=patient.gender,
        test_id=test_request.id,
    )

    return hl7_message


''''
Let's get the test request and convert to ASTM format
'''
def create_astm_message(test_request):
    patient = test_request.patient
    astm_message = (
        "H|\^&|||host^name||{timestamp}|||||P|1||||||||||\r"
        "P|1|OBR|1|||{test_id}||||||||||||||{timestamp}\r"
        "P|2|{patient_id}||{patient_name}||{date_of_birth}|{gender}\r"
    ).format(
        timestamp=datetime.now().strftime("%Y%m%d%H%M%S"),
        patient_id=patient.id,
        patient_name=patient.first_name + " " + patient.second_name,
        date_of_birth=patient.date_of_birth.strftime("%Y%m%d") if patient.date_of_birth else "",
        gender=patient.gender,
        test_id=test_request.id,
    )

    return astm_message



def send_through_rs232(data: str, port='/dev/ttySO', baudrate=9600):
    try:
        ser = serial.Serial(port, baudrate)
        ser.write(data.encode())
        print("sending through rs232..." + data)
        ser.close()
        return True
        
    except Exception as e:
        print(e)
        return False
        


def send_through_tcp(data: str, host='127.0.0.1', port=8090):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as serve:
            serve.connect((host, port))
            serve.sendall(data.encode())
            print("sending through tcp..." + data)
            return True
    except Exception as e:
        print(e)
        return False



'''
Let's try to send test request in ASTM format to HumaStar 100/200 (or pretty much any equipment that uses the Network shared folders set up)

'''
def send_to_network_folder(
        data: str,
        host=config("NETWORK_EQUIPMENT_IP"),
        username= config("NETWORK_USERNAME"),
        password= config("NETWORK_USER_PASSWORD"),
        shared_folder= config("NETWORK_INPUT_WORKLIST_FILE"),
        ):
    try:
        if not data:
            raise ValueError("Data is null")

        if not host:
            raise ValueError("Host is null")

        if not username:
            raise ValueError("Username is null")

        if not password:
            raise ValueError("Password is null")

        if not shared_folder:
            raise ValueError("Shared folder is null")

        # Attempt SMB connection
        smb_success = send_over_smb(data, host, username, password, shared_folder)
        if smb_success:
            return True

        # # Attempt NFS connection
        # nfs_success = send_over_nfs(data, host, shared_folder)
        # if nfs_success:
        #     return True

        # print("Both SMB and NFS connections failed.")
        # return False

    except Exception as e:
        import traceback

        print("An exception occurred in send_to_network_folder:")
        print(traceback.format_exc())

def send_over_smb(data: str, host, username, password, shared_folder):
    try:
        conn = SMBConnection(username, password, '', '')
        conn.connect(host)

        with conn:
            with conn.open_file(shared_folder + '/worklist.txt', 'w') as file:
                file.write(data)
                print("Sending over SMB..." + data)

        return True
    except Exception as e:
        print("SMB Connection failed:", e)
        return False

# def send_over_nfs(data: str, host, shared_folder):
#     try:
#         # Construct NFS file path
#         nfs_path = os.path.join(shared_folder, '/worklist.txt')

#         # Write data to the file (assuming NFS mount is already set up)
#         with open(nfs_path, 'w') as file:
#             file.write(data)
#             print("Sending over NFS..." + data)

#         return True
#     except Exception as e:
#         print("NFS Write failed:", e)
#         return False



# def send_to_network_folder(
#         data: str,
#         host=config("NETWORK_EQUIPMENT_IP"),
#         username= config("NETWORK_USERNAME"),
#         password= config("NETWORK_USER_PASSWORD"),
#         shared_folder= config("NETWORK_INPUT_WORKLIST_FILE"),
#         ):
#     try:
#         # Attempt SMB connection
#         smb_success = send_over_smb(data, host, username, password, shared_folder)
#         if smb_success:
#             return True
        
#         # Attempt NFS connection
#         nfs_success = send_over_nfs(data, host, shared_folder)
#         if nfs_success:
#             return True
        
#         print("Both SMB and NFS connections failed.")
#         return False
        
#     except Exception as e:
#         print(e)
#         return False

# def send_over_smb(data: str, host, username, password, shared_folder):
#     try:
#         conn = SMBConnection(username, password, '', '')
#         conn.connect(host)

#         with conn:
#             with conn.open_file(shared_folder + '/filename.txt', 'w') as file:
#                 file.write(data)
#                 print("Sending over SMB..." + data)

#         return True
#     except Exception as e:
#         print("SMB Connection failed:", e)
#         return False

# def send_over_nfs(data: str, host, shared_folder):
#     try:
#         # Construct NFS file path
#         nfs_path = os.path.join(shared_folder, 'filename.txt')

#         # Write data to the file (assuming NFS mount is already set up)
#         with open(nfs_path, 'w') as file:
#             file.write(data)
#             print("Sending over NFS..." + data)

#         return True
#     except Exception as e:
#         print("NFS Write failed:", e)
#         return False
