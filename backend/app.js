const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const workspaceRoutes = require('./routes/workspaceRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bcrypt = require('bcrypt');
const collection = require('./models/userModel');
const { emitWarning } = require("process");
const cors = require('cors');


const app = express();
app.use(cors());

//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//connection to mongo
const dbURI = 'mongodb+srv://paulamora200525:Morita200525@cluster0.zqaulnw.mongodb.net/test?retryWrites=true&w=majority';

// MongoDB Connection
async function connect() {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:',error);
    }
}

connect();

// Check database connected or not
mongoose.connection.on('connected', () => {
    console.log("Database Connected Successfully");
});
mongoose.connection.on('error', (err) => {
    console.log("Database connection error:", err);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

// Signup User
app.post('/signup', async (req, res) => {
        const data = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            userType: req.body.userType
        }

        // Check if the username already exists in the database
        const existingUser = await collection.findOne({ email: data.email });

        if (existingUser) {
            return res.send('Email already exists. Please choose a different email.');
        }else {
            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

            // Create new user document
           /* const newUser = new UserModel({
                fullname,
                email,
                phone,
                password: hashedPassword,
                userType
            });*/

            // Save new user to MongoDB
            //await newUser.save();
            //console.log('User registered successfully:', newUser);
            data.password = hashedPassword; // Replace the original password with the hashed one            

            const userdata = await collection.insertMany(data);
            console.log(userdata);

            // Redirect user based on userType
            if (req.body.userType === 'owner') {
                res.redirect('/public/owner.html'); // Redirect owner to their profile
            } else if (req.body.userType === 'co-worker') {
                res.redirect('/public/co-worker.html'); // Redirect co-worker to their profile
            } else {
                res.status(400).send('Invalid user type');
            }
        }
});

// Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by fullname
        const user = await collection.findOne({ email: req.body.email });
        if (!user) {
            return res.send('User not found');
        }

        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.send('Incorrect password');
        }

        // Determine user type from the retrieved user object
        const userType = user.userType;

        // Determine the userType and redirect accordingly
        if (user.userType === 'owner') {
            // Redirect owner to owner's profile
            res.redirect('/public/owner.html');
        } else if (user.userType === 'co-worker') {
            // Redirect co-worker to co-worker's profile
            res.redirect('/public/co-worker.html');
        } else {
            // Handle other user types or unexpected userType values
            res.status(400).send('Invalid user type');
        }

        // Redirect or respond with user data
        /*res.status(200).json({
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            password: user.password,
            userType: user.userType
        });*/

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/api', workspaceRoutes);
app.use('/', bookingRouter);

// Serve HTML files
app.get('/finda-workspace', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'FindaWorkspace.html'));
    } catch (error) {
        console.error('Error serving FindaWorkspace.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to serve Sections.html
app.get('/sections', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'sections.html'));
    } catch (error) {
        console.error('Error serving Sections.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to serve Product.html
app.get('/product', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'product.html'));
    } catch (error) {
        console.error('Error serving Product.html:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});