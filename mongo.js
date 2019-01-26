const mongoose = require('mongoose'); 

if(process.argv.length < 3){
    console.log("anna tietokannan salasana"); 
    process.exit(1); 
} else if(process.argv.length != 3 && process.argv.length != 5){
    console.log("argumentteja voi olla vain 1 tai 3"); 
    process.exit(1); 
}

const password = process.argv[2]; 
mongoose.connect(`mongodb://fullstack:${password}@ds161224.mlab.com:61224/contact-info`, 
{useNewUrlParser: true}); 

const personSchema = new mongoose.Schema({
    name: String, 
    number: String,
})

const Person = mongoose.model("Person", personSchema); 

if(process.argv.length == 5){
    const person = new Person({
        name: process.argv[3], 
        number: process.argv[4],
    })
    person.save().then(result => {
        console.log(`lisätään ${person.name} numero ${person.number} luetteloon`); 
        mongoose.connection.close(); 
    })  

} else {
    Person.find({}).then(result => {
        console.log('puhelinluettelo:')
        result.forEach(personInfo => {
            console.log(`${personInfo.name} ${personInfo.number}`); 
        })
        mongoose.connection.close(); 
    })

}

