const express = require('express');
const mongoose = require('mongoose');
const app = express();

const cors = require('cors');
const swaggerSetup = require("./swagger");

const usersRoutes = require('./routes/users');
const userTypesRoutes = require('./routes/user_types');
const tasksRoutes = require('./routes/tasks');
const taskTypesRoutes = require('./routes/task_types');
const authRoutes = require("./routes/auth");

require('dotenv').config();
app.use(express.json());
app.use(cors());

swaggerSetup(app);

// Main Route
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to Assignly API!</h1>
        <p>Access the API documentation through the link:</p>
        <a href="/api-docs" target="_blank">📄 API documentation</a>
    `);
});

// Routes
app.use('/users', usersRoutes);
app.use('/user-types', userTypesRoutes);
app.use('/tasks', tasksRoutes);
app.use('/task-types', taskTypesRoutes);
app.use("/auth", authRoutes);

//MongoDB conection 
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("🔥 MongoDB conecteded"))
.catch(err => console.error("Error to conecting MongoDB:", err));


// PORT Listing
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server stating http://localhost:${PORT}/api-docs`);
});
