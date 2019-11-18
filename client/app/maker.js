const handleTodo = (e) => {
    e.preventDefault();

    $("#todoMessage").animate({width:'hide'},350);

    if ($("#todoTitle").val() == '') {
        handleError("A ToDo item title is required.");
        return false;
    }
    const csrf = $("input[name=_csrf]").val();

    sendAjax('POST', $("#todoForm").attr("action"), $("#todoForm").serialize(), function() {
        loadTodosFromServer(csrf);
    });

    return false;
};

const handleDeleteTodo = (e) => {
    e.preventDefault();

    $("#todoMessage").animate({width:'hide'},350);
    
    const csrf = $("input[name=_csrf]").val();
    const url = "_id=" + e.target.value + "&_csrf=" + csrf;
    
    sendAjax('DELETE', "/deleteTodo", url, (data) => {
        loadTodosFromServer(csrf);
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
            <h2 id="addtodoTitle">Add New To-Do</h2>
            <ul>
                <li> 
                    <label htmlFor="title">Title: </label>
                    <input id="todoTitle" type="text" name="title" placeholder="Item Title"/>
                </li>
                <li>
                    <label htmlFor="desc">Description: </label>
                </li>
                <li>
                    <textarea id="todoDesc" name="desc"></textarea>
                </li>
                <li>
                    <label htmlFor="type">Type: </label>
                    <select id="todoType" name="type" form="todoForm">
                        <option value="Note">Note</option>
                        <option value="Travel">Travel</option>
                        <option value="School">School</option>
                        <option value="Medical">Medical</option>
                        <option value="Event">Event</option>
                        <option value="Shopping">Shopping</option>
                    </select>
                </li>
                <li>
                    <label htmlFor="date">Date: </label>
                    <input id="todoDate" type="date" name="date"/>
                </li>
            </ul>
            
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
                        <h3 className="todoTitle" >Title: {todo.title} </h3>
                        <h3 className="todoDesc">Description: {todo.desc} </h3>
                        <h3 className="todoType">Type: {todo.type} </h3>
                        <h3 className="todoDate">Date: {todo.date} </h3>
                    </div>
                    <div id="todoOptions">
                        <button id="doneButton" value={todo._id} onClick={handleDeleteTodo} >DONE</button>
                        <button id="deleteButton" value={todo._id} onClick={handleDeleteTodo} >DELETE</button>
                    </div>
            </div>
        );
    });

    return (
        <div className="todoList">
            <input type="hidden" name="_csrf" value={props.csrf} />
            <h2 id="todolistTitle">Your To-Do List</h2>
            {todoNodes}
        </div>
    );
};

const loadTodosFromServer = (csrf) => {
    sendAjax('GET', '/getTodos', null, (data) => {
        const props = {
            todos: data.todos,
            csrf: csrf
        };
        ReactDOM.render(
            <TodoList {...props} />, document.querySelector("#todos")
        );
    });
};

const setup = function(csrf) {
    const addButton = document.querySelector("#addButton");
    const listButton = document.querySelector("#listButton");
    const colorButton = document.querySelector("#color");

    addButton.addEventListener("click", (e) => {
        e.preventDefault();
        createTodoForm(csrf);
        return false;
    });

    listButton.addEventListener("click", (e) => {
        e.preventDefault();
        createTodoList(csrf);
        return false;
    });

    colorButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleError("Unlock this feature by subscribing!");
        return false;
    });

    createTodoList(csrf); //default view
};

const createTodoForm = (csrf) => {
    ReactDOM.render(
        <TodoForm csrf={csrf} />, document.querySelector("#todos")
    );
};

const createTodoList = (csrf) => {
    const props = {
        todos: [],
        csrf: csrf
    };
    ReactDOM.render(
        <TodoList {...props} />, document.querySelector("#todos")
    );

    loadTodosFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});