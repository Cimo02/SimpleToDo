
const handleTodo = (e) => {
    e.preventDefault();

    $("#todoMessage").animate({width:'hide'},350);

    if ($("#todoTitle").val() == '') {
        handleError("A ToDo item title is required.");
        return false;
    }
    const csrf = $("input[name=_csrf]").val();

    sendAjax('POST', $("#todoForm").attr("action"), $("#todoForm").serialize(), function() {
        loadTodosFromServer(csrf, false);
    });

    return false;
};

const handleDeleteTodo = (e) => {
    e.preventDefault();

    $("#todoMessage").animate({width:'hide'},350);
    
    const csrf = $("input[name=_csrf]").val();
    const url = "_id=" + e.target.value + "&_csrf=" + csrf;
    
    sendAjax('DELETE', "/deleteTodo", url, (data) => {
        loadTodosFromServer(csrf, false);
    });

    return false;
};

const loadUpdateForm = (e) => {
    e.preventDefault();

    $("#todoMessage").animate({width:'hide'},350);
    
    const csrf = $("input[name=_csrf]").val();
    const id = e.target.value;

    sendAjax('GET', '/getTodos', null, (data) => {
        const result = data.todos.find( ({ _id }) => _id === id );
        createUpdateTodoForm(csrf, id, result.title, result.desc);
    });

    return false;
};

const handleEditTodo = (e) => {
    e.preventDefault();

    $("#todoMessage").animate({width:'hide'},350);
    
    const csrf = $("input[name=_csrf]").val();

    sendAjax('PUT', $("#todoForm").attr("action"), $("#todoForm").serialize(), function() {
        loadTodosFromServer(csrf, false);
    });

    return false;
};

const changeColorTheme = (e) => {
    const navbar = document.querySelector("#navbar");
    navbar.style.backgroundColor = '#0D663D';

    const logoutButton = document.querySelector("#listbutton");
    const listButton = document.querySelector("#logoutbutton");
    const addButton = document.querySelector("#addbutton");
    
    logoutButton.style.backgroundColor = '#0D663D';
    listButton.style.backgroundColor = '#0D663D';
    addButton.style.backgroundColor = '#0D663D';

    const todoTitle = document.querySelector("#todolistTitle");
    todoTitle.style.color = "#0D663D";

    const todos = document.getElementsByClassName("todo");
    for (var i = 0; i < todos.length; i++) {
        todos[i].style.backgroundColor = "#0D663D";
        todos[i].style.borderColor = "#0D663D";
    }

    const todoButtons = document.getElementsByTagName("button");
    console.log(todoButtons);
    for (var i = 0; i < todoButtons.length; i++) {
        todoButtons[i].style.backgroundColor = "#16A662";
    }

    return false;
};

const UpdateTodoForm = (props) => {
    return (
        <form id="todoForm" 
            name="todoForm"
            onSubmit={handleEditTodo}
            action="/updateTodo"
            method="PUT"
            className="todoForm"
        >
            <h2 id="addtodoTitle">Update To-Do</h2>
            <ul>
                <li> 
                    <label htmlFor="title">Title: </label>
                    <input id="todoTitle" type="text" name="title" placeholder={props.title} />
                </li>
                <li>
                    <label htmlFor="desc">Description: </label>
                </li>
                <li>
                    <textarea id="todoDesc" name="desc" placeholder={props.desc} ></textarea>
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
            <input type="hidden" name="_id" value={props.id} />
            <input id="submitButton" className="makeTodoSubmit" type="submit" value="Update ToDo" />
        </form>
    );
}

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
            <input id="submitButton" className="makeTodoSubmit" type="submit" value="Add ToDo" />
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
                        <button class="todoOption" id="doneButton" value={todo._id} onClick={handleDeleteTodo} >DONE</button>
                        <button class="todoOption" id="deleteButton" value={todo._id} onClick={handleDeleteTodo} >DELETE</button>
                        <button class="todoOption" id="editButton" value={todo._id} onClick={loadUpdateForm} >EDIT</button>
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

const loadTodosFromServer = (csrf, sortByDate) => {
    sendAjax('GET', '/getTodos', null, (data) => {
        const props = {
            todos: data.todos,
            csrf: csrf
        };

        // sort todo list here if sortByDate is true
        if (sortByDate) {
            props.todos.sort(compareDates);
        }

        ReactDOM.render(
            <TodoList {...props} />, document.querySelector("#todos")
        );
    });
};

const setup = function(csrf) {
    const addButton = document.querySelector("#addButton");
    const listButton = document.querySelector("#listButton");
    const colorButton = document.querySelector("#color");
    const subscribeButton = document.querySelector("#subscribe");
    const sortButton = document.querySelector("#sort");

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
        changeColorTheme();
        return false;
    });

    subscribeButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleError("Unable to subscribe yet!");
        return false;
    });

    sortButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadTodosFromServer(csrf, true);
        return false;
    });

    createTodoList(csrf); //default view
};

const createTodoForm = (csrf) => {
    ReactDOM.render(
        <TodoForm csrf={csrf} />, document.querySelector("#todos")
    );
};

const createUpdateTodoForm = (csrf, id, title, description, type, date) => {
    ReactDOM.render(
        <UpdateTodoForm csrf={csrf} id={id} title={title} desc={description}/>, document.querySelector("#todos")
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

    loadTodosFromServer(csrf, false);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

// function for sorting todo array by date 
function compareDates(a, b) {
    var aDate = a.date;
    var bDate = b.date;

    let comparison = 0;
    if (aDate > bDate) {
        comparison = 1;
    } 
    else if (aDate < bDate) {
        comparison = -1;
    }
    
    return comparison;
}