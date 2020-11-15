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
    const id = req.params.id;
    const student = studentArray.filter((student) => student.id === Number(id));
    if (student.length !== 0) {
        res.json(student[0]);
    } else {
        res.sendStatus(404);
        return;
    }
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
    const { name, currentClass, division } = req.body;
    if (name && currentClass && division) {
        let id = (data.length !== 0) ? data[data.length - 1].id : -1;
        id = (id !== 0) ? id + 1 : 0;
        const obj = {
            id: id,
            name: name,
            currentClass: currentClass,
            division: division
        }
        data.push(obj);
        res.send({ 'id': id });
    } else {
        res.status(400).json({});
        return;
    }
})

app.put('/api/student/:id', (req, res) => {
    let headers = req.body;
    let changed = [];
    Object.keys(headers).forEach((key1) => {
        if (key1 === 'name' || key1 === 'currentclass' || key1 === 'division') {
            if (key1 === 'currentclass') {
                changed.push('currentClass');
            } else {
                changed.push(key1);
            }
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
        return;
    }
    let updated = {};
    for (let i = 0; i < changed.length; i++) {
        obj[changed[i]] = (changed[i] === 'currentClass') ? Number(headers[changed[i].tolowerCase()]) : headers[changed[i].tolowerCase()];
        updated[changed[i]] = (changed[i] === 'currentClass') ? Number(headers[changed[i].tolowerCase()]) : headers[changed[i].tolowerCase()];
    }
    let arr = [...data];
    arr[index] = obj;
    data = arr;
    res.json();

})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;