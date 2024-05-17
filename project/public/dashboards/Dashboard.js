document.addEventListener('DOMContentLoaded', () => {
    const userProfile = document.querySelector('.userProfile');
    const closeButton = document.getElementById('closeButton');
    const completeProfile = document.getElementById('completeProfile');
    const contentColumn = document.getElementById('contentColumn');
    const profileLogo = document.querySelector('#logo');
    const startUpPage = document.querySelector('.startUpPage');


    /********************************All Dashboard Data Load Dynamically*****************************************/

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Get the email and password parameters from the URL
    const email = getUrlParameter('email');
    const password = getUrlParameter('password');

    function loadDashboardDOM(Email, Name, Gender,Role,Image) {
        //console.log(Image);
        // Accessing elements within the profilePicture div
        const profilePictureDiv = document.querySelector('.profilePicture');
        const profilePicture = document.querySelector('.pictureBorder');
        const imagePortion = profilePicture.querySelector('img');
        const paragraphElement = profilePictureDiv.querySelector('p');
        const headingElement = profilePictureDiv.querySelector('h6');
        const name=document.getElementById("name")
        const email=document.getElementById("email")
        const gender=document.getElementById("gender")
        const role=document.getElementById("role")

        
        // Replace backslashes with forward slashes in the image path
        //const imageDir = "../../" + Image.replace(/\\/g, '/');
        const imageDir = "C:/Users/Ali Haider/Desktop/Web Development/project/"+ Image.replace(/\\/g, '/');
        console.log("ImageDir", imageDir);

        // Update the image source to include the correct relative path
        imagePortion.src =imageDir; // Assuming 'Image' contains the file name (e.g., 'amir.PNG')
        
        // Set image height and width
        imagePortion.height = "40px";
        imagePortion.width = "40px";
    
        alert(Role)
        // Set paragraph and heading content
        paragraphElement.textContent = Email;
        headingElement.textContent = Name;
        name.textContent=Name
        email.textContent=Email
        gender.textContent=Gender
        role.textContent=Role
    }
    



    //Function to load the data
    async function loadData(Email, Password) {
        try {
            const response = await fetch('/dashboardData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Email, Password })
            });

            const data = await response.json();

            if (data.success === true) {
                console.log(data.Image);
                // Navigate to the patient dashboard page
                loadDashboardDOM(data.Email,data.Name,data.Gender,data.Role,data.Image)
                
            } else {
                alert('Not exist');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            // Handle error here
        }
    }

    //call the load data function
    loadData(email, password);

  



    // Hide the profile
    closeButton.addEventListener('click', () => {
        userProfile.style.display = 'none';
        contentColumn.classList.remove('col-lg-7');
        contentColumn.classList.add('col-lg-10');
        profileLogo.style.display = 'block';
    });

    // Show the profile again
    profileLogo.addEventListener('click', () => {
        userProfile.style.display = 'block';
        contentColumn.classList.remove('col-lg-10');
        contentColumn.classList.add('col-lg-7');
        profileLogo.style.display = 'none';
    });

    // Show the different contents by pressing the buttons
    const Dashboard = document.getElementById('Dashboard');
    const Doctor = document.getElementById('Doctor');
    const History = document.getElementById('History');
    const Help = document.getElementById('Help');

    const Dashboard1 = document.getElementById('Dashboard1');
    const Doctor1 = document.getElementById('Doctor1');
    const History1 = document.getElementById('History1');
    const Help1 = document.getElementById('Help1');

    Dashboard1.addEventListener('click', () => {
        Dashboard.style.display = 'block';
        Doctor.style.display = 'none';
        History.style.display = 'none';
        Help.style.display = 'none';
        startUpPage.style.display="none";
    });

    Doctor1.addEventListener('click', () => {
        Dashboard.style.display = 'none';
        Doctor.style.display = 'block';
        History.style.display = 'none';
        Help.style.display = 'none';
        startUpPage.style.display="none";
    });

    History1.addEventListener('click', () => {
        Dashboard.style.display = 'none';
        Doctor.style.display = 'none';
        History.style.display = 'block';
        Help.style.display = 'none';
        startUpPage.style.display="none";
    });

    Help1.addEventListener('click', () => {
        Dashboard.style.display = 'none';
        Doctor.style.display = 'none';
        History.style.display = 'none';
        Help.style.display = 'block';
        startUpPage.style.display="none";
    });
});
