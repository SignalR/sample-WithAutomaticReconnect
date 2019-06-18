var connection = new signalR.HubConnectionBuilder()
    .withUrl("/chat")
    .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
    //.withAutomaticReconnect([0, 2000, 10000, 30000]) yields the default behavior
    .build();

connection.onreconnecting((error) => {
    disableUi(true);
    const li = document.createElement("li");
    li.textContent = `Connection lost due to error "${error}". Reconnecting.`;
    document.getElementById("messagesList").appendChild(li);
});

connection.onreconnected((connectionId) => {
    disableUi(false);
    const li = document.createElement("li");
    li.textContent = `Connection reestablished. Connected.`;
    document.getElementById("messagesList").appendChild(li);
});

function disableUi(isEnabled) {
    document.getElementById("leave-group").disabled = isEnabled;
    document.getElementById("join-group").disabled = isEnabled;
    document.getElementById("groupmsg").disabled = isEnabled;
}

connection.on("Send", function (message) {
    var li = document.createElement("li");
    li.textContent = message;
    document.getElementById("messagesList").appendChild(li);
});

document.getElementById("groupmsg").addEventListener("click", async (event) => {
    var userName = document.getElementById("user-name").value;
    var groupName = document.getElementById("group-name").value;
    var groupMsg = document.getElementById("group-message-text").value;
    try {
        await connection.invoke("SendMessageToGroup", userName, groupName, groupMsg);
    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});

document.getElementById("join-group").addEventListener("click", async (event) => {
    var userName = document.getElementById("user-name").value;
    var groupName = document.getElementById("group-name").value;
    try {
        await connection.invoke("AddToGroup", userName, groupName);
    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});

document.getElementById("leave-group").addEventListener("click", async (event) => {
    var userName = document.getElementById("user-name").value;
    var groupName = document.getElementById("group-name").value;
    try {
        await connection.invoke("RemoveFromGroup", userName, groupName);
    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});

async function start() {
    try {
        await connection.start();
        console.log("connected");
    } catch (err) {
        console.log(err);
    }
};

start();