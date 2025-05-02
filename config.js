/*const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

const dbURI = 'mongodb+srv://paulamora200525:Morita200525@cluster0.zqaulnw.mongodb.net/test?retryWrites=true&w=majority';

async function connect() {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
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

// Create Schema
const Loginschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    }
});

// Collection part
const collection = mongoose.model("users", Loginschema);

module.exports = collection;

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});*/
