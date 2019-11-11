const handleTodo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if ($("#todoTitle").val() == '') {
        handleError("A ToDo item title is required.");
        return false;
    }

    sendAjax('POST', $("#todoForm").attr("action"), $("#todoForm").serialize(), function() {
        loadTodosFromServer();
    });

    return false;
};

const TodoForm = (props) => {
    return (
        <form id="todoForm" 
            name="todoForm"
            onSubmit={handleTodo}
            action="/maker"
            method="POST"
            className="todoForm"
        >
            <label htmlFor="title">Title: </label>
            <input id="todoTitle" type="text" name="title" placeholder="Item Title"/>

            <label htmlFor="desc">Description: </label>
            <input id="todoDesc" type="text" name="desc" placeholder="Item Description"/>

            <label htmlFor="date">Date: </label>
            <input id="todoDate" type="date" name="date"/>

            <label htmlFor="type">Type: </label>
            <select id="todoType" name="type" form="todoForm">
              <option value="note">Note</option>
              <option value="travel">Travel</option>
              <option value="school">School</option>
              <option value="medical">Medical</option>
              <option value="event">Event</option>
              <option value="shopping">Shopping</option>
            </select>

            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeTodoSubmit" type="submit" value="Add ToDo" />
        </form>
    );
};

const TodoList = function(props) {
    if (props.todos.length === 0){
        return (
            <div className="todoList">
                <h3 className="emptyTodo">No ToDos yet, add one!</h3>
            </div>
        );
    }

    const todoNodes = props.todos.map(function(todo) {
        return (
            <div key={todo._id} className="todo">
                <div>
                    <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" /> 
                    <h3 className="todoTitle">Title: {todo.title} </h3>
                </div>
                <div>
                    <h3 className="todoDesc">Description: {todo.desc} </h3>
                    <h3 className="todoType">Type: {todo.type} </h3>
                    <h3 className="todoDate">Date: {todo.date} </h3>
                </div>
            </div>
        );
    });

    return (
        <div className="todoList">
            {todoNodes}
        </div>
    );
};

const loadTodosFromServer = () => {
    sendAjax('GET', '/getTodos', null, (data) => {
        ReactDOM.render(
            <TodoList todos={data.todos} />, document.querySelector("#todos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <TodoForm csrf={csrf} />, document.querySelector("#makeTodo")
    );

    ReactDOM.render(
        <TodoList todos={[]} />, document.querySelector("#todos")
    );

    loadTodosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});