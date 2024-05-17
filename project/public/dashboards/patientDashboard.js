document.addEventListener('DOMContentLoaded', async () => {




    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }


    const patientEmail = getUrlParameter('email');



    // Here we show the doctor info
    function showDoctorInfo(doctors) {
        const tableBody = document.querySelector('.doctorTable tbody');
        if (tableBody) {
            // Clear existing rows
            tableBody.innerHTML = '';

            // Populate table with doctor data
            doctors.forEach(doctor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doctor.Name}</td>
                    <td>${doctor.Email}</td>
                    <td>${doctor.Gender}</td>
                    <td>${doctor.Experience}</td>
                    <td><i class="fas fa-info-circle"></i></td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.log("Doctor table body not found");
        }
    }




// Here we show the doctor in the option of the doctors
const doctorOptions = async (doctors) => {
    // Access the select element by its class name
    const doctorSelect = document.querySelector('.doctor-select');

    // Clear existing options
    doctorSelect.innerHTML = "";

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a doctor';
    doctorSelect.add(defaultOption);

    // Add options for each doctor
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.text = doctor.Name; // Assuming doctor object has a 'name' property
        option.value = doctor.Email; // Assuming doctor object has an 'email' property
        doctorSelect.add(option);
    });

    // Here we change the time table of the doctor
    doctorSelect.addEventListener('change', async () => {
        var email = doctorSelect.value;
        alert(email);
        try {
            const availability = await fetch('/timeSlotData', {
                method: 'POST',
                body: JSON.stringify({ Email: email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await availability.json();
            if (data.success === true) {
                const timeSelect = document.querySelector('.time-select');

                // Clear existing options
                timeSelect.innerHTML = "";

                // Add a default option
                const defaultOption = document.createElement('option');
                defaultOption.text = 'Select a time slot';
                timeSelect.add(defaultOption);

                // Add options for each time slot
                data.timeSlots.forEach(slot => {
                    const option = document.createElement('option');
                    option.text = slot.startTime + " " + slot.endTime + " " + slot.day; // Assuming time slot object has relevant properties
                    timeSelect.add(option);
                });
            }
            if (data.exists === true) {
                alert('Time slot not exist! There is some clash');
            }
        } catch (error) {
            console.error('Error updating time slot:', error);
            // Handle error (e.g., display error message to user)
        }
    });
};





    // Here we fetch the doctor data
    const fetchDoctorData = async () => {
        try {
            const response = await fetch('/doctorData', {
                method: 'GET'
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    alert("Doctor data has been successfully retrieved");
                    showDoctorInfo(result.doctors);
                    doctorOptions(result.doctors)
                } else {
                    throw new Error('Failed to retrieve doctor data');
                }
            } else {
                throw new Error('Failed to fetch doctor data');
            }
        } catch (error) {
            console.error('Error:', error);
            // You can handle errors here, such as displaying an error message to the user
        }
    }



    fetchDoctorData();


const buttons = document.getElementById('newAppointment');
const doctorSelect = document.querySelector('.doctor-select');
const timeSelect = document.querySelector('.time-select');

buttons.addEventListener('click', async () => {
  const selectedDoctor = doctorSelect.value;
  const selectedTime = timeSelect.value;
  try {
    // Send the selected doctor and time to the server
    const response = await fetch('/bookAppointment', {
      method: 'POST',
      body: JSON.stringify({ doctorEmail: selectedDoctor,patientEmail:patientEmail, time: selectedTime }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (result.success==true) {
      // Appointment booked successfully
      alert('Appointment booked successfully');
    }
    else if(result.exist==true){
      alert('Appointment booked Already');
    }
     else {
      // Handle error
      alert('Error booking appointment');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});



//Here we show the completed appointments
function completedAppointmentTable(data){
    const tableBody = document.querySelector('.completedAppointment tbody');
    if (tableBody) {
        // Clear existing rows
        tableBody.innerHTML = '';

        // Populate table with time slot data
        data.forEach(value => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${value.patientEmail}</td>
                <td>${value.doctorEmail}</td>
                <td>${value.time}</td>
                <td><i class="fas fa-info-circle"></i></td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.log("Time slot table body not found");
    }
 }

 async function completedAppointment(){
    try {
        const response = await fetch('/newAppointmentData', {
          method: 'POST',
          body: JSON.stringify({ Email: patientEmail,status:"completed" }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        const data = await response.json();
    
        if (data.success) {
              completedAppointmentTable(data.allData)
        } else {
          console.error('Error retrieving new appointment data:', data.error);
          // Display an error message to the user
          alert('Error retrieving new appointment data. Please try again later.');
        }
      } catch (error) {
        console.error('Error updating time slot:', error);
        // Display a generic error message to the user
        alert('An error occurred. Please try again later.');
      }
 }

completedAppointment()



});
