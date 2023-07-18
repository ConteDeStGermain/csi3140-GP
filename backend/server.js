const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const { spawn } = require('child_process');

const app = express();

app.use(cors());

app.use(express.json());

function getRandomFloat1() {
  return Math.random() * 2 - 1;
}

function getRandomFloat2() {
  return Math.random();
}

// Set up an endpoint to save a message
app.post('/saveMessage', (req, res) => {
  const { id, message } = req.body;

  const sentiment = spawn('python', ['../python_scripts/sentiment.py', message]);

  // Generate two random floats
  const float1 = getRandomFloat1();
  const float2 = getRandomFloat2();

  // The path to your JSON file
  const filePath = path.join(__dirname, "./messages.json");

  // Check if the file exists. If not, create it.
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }

  // Get the current messages
  let messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // If this ID already exists, add the new message to its array. Otherwise, create a new array for this ID.
  if (messages[id]) {
    messages[id].push({message, float1, float2});
  } else {
    messages[id] = [{message, float1, float2}];
  }

  // Write the new messages object back to the file
  fs.writeFileSync(filePath, JSON.stringify(messages));

  // Send a success response
  res.status(200).json({ status: 'success' });
});

// Set up the server to listen on a port
const port = 8080;
app.listen(port, () => console.log(`Server listening on port ${port}`));
