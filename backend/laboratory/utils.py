import serial
import hl7
import socket

from .models import LabTestRequest


def json_to_hl7(test_request: LabTestRequest):
    data = hl7.Message()

    sending_app = 'MakeEasyHMIS'
    sending_facility = 'Laboratory'
    receiving_app = ''
    receiving_facility = ''

    # MSH segment
    data.MSH = "|".join([
        "MSH",
        "^~\&",
        sending_app,
        sending_facility,
        receiving_app,
        receiving_facility,
    ])

    # PID segment (Patient Identification)
    pid_seg = ["PID", "1"]
    if test_request.patient_ID:
        pid_seg +=[str(test_request.patient_ID.pk),
            test_request.patient_ID.first_name,
            test_request.patient_ID.second_name,
            str(test_request.patient_ID.age),
            test_request.patient_ID.gender,]
    
    try:
        data.PID = "|".join(pid_seg)
    except Exception as e:
        print(e)

    # OBR segment (Observation Request)
    obr_seg = ["OBR", "1"]
    if test_request.item_id:
        obr_seg += [test_request.item_id.name,]
    if test_request.test_profile_ID:
        obr_seg += [test_request.test_profile_ID.name,]
    obr_seg += [str(test_request.pk),]
    try:
        data.OBR = "|".join(obr_seg)
    except Exception as e:
        print(e)

    # ORC segment (Common Order)
    
    data.ORC = "|".join([
        "ORC", "NW",
    ])

    # NTE segment (Notes and Comments)
    nte_seg = ["NTE", "1"]
    if test_request.note:
        nte_seg += [test_request.note,]
    try:
        data.NTE = "|".join(nte_seg)
    except Exception as e:
        print(e)

    return str(data)


def send_through_rs232(data: str, port='/dev/ttySO', baudrate=9600):
    try:
        ser = serial.Serial(port, baudrate)
        ser.write(data.encode())
        ser.close()
        return True
    except Exception as e:
        print(e)
        return False


def send_through_tcp(data: str, host='localhost', port=12345):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as serve:
            serve.connect((host, port))
            serve.sendall(data.encode())
            return True
    except Exception as e:
        print(e)
        return False

