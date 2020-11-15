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
        return;
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
        return;
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
    if (arr.length === data.length || arr.length === 0) {
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
    const id = req.params.id;
    if (isNaN(id)) {
        res.status(400).json({});
        return;
    }
    let updData = req.body;
    if (updData) {
        let params = [];
        for (let i = 0; i < updData.length; i++) {
            if (updData[i] === 'name' || updData[i] === 'currentClass' || updData[i] === 'division') {
                params.push(updData);
            }
        }
        if (params.length === 0) {
            res.status(400).json({});
            return;
        }
        let index = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                index = i;
                break;
            }
        }
        if (index === -1 && params.length === 3) {
            let id = (data.length !== 0) ? data[data.length - 1].id : -1;
            let { name, currentClass, division } = updData;
            id = (id !== 0) ? id + 1 : 0;
            const obj = {
                id: id,
                name: name,
                currentClass: Number(currentClass),
                division: division
            }
            data.push(obj);
            res.json();
            return;
        }
        let obj = data[index];
        for (let i = 0; i < params.length; i++) {
            if (params[i] === 'currentClass') {
                obj[params[i]] = Number(updData['currentClass']);
            } else {
                obj[params[i]] = updData[params[i]];
            }
        }
        data[index] = obj;
        res.json();
    } else {
        res.status(400).json({});
        return;
    }

})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;