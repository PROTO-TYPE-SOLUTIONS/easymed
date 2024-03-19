import serial
import hl7
import socket
# from astm import records
from datetime import datetime


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

