const express=require('express')

const route=express.Router();
const index=require('./multerConfig')
const multer=require('multer')


const validationRouter=require('../controllers/validationController')

const appointmentRouter=require('../controllers/appointmentController')


//Middlewares of the multer to store the images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename for the uploaded file
    }
  });
  
  // Create the Multer instance
  const upload = multer({ storage: storage });
  
  module.exports = upload;
  

// route.get('/',validationRouter.index)
route.post('/signIn',validationRouter.signIn)
route.post('/signUp',upload.single('uploadFile'),validationRouter.signUp)
route.post('/resetPassword',validationRouter.resetPassword)
route.post('/verifyOTP',validationRouter.verifyOTP)
route.post('/newPassword',validationRouter.newPassword)
route.post('/dashboardData',validationRouter.dashboardData)
route.get('/doctorData',validationRouter.doctorData)
route.post('/availability',validationRouter.DoctorAvailability)
route.post('/timeSlotData',validationRouter.timeSlotData)
route.post('/bookAppointment',appointmentRouter.newAppointment)
route.post('/newAppointmentData',appointmentRouter.appointmentData)
route.post('/confirmAppointment',appointmentRouter.confirmAppointment)
module.exports=route