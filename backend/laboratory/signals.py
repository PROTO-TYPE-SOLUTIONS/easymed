from django.db.models.signals import post_save, pre_save
import pdb
from patient.models import AttendanceProcess
from billing.models import InvoiceItem
from django.dispatch import receiver
from easymed.celery_tasks import generate_labtestresult_pdf


# models
from .models import (
    EquipmentTestRequest,
    LabTestRequestPanel,
    LabTestRequest,
    LabTestProfile,
    LabTestPanel,
    LabReagent,
    LabEquipment,
    LabTestRequestPanel,
    LabTestRequestPanel,
)
# utils
from .utils import (
    send_through_rs232,
    send_through_tcp,
    create_hl7_message,
    create_astm_message,
    send_to_network_folder,
) 



@receiver(post_save, sender=EquipmentTestRequest)
def send_to_equipment(sender, instance, created, **kwargs):
    if created:
        test_request_panel = instance.test_request_panel
        equipment = instance.equipment
        print("Send to equipment signal firing")
        print("Equipment Is:", equipment, test_request_panel, equipment.data_format)

        if equipment.data_format == "hl7":
            data = create_hl7_message(test_request_panel)
            print("Data is HL7")
            if equipment.category == "rs232":
                send_through_rs232(data=data)
                print("Data is: " + data)
            elif equipment.category == 'tcp':
                send_through_tcp(data=data, equipment=equipment)
            elif equipment.category == "netshare":
                send_to_network_folder(data=data)
                print("Data is: " + data)    

        elif equipment.data_format == "astm":
            data = create_astm_message(test_request_panel)
            print("Data is ASTM")
            if equipment.category == "rs232":
                send_through_rs232(data=data)
                print("Data is: " + data)
            elif equipment.category == 'tcp':
                send_through_tcp(data=data, equipment=equipment)
            elif equipment.category == "netshare":
                send_to_network_folder(data=data)
                print("Data is: " + data)    
        else:
            print("Data not HL7")




# '''signal to fire up celery task to  to generated pdf once LabTestResult table gets a new entry'''
# @receiver(post_save, sender=LabTestResult)
# def generate_labtestresult(sender, instance, created, **kwargs):
#     if created:
#         generate_labtestresult_pdf.delay(instance.pk)

'''
This will capture test request and send to HumaStar 100 Computer
HumaStar 100 uses network shared files
# '''
# @receiver(post_save, sender=EquipmentTestRequest)
# def send_to_networked_equipment(sender, instance, created, **kwargs):
#     if created:
#         test_request = instance.test_request
#         equipment = instance.equipment
#         print("Send to network equipment signal firing")
#         print("Equipment Is:", equipment, test_request, equipment.data_format, equipment.category)

#         data = create_astm_message(test_request)

#         send_to_network_folder(data=data)
#         print("Data is: " + data)


        # if equipment.data_format == "astm" and equipment.category == 'netshare':
        #     data = create_astm_message(test_request)
        #     print("Everything looks good, proceeding to send to equipment...")

            
        #     send_to_network_folder(data=data)
        #     print("Data is: " + data)

        # elif equipment.category != 'netshare':
        #         print("Equipment not Network shared")

        # elif equipment.data_format != 'astm':
        #         print("Data not AST format")    




# @receiver(post_save, sender=LabTestResult)
# def update_lab_test_request(sender, instance, **kwargs):
#     # Check if the LabTestResult instance has a lab_test_request associated with it
#     if instance.lab_test_request:
#         lab_test_request = instance.lab_test_request
#         # Update the LabTestRequest to indicate that it has a result
#         lab_test_request.has_result = True
#         lab_test_request.save()


# @receiver(post_save, sender=ResultsVerification)
# def approve_lab_test_result(sender, instance, **kwargs):
#     # Check if the ResultsVerification instance has a lab_test_result associated with it
#     if instance.lab_results:
#         lab_results = instance.lab_results
#         # Update the LabTestResult to indicate that it has been approved
#         lab_results.approved = True
#         lab_results.save()
    
#     if instance. lab_test_request:
#         lab_test_request = instance.lab_test_request
#         try:
#             process = AttendanceProcess.objects.get(labTest=lab_test_request)
#             # Print the process for debugging purposes
#             test_profile = lab_test_request.test_profile.item
#             process.track = "added result"
#             process.labResult = lab_results
#             process.labTech = lab_results.recorded_by
#             process.save()
#             InvoiceItem.objects.create(invoice=process.invoice, item=test_profile)
#             print(f'Process ID: {process.id}, Lab Test Request: {process.labTest}')
#         except AttendanceProcess.DoesNotExist:
#             print('No AttendanceProcess found for the given lab test request.')

# ''''
# We go through LabTestRequestPanel and group them by specimen name
# We then create or get a PatientSample for each group
# We then assign the sample to each panel in the group
# '''
# @receiver(post_save, sender=LabTestRequestPanel)
# def group_panels_with_specimen(sender, instance, created, **kwargs):
#         if created:
#             sample, created = PatientSample.objects.get_or_create(
#                 specimen=instance.test_panel.specimen,
#                 process_test_request=instance.lab_test_request.process,                
#             )
            
#             instance.sample = sample
#             sample.specimen_name = instance.test_panel.specimen.name
#             sample.lab_test_request=instance.lab_test_request
#             sample.save()
#             instance.save()

#         else:
#             if instance.result:
#                 try:
#                     similar_panels_by_sample = LabTestRequestPanel.objects.filter(sample=instance.sample)
#                     all_have_results = True
#                     for panel in similar_panels_by_sample:
#                         # pdb.set_trace()
#                         if not panel.result:
#                             all_have_results = False
#                             break
                    
#                     if all_have_results:
#                         instance.sample.has_results = True
#                         instance.sample.save()
#                 except Exception as e:
#                     # Log the error or handle it as needed
#                     print(f"An error occurred: {e}")


# @receiver(post_save, sender=LabTestRequestPanel)
# def confirm_lab_req_has_full_results(sender, instance, **kwargs):
#     if instance.result:
#         try:
#             test_simililar_samples = PatientSample.objects.filter(test_req=instance.test_req)
#             # pdb.set_trace()
#             all_have_results = True
#             for sample in test_simililar_samples:
#                 pdb.set_trace()
#                 if not sample.has_results:
#                     all_have_results = False
#                     break
            
#             if all_have_results:
#                 instance.test_req.has_result = True
#                 instance.test_req.save()
#         except Exception as e:
#             # Log the error or handle it as needed
#             print(f"An error occurred: {e}")


