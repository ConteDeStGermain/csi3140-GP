# Project Setup

## Frontend

To start the frontend server, you'll need to have Node.js and npm installed on your system. If you don't have them installed, you can download and install them from [here](https://nodejs.org/en/download/).

1. Open a terminal.
2. Navigate to the `frontend` directory with the command: `cd frontend`
3. Install the necessary npm packages with: `npm install`
4. Start the frontend server with: `npm run dev`

Now, your frontend server should be up and running.

## Backend

To start the backend server, you'll also need to have Node.js installed.

1. Open a terminal (if you closed the previous one).
2. Navigate to the `backend` directory with the command: `cd backend`
3. Start the backend server with: `node server.js`

Now, your backend server should be up and running.

## Python Scripts

To install the necessary Python packages, you'll need Python and pip installed on your system. If you don't have them installed, you can download and install them from [here](https://www.python.org/downloads/).

1. Open a terminal (if you closed the previous one).
2. Navigate to the `python_scripts` directory with the command: `cd python_scripts`
3. Install the necessary Python packages with: `pip install -r requirements.txt`

Now, you should have all the necessary Python packages installed.


# Project Setup [Docker]

Pull the server and client images from Docker Hub, by running the following commands:

For the [server image](https://hub.docker.com/repository/docker/svetlana154/crsa-web-app-server/general): 
```
docker pull svetlana154/crsa-web-app-server:latest
```

For the [client image](https://hub.docker.com/repository/docker/svetlana154/crsa-web-app-client/general): 
```
docker pull svetlana154/crsa-web-app-client:latest
```

Run them using a similar docker-compose.yaml to the one defined in the source code.

# Manual Testing

In order to test the server endpoints, pull the github source code and navigate to the backend directory through `cd ./backend`. Then run the following command to run all the JavaScript tests for the backend:
```
npm test
```
Alternatively, you can run the command with coverage  to check the coverage of the tests over the code.
```
npm test -- --coverage
```
*Note: if the port 8080 is busy, one of the server tests will fail, so ensure that the port is free for the server to use to acheive the best results*


For the python scripts, run the tests individually through the following commands. Make sure you navigate to the `/backend/scripts` directory first before running any of the commands, or modify the commands accordingly.
```
python sentiment.test.py
```
```
python topic.test.py
``` 
