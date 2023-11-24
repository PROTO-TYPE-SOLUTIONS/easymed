from django.db.models.signals import post_save
from django.dispatch import receiver


# emails
from django.core.mail import send_mail
from django.conf import settings

# models
from .models import Patient, Appointment

@receiver(post_save, sender=Patient)
def create_appointment(sender: Patient, instance: Patient, created: bool, **kwargs):
    if not created:
        return
    try:
        Appointment.objects.create(patient=instance)
    except Exception as e:
        print(e)

@receiver(post_save, sender=Appointment) 
def send_appointment_email(sender: Appointment, instance: Appointment, created: bool, **kwargs):
    # email should only be sent to patients who have a user's account
    if not created:
        return
    
    if not instance.patient.user_id:
        return
    
    scheduled_time = instance.appointment_date_time.strftime("%Y-%m-%d")
    subject = "Appointment Confirmation"
    message = f"Your appointment has been confirmed and scheduled for {scheduled_time}"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [instance.patient.user_id.email]
    send_mail(subject, message, from_email, recipient_list)

