const models = require('../models');
const Todo = models.Todo;

const makerPage = (req, res) => {
  Todo.TodoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), todos: docs });
  });
};

const makeTodo = (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: 'A ToDo title is required.' });
  }

  const todoData = {
    title: req.body.title,
    desc: req.body.desc,
    date: req.body.date,
    type: req.body.type,
    owner: req.session.account._id,
  };

  const newTodo = new Todo.TodoModel(todoData);

  const todoPromise = newTodo.save();

  todoPromise.then(() => res.json({ redirect: '/maker' }));

  todoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'ToDo already exists.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return todoPromise;
};

const deleteTodo = (request, response) => {
  const req = request;
  const res = response;

  return Todo.TodoModel.deleteOne({ _id: req.body._id }, (err, todo) => {
    if (err) return res.status(500).send(err);

    const jsonRes = {
      message: 'Todo successfully deleted',
      id: todo._id,
      redirect: '/maker',
    };

    return res.status(200).send(jsonRes);
  });
};

const getTodos = (request, response) => {
  const req = request;
  const res = response;

  return Todo.TodoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ todos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getTodos = getTodos;
module.exports.deleteTodo = deleteTodo;
module.exports.make = makeTodo;
