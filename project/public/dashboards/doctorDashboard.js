document.addEventListener('DOMContentLoaded', async () => {
    // Select the button with the class "timeSlot"
    const timeSlotButton = document.querySelector('.timeSlot');
    
    
    
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }


    const doctorEmail = getUrlParameter('email');

    // Add event listener to the button
    timeSlotButton.addEventListener('click', async () => {
        // Retrieve the values of time and day inputs
        const startTime = document.querySelector('#startTime').value;
        const endTime = document.querySelector('#endTime').value;
        const dayValue = document.querySelector('#dayInput').value;

        try {
            const availability = await fetch('/availability', {
                method: 'POST',
                body: JSON.stringify({ startTime,endTime,dayValue,doctorEmail }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!availability.ok) {
                throw new Error('Failed to update time slot');
            }

            const data = await availability.json();
            if (data.success === true) {
                alert("Time slot updated successfully!");
                updateTimeSlot()
            }
            if(data.exists===true){
                alert('Time slot not exist! There is some clash')
            }
        } catch (error) {
            console.error('Error updating time slot:', error);
            // Handle error (e.g., display error message to user)
        }
    });

    //Show time slot in the table
    function showTimeSlot(timeSlots,Email) {
        const tableBody = document.querySelector('.timeSlotTable tbody');
        if (tableBody) {
            // Clear existing rows
            tableBody.innerHTML = '';
    
            // Populate table with time slot data
            timeSlots.forEach(timeSlot => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${Email}</td>
                    <td>${timeSlot.startTime}</td>
                    <td>${timeSlot.endTime}</td>
                    <td>${timeSlot.day}</td>
                    <td><i class="fas fa-edit"></i></td>
                    <td><i class="fas fa-trash-alt"></i></td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.log("Time slot table body not found");
        }
    }
     

    updateTimeSlot();
    //Here after addition of new time slot we call the function of showTimeSlot
    async function updateTimeSlot(){
        
        try {
            const availability = await fetch('/timeSlotData', {
                method: 'POST',
                body: JSON.stringify({Email:doctorEmail}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await availability.json();
            if (data.success === true) {
                showTimeSlot(data.timeSlots,data.Email)
            }
            if(data.exists===true){
                alert('Time slot not exist! There is some clash')
            }
        } catch (error) {
            console.error('Error updating time slot:', error);
            // Handle error (e.g., display error message to user)
        }
    }


    //Here we show the data in table
    async function showData(){
        const tableBody = document.querySelector('.appointmentRecord tbody');
        if (tableBody) {
            // Clear existing rows
            tableBody.innerHTML = '';
    
            // Populate table with time slot data
            timeSlots.forEach(timeSlot => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${Email}</td>
                    <td>${timeSlot.startTime}</td>
                    <td>${timeSlot.endTime}</td>
                    <td>${timeSlot.day}</td>
                    <td><i class="fas fa-edit"></i></td>
                    <td><i class="fas fa-trash-alt"></i></td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.log("Time slot table body not found");
        }
    }


    //Show the new appointments in the table
    async function appointmentTable(data){
        const tableBody = document.querySelector('.appointmentRecord tbody');
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
                    <td><input type="checkbox"></td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.log("Time slot table body not found");
        }
    }

    //Here we get all the data from the database
    async function newAppointmentDataShow() {
        try {
          const response = await fetch('/newAppointmentData', {
            method: 'POST',
            body: JSON.stringify({ Email: doctorEmail,status:"scheduled" }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          const data = await response.json();
      
          if (data.success) {
                appointmentTable(data.allData)
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
      

    newAppointmentDataShow()


    //Do the appointment Done
    const saveButton = document.querySelector(".saveButton");
saveButton.addEventListener('click', async() => {
  const tableBody = document.querySelector('.appointmentRecord tbody');
  const checkedRows = [];

  // Traverse the table rows
  for (let i = tableBody.rows.length - 1; i >= 0; i--) {
    const row = tableBody.rows[i];
    const checkbox = row.cells[3].querySelector('input[type="checkbox"]'); // Assuming the checkbox is in the 4th column (index 3)

    // Check if the checkbox is checked
    if (checkbox && checkbox.checked) {
      // Create an object to store the data for the checked row
      const rowData = {
        // Add the data from each column to the rowData object
        column1: row.cells[0].textContent,
        column2: row.cells[1].textContent,
        column3: row.cells[2].textContent,
        column4: checkbox.checked
      };

      // Add the rowData object to the checkedRows array
      checkedRows.push(rowData);

      // Delete the row from the table
      tableBody.deleteRow(i);
    }
  }

  // Traverse the checkedRows array and make a fetch call
  checkedRows.forEach(rowData => {
    console.log(rowData.column1)
    fetch('/confirmAppointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({patientEmail:rowData.column1,doctorEmail:rowData.column2,time:rowData.column3})
    })
    .then(response => {
      console.log('Response from server:', response.status);
      completedAppointment()
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
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
          body: JSON.stringify({ Email: doctorEmail,status:"completed" }),
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