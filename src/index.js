const express = require('express')
const app = express()
const bodyParser = require("body-parser");
var data = require('./InitialData.js');
let no = data.length;
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
    // your code goes here
app.get('/api/student', (req, res) => {
    res.send(data);
})

app.get('/api/student/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(404).json({});
    }
    let obj = undefined;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            obj = data[i];
            break;
        }
    }
    if (obj === undefined) {
        res.status(404).json({});
    }
    res.json(obj);
})

app.delete('/api/student/:id', (req, res) => {
    const id = Number(req.params.id);
    let arr = [];
    for (let i = 0; i < data.length; i++) {
        if (id !== data[i].id) {
            arr.push(data[i]);
        }
    }
    if (arr.length === data.length) {
        res.status(404).json({});
        return;
    }
    data = arr;
    res.json('provided given id is valid');
})

app.post('/api/student', (req, res) => {
    let headers = req.headers;
    let cnt = 0;
    Object.keys(headers).forEach((key1) => {
        if (key1 === 'name' || key1 === 'currentclass' || key1 === 'division') {
            cnt++;
        }
    })
    if (cnt !== 3) {
        res.status(400).send({});
    }
    let arr = [...data];
    let obj = {
        'id': no + 1,
        'name': headers.name,
        'currentClass': headers.currentclass,
        'division': headers.division
    }
    arr.push(obj);
    data = arr;
    let i = no + 1;
    no++;
    res.json(i);
})

app.put('/api/student/:id', (req, res) => {
    let headers = req.headers;
    let changed = [];
    Object.keys(headers).forEach((key1) => {
        if (key1 === 'name' || key1 === 'currentclass' || key1 === 'division') {
            changed.push(key1);
        }
    })
    const id = Number(req.params.id);
    let index = -1;
    let obj = undefined;
    for (let i = 0; i < data.length; i++) {
        let did = Number(data[i].id);
        if (did === id) {
            index = i;
            obj = data[i];
            break;
        }
    }
    if (index === -1) {
        res.status(400).json({});
    }
    let updated = {};
    for (let i = 0; i < changed.length; i++) {
        obj[changed[i]] = headers[changed[i]];
        updated[changed[i]] = headers[changed[i]];
    }
    let arr = [...data];
    arr[index] = obj;
    data = arr;
    res.json(updated);

})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;