const express = require('express')
const app = express()
const bodyParser = require("body-parser");
var data = require('./InitialData.js');
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
    const data = req.body;
    if (data) {
        if (Object.is(parseInt(id), NaN)) {
            res.sendStatus(400);
        } else {
            let found = false;
            let validKey = ["name", "currentClass", "division"];
            for (let i = 0; i < Object.keys(data).length; i++) {
                found = validKey.includes(Object.keys(data)[i]);
            }
            if (!found) {
                res.sendStatus(400);
                return;
            } else {
                let newStudents = [...data];
                let idFound = false;
                newStudents = newStudents.map((student) => {
                    if (student.id === Number(id)) {
                        idFound = true;
                        let newS = {...student }
                        for (let i = 0; i < Object.keys(data).length; i++) {
                            newS[Object.keys(data)[i]] = Object.keys(data)[i] === "currentClass" ? Number(data[Object.keys(data)[i]]) : data[Object.keys(data)[i]];
                        }
                        return newS;
                    } else {
                        return student
                    }
                })
                if (!idFound) {
                    if (Object.keys(data).length === 3) {
                        const lastId = data.length !== 0 ? data[data.length - 1].id : -1;
                        const { name, currentClass, division } = data;
                        lastId = lastId !== 0 ? lastId + 1 : 0;
                        const newStudent = {
                            id: lastId,
                            name: name,
                            currentClass: Number(currentClass),
                            division: division

                        }

                        data.push(newStudent);
                        res.json()
                    } else {
                        res.sendStatus(400)
                    }
                } else {
                    data = []
                    data = [...newStudents]
                    res.json();
                }
            }
        }
    } else {
        res.sendStatus(400);
        return;
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;