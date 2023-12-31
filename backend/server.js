const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const { spawnSync } = require('child_process');

const app = express();

app.use(cors());

app.use(express.json());

// Function to run sentiment.py script
function getSentiment(input) {
  const python = spawnSync('python', 
    ['./scripts/sentiment.py', input], 
    { encoding: 'utf-8' });
  const output = python.stdout;
  const error = python.stderr;
  if (error != null && error.includes("Error")) {
    console.log(error)
    return null;
  }
  return output;
}

// Set up an endpoint to save a message
app.post('/saveMessage', (req, res) => {
    const { id, message } = req.body;

    if (message === null || id === null || message.length === 0 || id.length === 0){
      res.status(500);
      res.end();
    }

    // The path to your JSON file
    const filePath = path.join(__dirname, "./messages.json");

    // Check if the file exists. If not, create it.
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}));
    }

    // Get the current messages
    let messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Run sentiment.py script on the message
    let senti = getSentiment(message)
    console.log("senti: " + senti)
    senti = senti.trim().split(" ");
    let attitude = senti[0];
    let attitudeScore = senti[1];

    // If this ID already exists, add the new message to its array. Otherwise, create a new array for this ID.
    if (messages[id]) {
        messages[id].push({message, attitude, attitudeScore});
    } else {
        messages[id] = [{message, attitude, attitudeScore}];
    }

    // Write the new messages object back to the file
    fs.writeFileSync(filePath, JSON.stringify(messages));

    res.status(200).json({ status: 'success', attitude: attitude, attitudeScore: attitudeScore });
});

app.get('/getTopics', (req, res) => {
  const numberOfTopics = req.query.number;

  const python = spawnSync('python3', ['./scripts/topic.py', './messages.json', numberOfTopics]);

  // Check for errors in the Python script
  if(python.stderr.toString() && python.stderr.toString().includes("Error")){
    console.log("Python script error: ", python.stderr.toString());
    res.status(500).send({error: "An error occurred while executing the Python script"});
    return;
  }

  const data = JSON.parse(fs.readFileSync('./output.json', 'utf8'));
  let topicsMap = {};

  for (let item of data) {
    let topic = item[3];
    if (topicsMap[topic]) {
      topicsMap[topic]++;
    } else {
      topicsMap[topic] = 1;
    }
  }
  let topicsArray = Object.entries(topicsMap);
  res.status(200).json({ topics: topicsArray });
});

app.get('/getNumberOfMessages', (req, res) => {
  fs.readFile('./messages.json', 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading file:', err);
      res.status(500).json({ error: 'An error occurred while reading the file.' });
      return;
    }

    try {
        const messages = JSON.parse(data);
        var messagesCount = 0;

        for (var user in messages){
          messagesCount += messages[user].length;
        }

        res.status(200).json(messagesCount);
    } catch (err) {
        console.log('Error parsing JSON:', err);
        res.status(500).json({ error: 'An error occurred while parsing the JSON.' });
    }
  });
})

app.get('/getMessagesWithTopicModelling', (req, res) => {
  const numberOfTopics = req.query.number;
  
  const python = spawnSync('python', ['./scripts/topic.py', './messages.json', numberOfTopics], 
    { encoding: 'utf-8' });
  const output = python.stdout;
  const error = python.stderr;
  if (error != null && error.includes("Error")) {
    res.status(500).json({ error: 'An error occurred while running the python script.' });
    return;
  }
  
  fs.readFile('./messages.json', 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading file:', err);
      res.status(500).json({ error: 'An error occurred while reading the file.' });
      return;
    }
    try {
        const messages = JSON.parse(data);
        res.status(200).json(messages);
    } catch (err) {
        console.log('Error parsing JSON:', err);
        res.status(500).json({ error: 'An error occurred while parsing the JSON.' });
    }
  });
});

app.get('/getMessages', (req, res) => {

  fs.readFile('./messages.json', 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading file:', err);
      res.status(500).json({ error: 'An error occurred while reading the file.' });
      return;
    }
    try {
        const messages = JSON.parse(data);
        res.status(200).json(messages);
    } catch (err) {
        console.log('Error parsing JSON:', err);
        res.status(500).json({ error: 'An error occurred while parsing the JSON.' });
    }
  });
});

app.put("/removeUserMessages", (req, res) => {
  const userId = req.query.id;
  
  if (!userId || userId.length <= 0){
    res.status(500);
    res.end();
  }

  fs.readFile('./messages.json', 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading file:', err);
      res.status(500).json({ error: 'An error occurred while reading the file.' });
      return;
    }
    try {
      const messagesPerUser = JSON.parse(data);

      var getUserEntry = messagesPerUser[userId];

      if (!messagesPerUser.hasOwnProperty(userId.toString())) {
        res.status(200).json({success: "false"});
        return;
      }

      delete messagesPerUser[userId];

      // The path to your JSON file
      const filePath = path.join(__dirname, "./messages.json");
      // Write the new messages object back to the file
      fs.writeFileSync(filePath, JSON.stringify(messagesPerUser));

      res.status(200).json({success: "true", entry: getUserEntry});
      res.end();
    } 
    catch (err) {
      console.log('Error parsing JSON:', err);
      res.status(500);
      return;
    }
  });
});

// Set up the server to listen on a port
const port = 8080;
const listening = app.listen(port, () => console.log(`Server listening on port ${port}`));

exports.app = app;
exports.listening = listening;