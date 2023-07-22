const server = require('./server');
const supertest = require('supertest');
requestWithSupertest = supertest(server.listening);

const id = 123;

afterAll(done => {
    server.listening.close();
    done();
})

describe('POST requests', function () {
    it("POST /saveMessage with no message in request body, throws 500 error", async () => {
        const res = await requestWithSupertest.post('/saveMessage');
        expect(res.status).toEqual(500);
    })

    it("POST /saveMessage with message in request body, saves to database", async () => {
        message = "This is a message"
        const res = await requestWithSupertest.post('/saveMessage').send({id, message});
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('attitude')
        expect(res.body).toHaveProperty('attitudeScore')
    })
    
});

describe('GET requests', function () {
    it("GET /getNumberOfMessages, returns a number", async () => {
        const res = await requestWithSupertest.get('/getNumberOfMessages');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        console.log(res.body)
        expect(typeof res.body).toBe("number");
        expect(res.body > 0).toBeTruthy();
    })

    it("GET /getMessages, returns all messages", async () => {
        const res = await requestWithSupertest.get("/getMessages");
        expect(res.status).toEqual(200);
        for (key in res.body){
            res.body[key].forEach(messageFromUser => {
                expect(messageFromUser).toHaveProperty("message");
                expect(messageFromUser).toHaveProperty("attitude");
                expect(messageFromUser).toHaveProperty("attitudeScore");
            })
        }
    })

    it("GET /getMessagesWithTopicModelling with no number of topics, throws 500 error", async () => {
        const res = await requestWithSupertest.get('/getMessagesWithTopicModelling');
        expect(res.status).toEqual(500);
        expect(res.body).toHaveProperty("error");
    })

    it("GET /getMessagesWithTopicModelling with improper query, throws 500 error", async () => {
        const res = await requestWithSupertest.get('/getMessagesWithTopicModelling?2');
        expect(res.status).toEqual(500);
        expect(res.body).toHaveProperty("error");
    })

    it("GET /getMessagesWithTopicModelling with proper query, returns all messages", async () => {
        const numberOfTopics = 2;
        const res = await requestWithSupertest.get(`/getMessagesWithTopicModelling?number=`+numberOfTopics.toString());
        expect(res.status).toEqual(200);
        for (key in res.body){
            res.body[key].forEach(messageFromUser => {
                expect(messageFromUser).toHaveProperty("topic");
            })
        }
    })
});


describe('PUT requests', function () {
    it("PUT /removeUserMessages with no id, throws 500 error", async () => {
        const res = await requestWithSupertest.put('/removeUserMessages');
        expect(res.status).toEqual(500);
    })

    it("PUT /removeUserMessages with nonexistent id, returns success false", async () => {
        const res = await requestWithSupertest.put(`/removeUserMessages?id=` + "ABC".toString());
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("success");
        expect(res.body.success).toEqual("false");
    })

    it("PUT /removeUserMessages with id, returns deleted entry", async () => {
        const res = await requestWithSupertest.put(`/removeUserMessages?id=` + id.toString());
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("success");
        expect(res.body.success).toEqual("true");
        expect(res.body).toHaveProperty("entry");
        res.body.entry.forEach(deletedMessage => {
            expect(deletedMessage).toHaveProperty("message");
            expect(deletedMessage).toHaveProperty("attitude");
            expect(deletedMessage).toHaveProperty("attitudeScore");
            expect(deletedMessage).toHaveProperty("topic");
        })
    })
});
