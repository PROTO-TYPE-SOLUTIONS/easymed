from django.shortcuts import render

from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from io import BytesIO
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from django.conf import settings
from pathlib import Path

from billing.models import InvoiceItem
from company.models import Company


''''
sample request
curl -X POST http://localhost:8080/reports/sale_by_date   -H "Content-Type: application/json"   -d '{"start_date": "2024-02-01", "end_date": "2024-02-18"}'

'''
BASE_DIR = Path(__file__).resolve().parent.parent

@csrf_exempt
def get_invoice_items_by_date_range(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            start_date_str = data.get('start_date')
            end_date_str = data.get('end_date')

            if start_date_str and end_date_str:
                start_date = timezone.datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = timezone.datetime.strptime(end_date_str, '%Y-%m-%d')
                invoice_items = InvoiceItem.objects.filter(item_created_at__range=(start_date, end_date))

                serialized_invoice_items = [
                    {
                        'invoice_id': item.invoice.id,
                        'item_id': item.item.id,
                        'item_created_at': item.item_created_at,
                        'payment_mode_id': item.payment_mode.id if item.payment_mode else None
                    }
                    for item in invoice_items
                ]
                html_string = render_to_string('sales_by_date.html', {'invoice_items': serialized_invoice_items})
                pdf_file = HTML(string=html_string).write_pdf()
                pdf_directory = os.path.join(BASE_DIR, 'makeeasyhmis/static', 'reports')
                os.makedirs(pdf_directory, exist_ok=True)
                pdf_file_name = 'invoice_items.pdf'
                pdf_file_path = os.path.join(pdf_directory, pdf_file_name)
                with open(pdf_file_path, 'wb') as f:
                    f.write(pdf_file)
                return JsonResponse({'pdf_file_path': pdf_file_path})
            else:
                return JsonResponse({'error': 'Invalid date format or missing date data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def serve_generated_pdf(request):
    # Path to the generated PDF file
    pdf_file_name = 'invoice_items.pdf'
    pdf_directory = os.path.join(BASE_DIR, 'makeeasyhmis/static', 'reports')
    pdf_file_path = os.path.join(pdf_directory, pdf_file_name)

    # Check if the PDF file exists
    if os.path.exists(pdf_file_path):
        with open(pdf_file_path, 'rb') as f:
            pdf_content = f.read()

        # Prepare the response with PDF content
        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="generated_pdf.pdf"'
        return response
    else:
        return HttpResponse('PDF file not found', status=404)
    

@csrf_exempt
def get_invoice_items_by_item_and_date_range(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            start_date_str = data.get('start_date')
            end_date_str = data.get('end_date')

            if item_id and start_date_str and end_date_str:
                start_date = timezone.datetime.strptime(start_date_str, '%Y-%m-%d')
                end_date = timezone.datetime.strptime(end_date_str, '%Y-%m-%d')
                invoice_items = InvoiceItem.objects.filter(item_id=item_id, item_created_at__range=(start_date, end_date))

                company = Company.objects.first()

                # Prepare the data for the template
                context = {
                    'invoice_items': invoice_items,
                    'company_name': company.name if company else None
                }

                html_string = render_to_string('sales_by_item_id.html', context)
                pdf_file = HTML(string=html_string).write_pdf()
                pdf_directory = os.path.join(BASE_DIR, 'makeeasyhmis/static', 'reports')
                os.makedirs(pdf_directory, exist_ok=True)
                pdf_file_name = 'sales_by_item_id.pdf'
                pdf_file_path = os.path.join(pdf_directory, pdf_file_name)
                with open(pdf_file_path, 'wb') as f:
                    f.write(pdf_file)
                return JsonResponse({'pdf_file_path': pdf_file_path})
            else:
                return JsonResponse({'error': 'Invalid data or missing data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


from django.http import FileResponse

def serve_sales_by_item_id_pdf(request):
    pdf_file_name = 'sales_by_item_id.pdf'
    pdf_directory = os.path.join(BASE_DIR, 'makeeasyhmis/static', 'reports')
    pdf_file_path = os.path.join(pdf_directory, pdf_file_name)

    if os.path.exists(pdf_file_path):
        response = FileResponse(open(pdf_file_path, 'rb'), content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="sales_by_item_id.pdf"'
        return response
    else:
        return HttpResponse('PDF file not found', status=404)

# @csrf_exempt
# def get_invoice_items_by_item_and_date_range(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             item_id = data.get('item_id')
#             start_date_str = data.get('start_date')
#             end_date_str = data.get('end_date')

#             if item_id and start_date_str and end_date_str:
#                 start_date = timezone.datetime.strptime(start_date_str, '%Y-%m-%d')
#                 end_date = timezone.datetime.strptime(end_date_str, '%Y-%m-%d')
#                 invoice_items = InvoiceItem.objects.filter(item_id=item_id, item_created_at__range=(start_date, end_date))

#                 serialized_invoice_items = [
#                     {
#                         'invoice_id': item.invoice.id,
#                         'item_id': item.item.id,
#                         'item_created_at': item.item_created_at,
#                         'payment_mode_id': item.payment_mode.id if item.payment_mode else None
#                     }
#                     for item in invoice_items
#                 ]
#                 html_string = render_to_string('sales_by_date.html', {'invoice_items': serialized_invoice_items})
#                 pdf_file = HTML(string=html_string).write_pdf()
#                 pdf_directory = os.path.join(BASE_DIR, 'makeeasyhmis/static', 'reports')
#                 os.makedirs(pdf_directory, exist_ok=True)
#                 pdf_file_name = 'invoice_items.pdf'
#                 pdf_file_path = os.path.join(pdf_directory, pdf_file_name)
#                 with open(pdf_file_path, 'wb') as f:
#                     f.write(pdf_file)
#                 return JsonResponse({'pdf_file_path': pdf_file_path})
#             else:
#                 return JsonResponse({'error': 'Invalid data or missing data'}, status=400)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request method'}, status=405)
    