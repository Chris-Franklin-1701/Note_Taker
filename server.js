const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);



// GET request for Notes
app.get('/api/notes', (req, res) => {
  // Send a message to the client
    //res.status(200).json(`${req.method} request received to get reviews`);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        res.status(201).json(parsedNotes);
    }
  // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
    });
});

// POST request to add a Note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

  // If all the required properties are present
    if (title && text) {
    // Variable for the object we will save
    const newNote = {
        title,
        text,
        id: uuid(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
            writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
        );
        }
    });

    const response = {
        status: 'success',
        body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
    } else {
    res.status(500).json('Error in posting review');
    }
});

app.delete('/api/notes:id', (req, res) =>{
   // Log that a DELETE request was received
    console.info(`${req.method} request received to delete a note`);

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);
    
            // Delete a new note
            const id = parsedNotes.findIndex(({id}) => id === req.params.id);
            if (id >= 0) {
                parsedNotes.splice(id, 1);
            }
            // Write updated notes back to the file
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully deleted note!')
            );
            }
        });

        //res.status(201).json(parsedNotes);
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} ????`)
);
