import serial
import hl7
import socket
# from astm import records
from datetime import datetime
from decouple import config
from smb.SMBConnection import SMBConnection
import os


from .models import LabTestRequest, LabEquipment,LabTestRequestPanel



def create_hl7_message(test_request_panel):
    # Extract patient from AttendanceProcess
    patient = test_request_panel.lab_test_request.process.attendanceprocess.patient
    lab_test_request_panels = LabTestRequestPanel.objects.filter(lab_test_request=test_request_panel.lab_test_request)

    # Generate HL7 message
    hl7_message = (
        "MSH|^~\\&|EASYMED|LABNAME|20240101000000||ADT^O01^ADTOBR|MSG00001|P|2.4\r"
    )
    
    # Generate PID segment
    hl7_message += (
        "PID|1||{patient_id}||{patient_name}^^^^PI||{date_of_birth}|{gender}^||{address}^^Postal^Jones^Mary||||||||||||||||||||||||||||\r"
    ).format(
        patient_id=patient.id,
        patient_name=f"{patient.first_name}^{patient.second_name}",
        date_of_birth=patient.date_of_birth.strftime("%Y%m%d") if patient.date_of_birth else "",
        gender=patient.gender,
        address=patient.address if hasattr(patient, 'address') else "address",
    )

    obr_sequence = 0
    for panel in lab_test_request_panels:
        obr_sequence += 1
        lab_test_panel = panel.test_panel
        
        # Generate OBR segment
        hl7_message += (
            "OBR|{obr_sequence}|||{test_code}^{test_name}||||||||{ordering_physician}||||||||{specimen_collection_date_time}||||||{test_profile}||||\r"
        ).format(
            obr_sequence=obr_sequence,
            test_code=panel.test_code,
            test_name=lab_test_panel.name,
            ordering_physician=test_request_panel.lab_test_request.requested_by.first_name if test_request_panel.lab_test_request.requested_by else "",
            specimen_collection_date_time=test_request_panel.lab_test_request.requested_on.strftime("%Y%m%d%H%M%S") if test_request_panel.lab_test_request.requested_on else "",
            test_profile=test_request_panel.lab_test_request.test_profile.name if test_request_panel.lab_test_request.test_profile else ""
        )

    print("Generated data:", hl7_message)

    return hl7_message


''''
Let's get the test request and convert to ASTM format
'''
def create_astm_message(test_request):
    # Extract patient from AttendanceProcess
    patient = test_request.process.attendanceprocess.patient
    lab_test_request_panels = LabTestRequestPanel.objects.filter(lab_test_request=test_request)

    # Generate ASTM header
    astm_message = (
        "H|\\^&|{timestamp}|{facility_id}|{patient_id}|{patient_name}||{gender}|{order_date_time}||P|1|{test_id}||||||||\r"
    ).format(
        timestamp=datetime.now().strftime("%Y%m%d%H%M%S"),
        facility_id="FACILITY",
        patient_id=patient.id,
        patient_name=f"{patient.first_name} {patient.second_name}",
        gender=patient.gender,
        order_date_time=test_request.requested_on.strftime("%Y%m%d%H%M%S"),
        test_id=test_request.id,
    )

    for panel in lab_test_request_panels:
        lab_test_panel = panel.test_panel
        astm_message += (
            "O|{test_name}|{test_id}|{test_type}|||{ordering_physician}||{result_status}||{sample_collection_date_time}||{result_date_time}||||\r"
        ).format(
            test_name=lab_test_panel.name,
            test_id=panel.test_code,
            test_type="A",
            ordering_physician=test_request.requested_by.first_name if test_request.requested_by else "",
            result_status="F",  # waiting for results
            sample_collection_date_time=test_request.requested_on.strftime("%Y%m%d%H%M%S"),
            result_date_time=test_request.requested_on.strftime("%Y%m%d%H%M%S"),
        )

    print("Generated data:", astm_message)

    return astm_message


# def create_astm_message(test_request):
#     patient = test_request.patient
#     astm_message = (
#         "H|\^&|||host^name||{timestamp}|||||P|1||||||||||\r"
#         "P|1|OBR|1|||{test_id}||||||||||||||{timestamp}\r"
#         "P|2|{patient_id}||{patient_name}||{date_of_birth}|{gender}\r"
#     ).format(
#         timestamp=datetime.now().strftime("%Y%m%d%H%M%S"),
#         patient_id=patient.id,
#         patient_name=patient.first_name + " " + patient.second_name,
#         date_of_birth=patient.date_of_birth.strftime("%Y%m%d") if patient.date_of_birth else "",
#         gender=patient.gender,
#         test_id=test_request.id,
#     )

#     return astm_message



''''
The system uses TCP/IP as primary means of coms
The function below has not been tasted and will be retired
'''

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
        

''''
This is the primary means of coms
'''
def send_through_tcp(data: str, equipment, host=None, port=None):
    if host is None:
        host = equipment.ip_address
    if port is None:
        port = int(equipment.port)
    print(host, port)
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as serve:
            serve.connect((host, port))
            serve.sendall(data.encode())
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
