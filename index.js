/*const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const { emitWarning } = require("process");

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

// Register User
app.post("/signup", async (req, res) => {
    try{

    const { fullname, password, email, phone, userType } = req.body;

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ fullname: data.fullname });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } 
    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user document
    const newUser = {
        fullname,
        password: hashedPassword,
        email,
        phone,
        userType // Assuming userType is provided in the signup form
    };

    // Insert new user into the collection
    await collection.insertOne(newUser);
    
    // Determine the userType and redirect accordingly
    if (userType === "owner") {
        // Redirect owner to owner's profile
        return res.redirect('/owner.html');
    } else if (userType === "co-worker") {
        // Redirect co-worker to co-worker's profile
        return res.redirect('/co-worker.html');
    } else {
        // Handle other user types or unexpected userType values
        return res.send("Invalid user type");
    }

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await collection.findOne({ fullname: username });

        if (!user) {
            return res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.send("wrong Password");
        }


        if (user.userType === "Owner") {
            // Redirect owner to owner's profile
            return res.redirect('/owner.html');
        } else if (user.userType === "Co-Worker") {
            // Redirect co-worker to co-worker's profile
            return res.redirect('/co-worker.html');
        } else {
            // Handle other user types or unexpected userType values
            return res.send("Invalid user type");
        }
    }
    catch {
        console.error("Login error:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});*/