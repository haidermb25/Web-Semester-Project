document.addEventListener('DOMContentLoaded',()=>{
    const loginButton=document.querySelector('.login')
    loginButton.addEventListener('click',async (event)=>{
        event.preventDefault()

        const Email = document.getElementById('email').value;
        const Password = document.getElementById('password').value;
        
        const response = await fetch('/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Email, Password })
        });

        const data=await response.json()

        if(data.success==true){
            if(data.Role=="Patient"){
            // Navigate to the patient dashboard page
            window.location.href = `dashboards/patientDashboard.html?email=${data.Email}&password=${data.Password}`;
            }else{
            window.location.href = `dashboards/doctorDashboard.html?email=${data.Email}&password=${data.Password}`;
           
            }
        }
        else{
            alert('Not exist')
        }

    })
})