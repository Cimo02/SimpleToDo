"use strict";

var handleTodo = function handleTodo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#todoTitle").val() == '') {
        handleError("A ToDo item title is required.");
        return false;
    }

    sendAjax('POST', $("#todoForm").attr("action"), $("#todoForm").serialize(), function () {
        loadDomosFromServer();
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
            "label",
            { htmlFor: "title" },
            "Title: "
        ),
        React.createElement("input", { id: "todoTitle", type: "text", name: "title", placeholder: "Item Title" }),
        React.createElement(
            "label",
            { htmlFor: "desc" },
            "Description: "
        ),
        React.createElement("input", { id: "todoDesc", type: "text", name: "desc", placeholder: "Item Description" }),
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
                { value: "travel" },
                "Travel"
            ),
            React.createElement(
                "option",
                { value: "school" },
                "School"
            ),
            React.createElement(
                "option",
                { value: "note" },
                "Note"
            ),
            React.createElement(
                "option",
                { value: "medical" },
                "Medical"
            ),
            React.createElement(
                "option",
                { value: "event" },
                "Event"
            ),
            React.createElement(
                "option",
                { value: "shopping" },
                "Shopping"
            )
        ),
        React.createElement(
            "label",
            { htmlFor: "date" },
            "Date: "
        ),
        React.createElement("input", { id: "todoDate", type: "date", name: "date", value: "2019-01-01" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeTodoSubmit", type: "submit", value: "Make ToDo" })
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
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
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
            )
        );
    });

    return React.createElement(
        "div",
        { className: "todoList" },
        todoNodes
    );
};

var loadTodosFromServer = function loadTodosFromServer() {
    sendAjax('GET', '/getTodos', null, function (data) {
        ReactDOM.render(React.createElement(TodoList, { todos: data.todos }), document.querySelector("#todos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(TodoForm, { csrf: csrf }), document.querySelector("#makeTodo"));

    ReactDOM.render(React.createElement(TodoList, { todos: [] }), document.querySelector("#todos"));

    loadTodosFromServer();
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
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
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
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
