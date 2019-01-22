const express = require('express'); 
const bodyParser = require('body-parser'); 
const app = express(); 
app.use(bodyParser.json());


let notes = [
    {
    id: 1, 
    name: "Arto Hellas", 
    number: "045-1236543"
    }, 

    {
        id: 2, 
        name: "Arto Järvinen", 
        number: "041-21423123"
    }, 
    {
        id: 3, 
        name: "Lea Kutvonen", 
        number: "040-4323234"
    }, 
    {
        id: 4, 
        name: "Martti Tienari", 
        number: "09-784232"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(notes);  
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id); 
    const note = notes.find(p => p.id === id); 
    if(!note){
        return response.status(404).end(); 
    }
    return response.json(note); 
})

app.get("/info", (request, response) => {
    response.send(`<p>Puhelinluettelossa ${notes.length} henkilön tiedot</p>` + 
    `<p>${new Date()}</p>`); 
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);  
    notes = notes.filter( n => n.id !== id); 
    response.status(204).end(); 
})




const PORT = 3001; 
app.listen(PORT, () => {
    console.log(`Listeting to port number ${PORT}`)
}); 