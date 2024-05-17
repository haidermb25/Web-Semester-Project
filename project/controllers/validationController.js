const { response } = require('express')
const validation=require('../model/validationModel')
var nodemailer = require('nodemailer');
const multer = require('multer');


//DECLARE THE VARIABLES

let verificationCode=0;

//show the list of all the patient

// const index=(req,res,next)=>{
//     validation.find().
//     then(response=>{
//         res.json({
//             response
//         })
//     })
//     .catch(error=>{
//         res.json({
//             message:'An error has been occured'
//         })
//     })
// }


//Here we make the function sign In the mongodb 
const signIn = async (req, res, next) => {
    const { Email, Password } = req.body;
    console.log(Email, Password); // Check if you're receiving the correct data

    try {
        // Find user by Name and password
        const user = await validation.findOne({ Email, Password });

        if (!user) {
            // If user not found, return error
            return res.status(401).json({ success: false, error: 'Invalid username or password' });
        }

        // Include the password in the response (not recommended, only for illustration)
        res.json({ success: true, Email: user.Email, Password: user.Password,Role:user.Role });
    } catch (error) {
        // Handle database query errors
        console.error('Error during sign-in:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

//Here we make the function sign Up for the mongodb
const signUp = (req, res, next) => {
    //console.log(req.body)
    let user;
    console.log("req.body: ");
    if(req.body.Role=="Patient")
    {
            user = new validation({
            Name: req.body.Name,
            Email: req.body.Email,
            Password: req.body.Password,
            ConfirmPassword: req.body.confirmPassword,
            Gender: req.body.Gender,
            Role: req.body.Role,
            Image: req.file.path // Use req.file.path to access the uploaded file path
        });
    }
    else
    {
            user = new validation({
            Name: req.body.Name,
            Email: req.body.Email,
            Password: req.body.Password,
            ConfirmPassword: req.body.confirmPassword,
            Gender: req.body.Gender,
            Role: req.body.Role,
            Image: req.file.path, // Use req.file.path to access the uploaded file path
            Specialization:req.body.Specialization,
            Experience:req.body.Experience,
            Qualifications:req.body.Qualifications,
            Insurance:req.body.Insurance
        });
    }

    user.save()
        .then(response => {
            res.json({
                message: 'Data Added successfully'
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};


//Here we make the function for reset the password according to the given email and username
const resetPassword = async (req, res, next) => {
    const { Name, Email } = req.body;

    try {
        const user = await validation.findOne({ Name, Email });

        if (user) {
            res.status(200).json({ success: true });

            // Generate a verification code (replace this with your own code)
            verificationCode = generateVerificationCode(6);

            // Send verification email asynchronously
            sendVerificationEmail(Email, verificationCode)
                .then(() => {console.log('Email sent successfully')
                              res.send({data:verificationCode})   })
                .catch(error => console.error('Failed to send email:', error));
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// Function to send verification email
async function sendVerificationEmail(email, verificationCode) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'f219192@cfd.nu.edu.pk',
            pass: 'haider@9192'
        }
    });

    const mailOptions = {
        from: 'f219192@cfd.nu.edu.pk',
        to: email,
        subject: 'Verification Code',
        text: 'Your verification code is: ' + verificationCode
    };

    await transporter.sendMail(mailOptions);
}

// Function to generate a random verification code
function generateVerificationCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters.charAt(randomIndex);
    }

    return verificationCode;
}



//Here we verify the OTP that it is correct

const verifyOTP=async (req,res,next)=>{
    const {otp}=req.body;
    if (otp==verificationCode){
        res.send({success:true})
    }
    else{
        res.send({success:false})
    }
}

//Here we update the password of the user
const newPassword = async (req, res, next) => {
    const { Name, Email, newPassword } = req.body;

    try {
        const user = await validation.findOne({ Name, Email });

        if (user) {
            user.Password = newPassword; // Update the password with the new value
            user.ConfirmPassword=newPassword;
            await user.save(); // Save the updated user object

            res.json({ success:true });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

/*Load the Dashboard Data*/

 const dashboardData=async (req,res,next)=>{
    const { Email, Password } = req.body;
    try {
        // Find user by Name and password
        const user = await validation.findOne({ Email, Password });

        if (!user) {
            // If user not found, return error
            return res.status(401).json({ success: false, error: 'Invalid username or password' });
        }

        // Include the password in the response (not recommended, only for illustration)
        res.json({ success: true, Email: user.Email, Password: user.Password, Name:user.Name, Role:user.Role, Gender:user.Gender,Image:user.Image});
    } catch (error) {
        // Handle database query errors
        console.error('Error during sign-in:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
 }

//Get the data of the doctor
async function doctorData(req, res) {
    const role = "Doctor"; // Define the role variable

    try {
        const doctors = await validation.find({ Role: role }); // Use the correct field name from the schema

        if (doctors.length > 0) {
            const doctorData = doctors.map(user => ({
                Email: user.Email,
                Password: user.Password,
                Name: user.Name,
                Role: user.Role,
                Gender: user.Gender,
                Image: user.Image,
                Specialization: user.Specialization,
                Experience: user.Experience,
                Qualifications: user.Qualifications,
                Insurance: user.Insurance
            }));

            res.send({ success: true, doctors: doctorData });
        } else {
            res.send({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message }); // Send an error response
    }
}


//Here we update the doctor availabilty
async function DoctorAvailability(req, res, next) {
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const day = req.body.dayValue;
    const email = req.body.doctorEmail;

    try {
        // Find the user by their email
        const user = await validation.findOne({ Email: email });

        if (!user) {
            return res.status(404).json({ success: false });
        }

        // Check for overlapping time slots
        const overlappingSlot = user.timeSlot.find(slot => {
            if (slot.day === day) {
                // Check if the new time slot starts or ends within an existing time slot
                return (
                    (startTime >= slot.startTime && startTime < slot.endTime) ||
                    (endTime > slot.startTime && endTime <= slot.endTime) ||
                    (startTime <= slot.startTime && endTime >= slot.endTime)
                );
            }
            return false;
        });

        if (overlappingSlot) {
            return res.status(200).json({ exists: true });
        }

        // Push the new time slot to the timeSlot array
        user.timeSlot.push({
            day: day,
            startTime: startTime,
            endTime: endTime
        });

        // Save the updated user document
        await user.save();

        res.status(200).json({ success: true});
    } catch (error) {
        console.error("Error adding time slot:", error);
        res.status(500).json({ success:false });
    }
}


//Here we return the time slot data
async function timeSlotData(req, res, next) {
    try {
        const userEmail = req.body.Email; // Assuming email is sent in the request body

        // Find the document based on the email
        const user = await validation.findOne({ Email: userEmail });

        // If user found, return the time slot array
        if (user) {
            const timeSlots = user.timeSlot;
            res.send({ success: true, timeSlots: timeSlots,Email:userEmail });
        } else {
            // If user not found, return an error response
            res.status(404).send({ success: false, message: "User not found." });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error fetching time slot:", error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}


//Here we export all the things

module.exports={
    signIn,signUp,resetPassword,verifyOTP,newPassword,dashboardData,doctorData,DoctorAvailability,timeSlotData
}