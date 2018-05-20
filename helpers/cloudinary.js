const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: 'fixter',
    api_key: '553386282442424',
    api_secret: 'G_-L-BNormAfGcl_gjT1gslWyhY'
});

var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'concamin',
  allowedFormats: ['jpg', 'png', 'pdf'],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploadCloud = multer({ storage: storage });
module.exports = uploadCloud;