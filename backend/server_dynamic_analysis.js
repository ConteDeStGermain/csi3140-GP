// const response = await fetch('http://localhost:8080/saveMessage', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ id, message }),
//   });

//   function getSentiment(input) {
//     const python = spawnSync('python', ['./scripts/sentiment.py', input]);
//     const output = python.stdout.toString();
//     const error = python.stderr.toString();
//     if (error) {
//       console.error('Python script error:', error);
//       return null;
//     }
//     return output;
//   }

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const { spawnSync } = require('child_process');
const Iroh = require("iroh");

const app = express();

app.use(cors());

app.use(express.json());

let stage = new Iroh.Stage(`
function getSentiment(input) {
    const python = spawnSync('python', ['./scripts/sentiment.py', input]);
    const output = python.stdout.toString();
    const error = python.stderr.toString();
    if (error) {
      console.error('Python script error:', error);
      return null;
    }
    return output;
  }
getSentiment("I am so happy");

// Set up an endpoint to save a message
app.post('/saveMessage', function (req, res) {
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
    let senti = getSentiment(message).trim().split(" ");
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

app.get('/getTopics', function (req, res) {
  const numberOfTopics = req.query.number;

  const python = spawnSync('python', ['../scripts/topic.py', './messages.json', numberOfTopics]);

  // Check for errors in the Python script
  if(python.stderr.toString()){
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

app.get('/getNumberOfMessages', function (req, res) {
  fs.readFile('./messages.json', 'utf8', function (err, data) {
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

app.get('/getMessagesWithTopicModelling', function (req, res) {
  const numberOfTopics = req.query.number;
  
  const python = spawnSync('python', ['./scripts/topic.py', './messages.json', numberOfTopics]);
  const error = python.stderr.toString();
  if (error) {
    res.status(500).json({ error: 'An error occurred while running the python script.' });
    return;
  }
  
  fs.readFile('./messages.json', 'utf8', function (err, data) {
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

// Set up the server to listen on a port
const port = 8080;
app.listen(port);

app.get('/getMessages', function (req, res) {

  fs.readFile('./messages.json', 'utf8', function (err, data) {
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

`);

// const response = await fetch('http://localhost:8080/saveMessage', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ id, message }),
//       });

// function call
stage.addListener(Iroh.CALL)
.on("before", (e) => {
  let external = e.external ? "#external" : "";
  console.log(" ".repeat(e.indent) + "call", e.name, external, "(", e.arguments, ")");
  //console.log(e.getSource());
})
.on("after", (e) => {
  let external = e.external ? "#external" : "";
  console.log(" ".repeat(e.indent) + "call", e.name, "end", external, "->", [e.return]);
  //console.log(e.getSource());
});

// function
stage.addListener(Iroh.FUNCTION)
.on("enter", (e) => {
  let sloppy = e.sloppy ? "#sloppy" : "";
  if (e.sloppy) {
    console.log(" ".repeat(e.indent) + "call", e.name, sloppy, "(", e.arguments, ")");
    //console.log(e.getSource());
  }
})
.on("leave", (e) => {
  let sloppy = e.sloppy ? "#sloppy" : "";
  if (e.sloppy) {
    console.log(" ".repeat(e.indent) + "call", e.name, "end", sloppy, "->", [void 0]);
    //console.log(e.getSource());
  }
})
.on("return", (e) => {
  let sloppy = e.sloppy ? "#sloppy" : "";
  if (e.sloppy) {
    console.log(" ".repeat(e.indent) + "call", e.name, "end", sloppy, "->", [e.return]);
    //console.log(e.getSource());
  }
});

// while, for etc.
stage.addListener(Iroh.LOOP)
.on("enter", function(e) {
  // we enter the loop
  console.log(" ".repeat(e.indent) + "loop enter");
})
.on("leave", function(e) {
  // we leave the loop
  console.log(" ".repeat(e.indent) + "loop leave");
});

// if, else if
stage.addListener(Iroh.IF)
.on("enter", function(e) {
  // we enter the if
  console.log(" ".repeat(e.indent) + "if enter");
})
.on("leave", function(e) {
  // we leave the if
  console.log(" ".repeat(e.indent) + "if leave");
});

// program
stage.addListener(Iroh.PROGRAM)
.on("enter", (e) => {
  console.log(" ".repeat(e.indent) + "Program");
})
.on("leave", (e) => {
  console.log(" ".repeat(e.indent) + "Program end", "->", e.return);
});

eval(stage.script);