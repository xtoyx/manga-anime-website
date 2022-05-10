const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dtmxniopg',
    api_key: '868656448336619',
    api_secret: 'LqeZ13d_tHAGh7ELPi194JBI9jA'
});

module.exports = { cloudinary };