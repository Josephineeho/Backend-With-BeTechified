require('dotenv').config(); // Load environment variables from .env file

const express = require('express');

const app = express();
app.use(express.json()); //body parsing middleware

let todos = [
    { id: 1, task: 'Learn Node.js', completed: false},
    { id: 2, task: 'Build a REST API', completed: false},
];
//GET all todos
app.get('/todos', (req, res) => {
    res.status(200).json(todos);//send  array as json
});

//POST create new todo
app.post('/todos', (req, res) =>{
    const newTodo = { id: todos.length + 1, ...req.body};//create new todo with body data, auto id
    todos.push(newTodo);//add to array
    res.status(201).json(newTodo);//return created todo
});

//PATCH Update -partial update
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id ===parseInt(req.params.id));
    if(!todo) return res.status(404).json({ message: 'Todo not found'});
    Object.assign(todo, req.body); // merge updates into existing todo
    res.status(200).json(todo);//return updated todo
});

//DELETE a todo
app.delete('/todos/:id', (req, res)=> {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id); //remove from array
    if(todos.length === initialLength)
        return res.status(404).json({ message: "Not Found"});
    res.status(204).send(); //no content(silent success)

})

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Server error'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Sever running on port ${PORT}`);
})