const Appointment = require('../model/appointmentModel');

async function newAppointment(req, res, next) {
  try {
    // Extract doctorEmail, patientEmail, and time from the request body
    const { doctorEmail, patientEmail, time } = req.body;

    // Check if there is an existing appointment at the given time
    const existingAppointment = await Appointment.findOne({
      doctorEmail: doctorEmail,
      time: time,
    });

    if (existingAppointment) {
      // If there is an existing appointment, send a response with 'exist: true'
      return res.status(400).json({ success: false, exist: true });
    }

    // Create a new appointment instance
    const appointment = new Appointment({
      doctorEmail: doctorEmail,
      patientEmail: patientEmail,
      time: time,
    });

    // Save the appointment to the database
    const savedAppointment = await appointment.save();

    // Send a success response with the saved appointment
    res.status(201).json({ success: true, appointment: savedAppointment });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
}



//Get all the appointment according to the given doctor
async function appointmentData(req,res,next){
    const email=req.body.Email
    const givenStatus=req.body.status
    console.log(email)
    try{
        const result=await Appointment.find({doctorEmail:email,status:givenStatus})
        if(result){
          res.status(200).send({success:true,allData:result})
        }
        else{
          res.status(401).send({success:true})
        }
      }
    catch(error){
        next(error)
    } 
}


//Confirm the appointment
async function confirmAppointment(req, res, next) {
  try {
      const patientEmail=req.body.patientEmail
    const {doctorEmail, time } = req.body;
      console.log(patientEmail, doctorEmail, time )
    // Update the appointment status to "completed"
    const updatedAppointment = await Appointment.findOneAndUpdate(
      {
        patientEmail,
        doctorEmail,
        time
      },
      {
        $set: {
          status: 'completed'
        }
      },
      {
        new: true // Return the updated document
      }
    );
    
    console.log(updatedAppointment)
    if (updatedAppointment) {
      res.status(200).json({ success:true });
    } else {
      res.status(404).json({ success:false });
    }
  } catch (error) {
    next(error);
  }
}


module.exports = {
  newAppointment,appointmentData,confirmAppointment
};