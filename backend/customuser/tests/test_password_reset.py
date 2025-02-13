import pytest
from django.core import mail    
from django.urls import reverse

from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth import get_user_model  # Get your User model


from customuser.models import PasswordHistory

User = get_user_model()

@pytest.mark.django_db
def test_password_reset_request(authenticated_client, user):
    url = reverse('customuser:password_reset_request')  # Adjust with your actual URL name
    response = authenticated_client.post(url, {'email': user.email}, format='json')

    assert response.status_code == 200
    assert response.data['message'] == "Password reset link sent to email."
    assert len(mail.outbox) == 1
    assert user.email in mail.outbox[0].to


@pytest.mark.django_db
def test_password_reset_confirm(authenticated_client, user): # Use client, not authenticated_client for password reset
    """Test password reset confirmation and prevent reusing recent passwords"""

    old_passwords = ["OldPassword1!", "OldPassword2!", "OldPassword3!", "OldPassword4!", "OldPassword5!"]
    for old_password in old_passwords:
        user.set_password(old_password)
        user.save()
        PasswordHistory.objects.create(user=user, password_hash=user.password)

    token = PasswordResetTokenGenerator().make_token(user)
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    url = reverse('customuser:password_reset_confirm', kwargs={'uidb64': uidb64, 'token': token})

    reuse_password = old_passwords[-1]
    response = authenticated_client.post(url, {
        'new_password': reuse_password,
        'confirm_password': reuse_password
    }, format='json')

    assert response.status_code == 400
    assert "Cannot reuse a recent password." in str(response.data['error'])

    new_password = "NewSecurePass456!"
    response = authenticated_client.post(url, {
        'new_password': new_password,
        'confirm_password': new_password
    }, format='json')

    user.refresh_from_db()  

    assert response.status_code == 200
    assert response.data['message'] == "Password has been reset successfully"
    assert check_password(new_password, user.password)
    assert PasswordHistory.objects.filter(user=user, password_hash=user.password).exists()
    assert PasswordHistory.objects.count() == 6

