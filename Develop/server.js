const express = require("express");
const pat = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid");

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`);
    res.status(200).json(`${req.method} request received to get notes`);
});

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };
    
        // Obtain existing reviews
        fs.readFile('./db/notes.json', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            } else {
            // Convert string into JSON object
            //const parsedNotes = JSON.parse(data);
    
            // Add a new review
            db.push(newNote);
    
            // Write updated reviews back to the file
            fs.writeFileSync(
                './db/notes.json',
                JSON.stringify(db, null, 4),
                (writeErr) =>
                writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
            );
           // db.push(parsedNotes);
            }
        });
    
        const response = {
            status: 'success',
            body: newNote,
        };
    
        console.log(response);
            res.status(201).json(response);
        } else {
            res.status(500).json('Error in posting note');
        }
    });
    




app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);