document.addEventListener('DOMContentLoaded', () => {
    // Get the radio button element
    var radioButton = document.getElementById('doctorCheckbox');

    // Get the modal element
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));

    // Add event listener for the change event on the radio button
    radioButton.addEventListener('change', function(event) {
        if (event.target.checked) {
            // Open the modal when the radio button is checked
            modal.show();
        }
    });

    document.querySelector('.frmData').addEventListener('submit', function(event) {
        // Get the modal input values
        var specialization = document.getElementById('specialization').value;
        var experience = document.getElementById('experience').value;
        var qualifications = document.getElementById('qualifications').value;
        var insurance = document.getElementById('insurance').value;

        // Append modal data to form data
        var formData = new FormData(this);
        formData.append('Specialization', specialization);
        formData.append('Experience', experience);
        formData.append('Qualifications', qualifications);
        formData.append('Insurance', insurance);

        // Perform any additional processing if needed

        // Optionally, you can log the formData to see its content
        console.log([...formData.entries()]);

        // Submit the form with updated formData using fetch
        fetch('/signUp', {
            method: 'POST',
            body: formData
        }).then(response => {
            // Handle the response
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to submit form data');
            }
        }).then(data => {
            // Handle successful response
            console.log(data);
            // You can perform any further actions here, such as showing a success message
        }).catch(error => {
            // Handle errors
            console.error('Error:', error);
            // You can display an error message to the user or perform other actions
        });

        // Prevent the default form submission behavior
        event.preventDefault();
    });

    document.getElementById('saveChangesBtn').addEventListener('click', function() {
        // Save the data here, you can use AJAX to send it to the server
        modal.hide();
    });
});
