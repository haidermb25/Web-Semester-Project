
const multer=require('multer')
//Middlewares of the multer to store the images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/dashboards/uploads/'); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename for the uploaded file
    }
  });
  
  // Create the Multer instance
  const upload = multer({ storage: storage });
  
  module.exports = upload;
  