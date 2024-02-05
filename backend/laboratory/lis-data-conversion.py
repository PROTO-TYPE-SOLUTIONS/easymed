import socket
import datetime
from django.http import HttpResponse
from .models import LabTestRequest

def convert_lab_test_request_to_hl7(lab_test_request):
    patient = lab_test_request.patient_ID
    test_profile = lab_test_request.test_profile_ID
    json_data = {
        "patient": {
            "id": str(patient.id),
            "name": str(patient.name),
            "dob": str(patient.date_of_birth),
            "gender": str(patient.gender)
        },
        "tests": [
            {
                "testCode": str(test_profile.item_number.id),
                "testName": str(test_profile.name),
                "requestingPhysician": str(lab_test_request.requested_by.name),
                "requestDate": lab_test_request.order_bill.date.strftime("%Y-%m-%d")
            }
        ]
    }

    hl7_message = convert_lab_test_request_to_hl7(json_data)
    return hl7_message

def generate_hl7_message(request, lab_test_request_id):
    lab_test_request = LabTestRequest.objects.get(id=lab_test_request_id)
    hl7_message = convert_lab_test_request_to_hl7(lab_test_request)

    return HttpResponse(hl7_message, content_type="text/plain")


# Function to send HL7 message to the lab equipment's IP address
def send_hl7_to_lab(ip_address, hl7_message):
    lab_address = (ip_address, 12345)

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect(lab_address)
        s.sendall(hl7_message.encode())
        response = s.recv(1024)

    print("Response from lab equipment:", response.decode())



def generate_and_send_hl7(request, lab_test_request_id):
    lab_test_request = LabTestRequest.objects.get(id=lab_test_request_id)
    lab_equipment = lab_test_request.equipment
    hl7_message = convert_lab_test_request_to_hl7(lab_test_request)

    if lab_equipment:
        send_hl7_to_lab(lab_equipment.ip_address, lab_equipment.port, hl7_message)
        return HttpResponse("HL7 message sent to the lab equipment")
    else:
        return HttpResponse("No associated equipment found for this test request")