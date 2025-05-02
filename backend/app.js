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
app.use(express.json());

// Use static files from 'public' (optional for backend only)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const dbURI = 'mongodb+srv://paulamora200525:Morita200525@cluster0.zqaulnw.mongodb.net/test?retryWrites=true&w=majority';
async function connect() {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}
connect();

mongoose.connection.on('connected', () => {
    console.log("Database Connected Successfully");
});
mongoose.connection.on('error', (err) => {
    console.log("Database connection error:", err);
});

// Serve login and signup pages if needed (for local only)
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
    };

    const existingUser = await collection.findOne({ email: data.email });

    if (existingUser) {
        return res.send('Email already exists. Please choose a different email.');
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);

        // 🔁 Update these redirects for deployment
        if (req.body.userType === 'owner') {
            res.redirect('https://workwise-frontend.netlify.app/owner.html');
        } else if (req.body.userType === 'co-worker') {
            res.redirect('https://workwise-frontend.netlify.app/co-worker.html');
        } else {
            res.status(400).send('Invalid user type');
        }
    }
});

// Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await collection.findOne({ email: email });

        if (!user) {
            return res.send('User not found');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.send('Incorrect password');
        }

        // 🔁 Redirect based on userType for deployment
        if (user.userType === 'owner') {
            res.redirect('https://workwise-frontend.netlify.app/owner.html');
        } else if (user.userType === 'co-worker') {
            res.redirect('https://workwise-frontend.netlify.app/co-worker.html');
        } else {
            res.status(400).send('Invalid user type');
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Use routes
app.use('/api', workspaceRoutes);
app.use('/', bookingRouter);

// Serve HTML pages locally (optional if Netlify handles frontend)
app.get('/finda-workspace', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'FindaWorkspace.html'));
});
app.get('/sections', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sections.html'));
});
app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on https://workwise-azuk.onrender.com`);
});
