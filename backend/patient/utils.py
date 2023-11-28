import time
from django.core.mail import send_mail
from django.conf import settings

from .models import Appointment


def send_appointment_email(appointments: list[Appointment],):
    # email should only be sent to patients who have a user's account
   
    for appointment in appointments:
        if appointment.patient.user_id:
            print("start sending email")
            scheduled_time = appointment.appointment_date_time.strftime("%Y-%m-%d")
            subject = "Appointment Confirmation"
            message = f"Your appointment has been confirmed and scheduled for {scheduled_time}"
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [appointment.patient.user_id.email]
            print(f"start sending email from {from_email}")
            send_mail(subject, message, from_email, recipient_list)
            time.sleep(.5)

