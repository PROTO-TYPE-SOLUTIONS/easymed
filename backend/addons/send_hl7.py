import socket

def send_hl7_message(host='127.0.0.1', port=5555):
    # Sample HL7 message (version 2.3)
    hl7_message = (
        "MSH|^~\\&|SendingApp|SendingFac|ReceivingApp|ReceivingFac|202412141234||ORM^O01|123456|P|2.3\r"
        "PID|1||12345^^^Hospital^MR||Doe^John||19700101|M|||123 Main St^^Metropolis^NY^12345||(555)555-5555|||S||123456789|987-65-4320\r"
        "OBR|1||54321^Lab||Blood Test^LAB^1234||202412141200|||F||||||123456789^Smith^Jane||||||||||||||\r"
        "OBX|1|NM|1234^Hemoglobin^LAB||14.8|g/dL|12.0-16.0|N|||F\r"
    )
    
    try:
        # Create a socket connection to the TCP listener
        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_socket.connect((host, port))
        print(f"Connected to {host}:{port}")

        # Send the HL7 message
        client_socket.sendall(hl7_message.encode('utf-8'))
        print("HL7 message sent successfully.")

    except Exception as e:
        print(f"Error sending HL7 message: {e}")

    finally:
        client_socket.close()

if __name__ == "__main__":
    send_hl7_message()
