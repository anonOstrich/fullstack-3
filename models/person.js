const mongoose = require('mongoose'); 
const url = process.env.MONGODB_URI; 

mongoose.connect(url, { useNewUrlParser: true })
.then(response => {
    console.log('connected to the MongoDB database');
}).catch(error => {
    console.log('connection to the db failed', error.message)
})

const personSchema = new mongoose.Schema({
    name: String, 
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, recObject) => {
        recObject.id = recObject._id.toString(); 
        delete recObject._id; 
        delete recObject.__v;
    }
})

module.exports = mongoose.model('Person', personSchema); 


