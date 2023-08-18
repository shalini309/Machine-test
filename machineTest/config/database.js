const mongoose = require('mongoose');
require('dotenv').config();
let uri;
module.exports = () => {
        uri = 'mongodb://localhost:27017/machine-test';
        mongoose.connect(uri, {})
            .then(result => console.log('Database connected successfully ===', uri))
            .catch(err => console.log(err));
}