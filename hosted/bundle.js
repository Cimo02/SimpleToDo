"use strict";

var handleTodo = function handleTodo(e) {
    e.preventDefault();

    $("#todoMessage").animate({ width: 'hide' }, 350);

    if ($("#todoTitle").val() == '') {
        handleError("A ToDo item title is required.");
        return false;
    }
    var csrf = $("input[name=_csrf]").val();

    sendAjax('POST', $("#todoForm").attr("action"), $("#todoForm").serialize(), function () {
        loadTodosFromServer(csrf, false);
    });

    return false;
};

var handleDeleteTodo = function handleDeleteTodo(e) {
    e.preventDefault();

    $("#todoMessage").animate({ width: 'hide' }, 350);

    var csrf = $("input[name=_csrf]").val();
    var url = "_id=" + e.target.value + "&_csrf=" + csrf;

    sendAjax('DELETE', "/deleteTodo", url, function (data) {
        loadTodosFromServer(csrf, false);
    });

    return false;
};

var loadUpdateForm = function loadUpdateForm(e) {
    e.preventDefault();

    $("#todoMessage").animate({ width: 'hide' }, 350);

    var csrf = $("input[name=_csrf]").val();
    var id = e.target.value;

    sendAjax('GET', '/getTodos', null, function (data) {
        var result = data.todos.find(function (_ref) {
            var _id = _ref._id;
            return _id === id;
        });
        createUpdateTodoForm(csrf, id, result.title, result.desc);
    });

    return false;
};

var handleEditTodo = function handleEditTodo(e) {
    e.preventDefault();

    $("#todoMessage").animate({ width: 'hide' }, 350);

    var csrf = $("input[name=_csrf]").val();

    sendAjax('PUT', $("#todoForm").attr("action"), $("#todoForm").serialize(), function () {
        loadTodosFromServer(csrf, false);
    });

    return false;
};

var changeColorTheme = function changeColorTheme(e) {
    var navbar = document.querySelector("#navbar");
    navbar.style.backgroundColor = '#0D663D';

    var logoutButton = document.querySelector("#listbutton");
    var listButton = document.querySelector("#logoutbutton");
    var addButton = document.querySelector("#addbutton");

    logoutButton.style.backgroundColor = '#0D663D';
    listButton.style.backgroundColor = '#0D663D';
    addButton.style.backgroundColor = '#0D663D';

    var todoTitle = document.querySelector("#todolistTitle");
    todoTitle.style.color = "#0D663D";

    var todos = document.getElementsByClassName("todo");
    for (var i = 0; i < todos.length; i++) {
        todos[i].style.backgroundColor = "#0D663D";
        todos[i].style.borderColor = "#0D663D";
    }

    var todoButtons = document.getElementsByTagName("button");
    console.log(todoButtons);
    for (var i = 0; i < todoButtons.length; i++) {
        todoButtons[i].style.backgroundColor = "#16A662";
    }

    return false;
};

var UpdateTodoForm = function UpdateTodoForm(props) {
    return React.createElement(
        "form",
        { id: "todoForm",
            name: "todoForm",
            onSubmit: handleEditTodo,
            action: "/updateTodo",
            method: "PUT",
            className: "todoForm"
        },
        React.createElement(
            "h2",
            { id: "addtodoTitle" },
            "Update To-Do"
        ),
        React.createElement(
            "ul",
            null,
            React.createElement(
                "li",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "title" },
                    "Title: "
                ),
                React.createElement("input", { id: "todoTitle", type: "text", name: "title", placeholder: props.title })
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "desc" },
                    "Description: "
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement("textarea", { id: "todoDesc", name: "desc", placeholder: props.desc })
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "type" },
                    "Type: "
                ),
                React.createElement(
                    "select",
                    { id: "todoType", name: "type", form: "todoForm" },
                    React.createElement(
                        "option",
                        { value: "Note" },
                        "Note"
                    ),
                    React.createElement(
                        "option",
                        { value: "Travel" },
                        "Travel"
                    ),
                    React.createElement(
                        "option",
                        { value: "School" },
                        "School"
                    ),
                    React.createElement(
                        "option",
                        { value: "Medical" },
                        "Medical"
                    ),
                    React.createElement(
                        "option",
                        { value: "Event" },
                        "Event"
                    ),
                    React.createElement(
                        "option",
                        { value: "Shopping" },
                        "Shopping"
                    )
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "date" },
                    "Date: "
                ),
                React.createElement("input", { id: "todoDate", type: "date", name: "date" })
            )
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { type: "hidden", name: "_id", value: props.id }),
        React.createElement("input", { id: "submitButton", className: "makeTodoSubmit", type: "submit", value: "Update ToDo" })
    );
};

var TodoForm = function TodoForm(props) {
    return React.createElement(
        "form",
        { id: "todoForm",
            name: "todoForm",
            onSubmit: handleTodo,
            action: "/maker",
            method: "POST",
            className: "todoForm"
        },
        React.createElement(
            "h2",
            { id: "addtodoTitle" },
            "Add New To-Do"
        ),
        React.createElement(
            "ul",
            null,
            React.createElement(
                "li",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "title" },
                    "Title: "
                ),
                React.createElement("input", { id: "todoTitle", type: "text", name: "title", placeholder: "Item Title" })
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "desc" },
                    "Description: "
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement("textarea", { id: "todoDesc", name: "desc" })
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "type" },
                    "Type: "
                ),
                React.createElement(
                    "select",
                    { id: "todoType", name: "type", form: "todoForm" },
                    React.createElement(
                        "option",
                        { value: "Note" },
                        "Note"
                    ),
                    React.createElement(
                        "option",
                        { value: "Travel" },
                        "Travel"
                    ),
                    React.createElement(
                        "option",
                        { value: "School" },
                        "School"
                    ),
                    React.createElement(
                        "option",
                        { value: "Medical" },
                        "Medical"
                    ),
                    React.createElement(
                        "option",
                        { value: "Event" },
                        "Event"
                    ),
                    React.createElement(
                        "option",
                        { value: "Shopping" },
                        "Shopping"
                    )
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "label",
                    { htmlFor: "date" },
                    "Date: "
                ),
                React.createElement("input", { id: "todoDate", type: "date", name: "date" })
            )
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { id: "submitButton", className: "makeTodoSubmit", type: "submit", value: "Add ToDo" })
    );
};

var TodoList = function TodoList(props) {
    if (props.todos.length === 0) {
        return React.createElement(
            "div",
            { className: "todoList" },
            React.createElement(
                "h3",
                { className: "emptyTodo" },
                "No ToDos yet, add one!"
            )
        );
    }

    var todoNodes = props.todos.map(function (todo) {
        return React.createElement(
            "div",
            { key: todo._id, className: "todo" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "h3",
                    { className: "todoTitle" },
                    "Title: ",
                    todo.title,
                    " "
                ),
                React.createElement(
                    "h3",
                    { className: "todoDesc" },
                    "Description: ",
                    todo.desc,
                    " "
                ),
                React.createElement(
                    "h3",
                    { className: "todoType" },
                    "Type: ",
                    todo.type,
                    " "
                ),
                React.createElement(
                    "h3",
                    { className: "todoDate" },
                    "Date: ",
                    todo.date,
                    " "
                )
            ),
            React.createElement(
                "div",
                { id: "todoOptions" },
                React.createElement(
                    "button",
                    { "class": "todoOption", id: "doneButton", value: todo._id, onClick: handleDeleteTodo },
                    "DONE"
                ),
                React.createElement(
                    "button",
                    { "class": "todoOption", id: "deleteButton", value: todo._id, onClick: handleDeleteTodo },
                    "DELETE"
                ),
                React.createElement(
                    "button",
                    { "class": "todoOption", id: "editButton", value: todo._id, onClick: loadUpdateForm },
                    "EDIT"
                )
            )
        );
    });

    return React.createElement(
        "div",
        { className: "todoList" },
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "h2",
            { id: "todolistTitle" },
            "Your To-Do List"
        ),
        todoNodes
    );
};

var loadTodosFromServer = function loadTodosFromServer(csrf, sortByDate) {
    sendAjax('GET', '/getTodos', null, function (data) {
        var props = {
            todos: data.todos,
            csrf: csrf
        };

        // sort todo list here if sortByDate is true
        if (sortByDate) {
            props.todos.sort(compareDates);
        }

        ReactDOM.render(React.createElement(TodoList, props), document.querySelector("#todos"));
    });
};

var setup = function setup(csrf) {
    var addButton = document.querySelector("#addButton");
    var listButton = document.querySelector("#listButton");
    var colorButton = document.querySelector("#color");
    var subscribeButton = document.querySelector("#subscribe");
    var sortButton = document.querySelector("#sort");

    addButton.addEventListener("click", function (e) {
        e.preventDefault();
        createTodoForm(csrf);
        return false;
    });

    listButton.addEventListener("click", function (e) {
        e.preventDefault();
        createTodoList(csrf);
        return false;
    });

    colorButton.addEventListener("click", function (e) {
        e.preventDefault();
        changeColorTheme();
        return false;
    });

    subscribeButton.addEventListener("click", function (e) {
        e.preventDefault();
        handleError("Unable to subscribe yet!");
        return false;
    });

    sortButton.addEventListener("click", function (e) {
        e.preventDefault();
        loadTodosFromServer(csrf, true);
        return false;
    });

    createTodoList(csrf); //default view
};

var createTodoForm = function createTodoForm(csrf) {
    ReactDOM.render(React.createElement(TodoForm, { csrf: csrf }), document.querySelector("#todos"));
};

var createUpdateTodoForm = function createUpdateTodoForm(csrf, id, title, description, type, date) {
    ReactDOM.render(React.createElement(UpdateTodoForm, { csrf: csrf, id: id, title: title, desc: description }), document.querySelector("#todos"));
};

var createTodoList = function createTodoList(csrf) {
    var props = {
        todos: [],
        csrf: csrf
    };
    ReactDOM.render(React.createElement(TodoList, props), document.querySelector("#todos"));

    loadTodosFromServer(csrf, false);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});

// function for sorting todo array by date 
function compareDates(a, b) {
    var aDate = a.date;
    var bDate = b.date;

    var comparison = 0;
    if (aDate > bDate) {
        comparison = 1;
    } else if (aDate < bDate) {
        comparison = -1;
    }

    return comparison;
}
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#todoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#todoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            console.log(xhr.responseText);
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
