document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('.abc');

    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const Name = document.getElementById('Name').value;
        const Email = document.getElementById('Email').value;

        const response = await fetch('/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Email })
        });

        const data = await response.json();

        if (data.success) {
            let value = prompt("Enter the Email verification code");

            const otpResponse = await fetch('/verifyOTP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp: value })
            });

            const otpData = await otpResponse.json();

            if (otpData.success) {
                const newPassword = prompt("Enter the new password");
                const newPasswordResponse = await fetch('/newPassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Name, Email, newPassword })
                });

                const newPasswordData = await newPasswordResponse.json();

                if (newPasswordData.success) {
                    alert("Password successfully updated");
                } else {
                    alert("Failed to update password");
                }
            } else {
                alert("Wrong OTP code");
            }
        } else {
            alert("Username and Email do not exist in the database");
        }
    });
});
