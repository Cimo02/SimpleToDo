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
        loadTodosFromServer(csrf);
    });

    return false;
};

var handleDeleteTodo = function handleDeleteTodo(e) {
    e.preventDefault();

    $("#todoMessage").animate({ width: 'hide' }, 350);

    var csrf = $("input[name=_csrf]").val();
    var url = "_id=" + e.target.value + "&_csrf=" + csrf;

    sendAjax('DELETE', "/deleteTodo", url, function (data) {
        loadTodosFromServer(csrf);
    });

    return false;
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
        React.createElement("input", { className: "makeTodoSubmit", type: "submit", value: "Add ToDo" })
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
                    { id: "doneButton", value: todo._id, onClick: handleDeleteTodo },
                    "DONE"
                ),
                React.createElement(
                    "button",
                    { id: "deleteButton", value: todo._id, onClick: handleDeleteTodo },
                    "DELETE"
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

var loadTodosFromServer = function loadTodosFromServer(csrf) {
    sendAjax('GET', '/getTodos', null, function (data) {
        var props = {
            todos: data.todos,
            csrf: csrf
        };
        ReactDOM.render(React.createElement(TodoList, props), document.querySelector("#todos"));
    });
};

var setup = function setup(csrf) {
    var addButton = document.querySelector("#addButton");
    var listButton = document.querySelector("#listButton");
    var colorButton = document.querySelector("#color");

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
        handleError("Unlock this feature by subscribing!");
        return false;
    });

    createTodoList(csrf); //default view
};

var createTodoForm = function createTodoForm(csrf) {
    ReactDOM.render(React.createElement(TodoForm, { csrf: csrf }), document.querySelector("#todos"));
};

var createTodoList = function createTodoList(csrf) {
    var props = {
        todos: [],
        csrf: csrf
    };
    ReactDOM.render(React.createElement(TodoList, props), document.querySelector("#todos"));

    loadTodosFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
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
