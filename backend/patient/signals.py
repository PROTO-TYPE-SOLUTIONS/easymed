from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Prescription

from makeeasyhmis.celery_tasks import generate_prescription_pdf, appointment_assign_notification

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



'''signal to fire up celery task to  to generated pdf once Prescription tale gets a new entry'''
@receiver(post_save, sender=Prescription)
def generate_precription(sender, instance, created, **kwargs):
    if created:
        generate_prescription_pdf.delay(instance.pk)



''''signal to fire up the celery task to send assigned notifications'''
@receiver(post_save, sender=Appointment)
def appointment_assigned_signal(sender, instance, created, **kwargs):
    if created :
        appointment_assign_notification.delay(instance.id)

@receiver(pre_save, sender=Appointment)
def appointment_assigned_update_signal(sender, instance,  **kwargs):
    old_doctor = instance.assigned_doctor
    if old_doctor:
        appointment_assign_notification.delay(instance.id)



'''send email on Appointment creation'''
from makeeasyhmis.celery_tasks import send_appointment_status_email
@receiver(post_save, sender=Appointment)
def handle_appointment_status_change(sender, instance, created, **kwargs):
    if created:
        send_appointment_status_email.delay(instance.id)


'''send email on Appointment status change'''
@receiver(post_save, sender=Appointment)
def handle_appointment_status_change(sender, instance, created, **kwargs):
    if not created:
        if instance.status != instance.status:
            send_appointment_status_email.delay(instance.id)
    instance._previous_status = instance.status
    print("Email sent")