from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LabReagentViewSet,
    LabTestResultViewSet,
    LabTestRequestViewSet,
    # LabTestCategoryViewSet,
    LabTestProfileViewSet,
    LabEquipmentViewSet,
    EquipmentTestRequestViewSet,
    PublicLabTestRequestViewSet,
    LabTestProfileViewSet,
    LabTestRequestByPatientIdAPIView,
    LabTestPanelViewSet,
    LabTestResultPanelViewSet,
    LabTestRequestPanelViewSet,
    LabTestResultPanelByLabTestResultId,
    QualitativeLabTestResultPanelByLabTestResultId,
    LabTestRequestPanelByLabTestRequestId,
    download_labtestresult_pdf,
    download_qualitative_labtestresult_pdf, 
    LabTestResultPanelQualitativeViewSet,
    LabTestResultQualitativeViewSet,
    ResultsVerificationViewSet,
    QualitativeResultsVerificationViewSet
)

router = DefaultRouter()
router.register(r'lab-reagents', LabReagentViewSet)

router.register(r'lab-test-profile', LabTestProfileViewSet)
router.register(r'lab-test-panel', LabTestPanelViewSet)


router.register(r'lab-test-results', LabTestResultViewSet)
router.register(r'lab-test-results-panel', LabTestResultPanelViewSet)

router.register(r'lab-test-results-qualitative', LabTestResultQualitativeViewSet)
router.register(r'lab-test-results-panel-qualitative', LabTestResultPanelQualitativeViewSet)

router.register(r'lab-test-requests', LabTestRequestViewSet)
router.register(r'lab-test-requests-panel', LabTestRequestPanelViewSet)

# router.register(r'lab-test-categories', LabTestCategoryViewSet)
router.register(r'lab-equipment', LabEquipmentViewSet)
router.register(r'equipment-test-request', EquipmentTestRequestViewSet)
router.register(r'public-lab-test-request', PublicLabTestRequestViewSet)

router.register(r'approve-results', ResultsVerificationViewSet)
router.register(r'approve-qualitative-results', QualitativeResultsVerificationViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('lab-test-request-by-patient-id/<int:patient_id>/', LabTestRequestByPatientIdAPIView.as_view()),
    path('lab-test-result-panels-by-lab-test-result-id/<int:lab_test_result_id>/', LabTestResultPanelByLabTestResultId.as_view(), name='lab-test-result-panels'),
    path('qualitative-lab-test-result-panels-by-lab-test-result-id/<int:lab_test_result_id>/', QualitativeLabTestResultPanelByLabTestResultId.as_view(), name='qualitative-lab-test-result-panels'),
    path('lab-test-request-panels-by-lab-test-request-id/<int:lab_test_request_id>/', LabTestRequestPanelByLabTestRequestId.as_view(), name='lab-test-request-panels'),

    path('download_qualitative_labtestresult_pdf/<int:labtestresult_id>/', download_qualitative_labtestresult_pdf, name='download_qualitative_labtestresult_pdf'),

    path('download_labtestresult_pdf/<int:labtestresult_id>/', download_labtestresult_pdf, name='download_labtestresult_pdf'),

    path('labtestpanels-byprofile-id/<int:profile_id>/', LabTestPanelViewSet.as_view({'get': 'by_test_profile'}), name='labtestpanels-byprofile-id'),
]

