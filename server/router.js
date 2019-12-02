const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getTodos', mid.requiresLogin, controllers.Todo.getTodos);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Todo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Todo.make);
  app.delete('/deleteTodo', mid.requiresLogin, controllers.Todo.deleteTodo);
  app.put('/updateTodo', mid.requiresLogin, controllers.Todo.updateTodo);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
