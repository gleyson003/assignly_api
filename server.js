const express = require('express');
const mongoose = require('mongoose');
const app = express();

const cors = require('cors');
const swaggerSetup = require("./swagger");

const usersRoutes = require('./routes/users');
const authRoutes = require("./routes/auth");

require('dotenv').config();
app.use(express.json());
app.use(cors());

swaggerSetup(app);

// Main Route
app.get('/', (req, res) => {
    res.send('Welcome to Assignly API!');
});

// Routes
app.use('/users', usersRoutes);
app.use("/auth", authRoutes);

//MongoDB conection 
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("🔥 MongoDB conecteded"))
.catch(err => console.error("Error to conecting MongoDB:", err));


// PORT Listing
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server stating http://localhost:${PORT}`);
});
