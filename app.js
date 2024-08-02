const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eventmanagement_app'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


// Body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// Static files setup
app.use(express.static(path.join(__dirname, 'public')))

// View engine setup (assuming EJS)
app.set('view engine', 'ejs');

// Route to handle homepage or landing page
app.get('/', (req, res) => {
    connection.query('SELECT * FROM events', (error, events) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving events');
        }
        res.render('index', { events });
    });
});

// Route to render the event creation form
app.get('/addEvent', (req, res) => {
    res.render('addEvent');
});

// Route to handle event creation form submission
app.post('/addEvent', (req, res) => {
    const { name, date, venue, speakers, time, cost } = req.body;
    
    console.log('Body Object:', JSON.stringify(req.body));
    console.log('Name:', name);
    console.log('Date:', date);
    console.log('Venue:', venue);
    console.log('Speakers:', speakers);
    console.log('Time:', time);
    console.log('Cost:', cost);
    
    const sql = 'INSERT INTO events (name, speakers, venue, date, time, cost) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [name, speakers, venue, date, time, cost], (error, results) => {
        if (error) {
            console.error('Database insert error:', error.message);
            return res.status(500).send('Error creating event');
        }
        res.redirect('/');
    });
});

    // Route to render the ticket purchase form
    app.get('/addTicket', (req, res) => {
        res.render('addTicket');
    });

    // Route to handle ticket purchase form submission
    app.post('/addTicket', (req, res) => {
        const { ID, price, Availablity } = req.body;
        const query = 'INSERT INTO tickets (ID, price, Availablity) VALUES (?, ?, ?)';
        connection.query(query, [ID, price, Availablity], (error, results) => {
            if (error) {
                console.error('Database insert error:', error.message);
                return res.status(500).send('Error purchasing tickets');
            }
            res.redirect('/');
        });
    });

    // Route to render the ticket purchase form
    app.get('/addAttendee', (req, res) => {
        res.render('addAttendee');
    });

    // Route to handle attendee registration form submission
    app.post('/addAttendee', (req, res) => {
        const { name, email, phone, event_id } = req.body;
        const query = 'INSERT INTO attendees (name, email, phone, event_id) VALUES (?, ?, ?, ?)';
        connection.query(query, [name, email, phone, event_id], (error, results) => {
            if (error) {
                console.error('Database insert error:', error.message);
                return res.status(500).send('Error registering attendee');
            }
            res.send('Attendee registered successfully');
        });
    });

    // Route to render the ticket purchase form
    app.get('/editEvent/', (req, res) => {
        res.render('editEvent');
    });

    app.get('/editEvent/:id', (req, res) => {
        const eventId = req.params.id;
        connection.query('SELECT * FROM events WHERE id = ?', [eventId], (error, results) => {
            if (error) {
                console.error('Database query error:', error.message);
                return res.status(500).send('Error retrieving event');
            }
            if (results.length === 0) {
                return res.status(404).send('Event not found');
            }
            res.render('editEvent', { event: results[0] });
        });
    });

    // Route to handle event update form submission
app.post('/editEvent/:id', (req, res) => {
    const eventId = req.params.id;
    const { name, date, venue, speakers, time, cost } = req.body;
    const sql = 'UPDATE events SET name = ?, date = ?, venue = ?, speakers = ?, time = ?, cost = ? WHERE id = ?';
    connection.query(sql, [name, date, venue, speakers, time, cost, eventId], (error, results) => {
        if (error) {
            console.error('Database update error:', error.message);
            return res.status(500).send('Error updating event');
        }
        res.redirect('/');
    });
});

app.get('/deleteEvent/', (req, res) => {
    res.render('deleteEvent');
});

// Route to render the event deletion confirmation page
app.get('/deleteEvent/:ID', (req, res) => {
    const eventId = req.params.ID;

    // Query to fetch the event details based on the event ID
    const query = 'SELECT * FROM events WHERE ID = ?';
    connection.query(query, [eventId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving event details');
        }

        if (results.length === 0) {
            return res.status(404).send('Event not found');
        }

        // Render the delete confirmation page with the event details
        res.render('deleteEvent', { event: results[0] });
    });
});

// Route to handle event deletion
app.post('/deleteEvent/:ID', (req, res) => {
    const event_id = req.params.ID;

    const query = 'DELETE FROM events WHERE ID = ?';
    connection.query(query, [event_id], (error, results) => {
        if (error) {
            console.error('Database delete error:', error.message);
            return res.status(500).send('Error deleting event');
        }
        res.redirect('/');
    });
});

// Route to view all tickets
app.get('/viewTickets', (req, res) => {
    const query = 'SELECT * FROM tickets';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving tickets');
        }

        // Render the tickets view with the retrieved tickets
        res.render('viewTickets', { tickets: results });
    });
});

// Route to view all attendees
app.get('/viewAttendees', (req, res) => {
    const query = 'SELECT * FROM attendees';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving attendees');
        }

        // Render the attendees view with the retrieved attendees
        res.render('viewAttendees', { attendees: results });
    });
});

app.get('/public', (req, res) => {
    const event = {
      // Example event object, replace with actual database query
      venue_image: 'example.png'
    };
  
    console.log('Image Path:', `/public/images/${event.venue_image}`);
    console.log('Link Path:', `/public/images/${event.venue_image}`);
  
    res.render('', { events: event });
  });
  
  app.get('/editTicket/', (req, res) => {
    res.render('editTicket');
});

  app.get('/editTicket/:event_id', (req, res) => {
    const eventId = req.params.event_id;
    // Query to fetch ticket details
    const query = 'SELECT * FROM tickets WHERE event_id = ?';
    connection.query(query, [eventId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving ticket details');
        }
        if (results.length === 0) {
            return res.status(404).send('Ticket not found');
        }
        res.render('viewTickets', { tickets: results[0] });
    });
});

app.post('/editTicket/:event_id', (req, res) => {
    const eventId = req.params.event_id;
    const { price, Availablity } = req.body;
    const query = 'UPDATE tickets SET price = ?, Availablity = ? WHERE event_id = ?';
    connection.query(query, [price, Availablity, eventId], (error, results) => {
        if (error) {
            console.error('Database update error:', error.message);
            return res.status(500).send('Error updating ticket');
        }
        res.redirect('/viewTickets');
    });
});

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));