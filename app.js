const express = require("express");
const { scheduleTasksStart } = require('./scheduledTasks');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const pool = require("./db");

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Test the database connection
pool.query('SELECT 1')
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  });

app.use(cors({
  origin: [process.env.ISA_CLIENT_URL, 'http://localhost:3000'], // DELETE localhost after testing
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', require('./routes/auth'));

// Start the scheduled tasks
scheduleTasksStart();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the pool object
module.exports = pool;