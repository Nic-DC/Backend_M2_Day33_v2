let users = [];

export const newConnectionHandler = (client) => {
  console.log("NEW CONNECTION - id: ", client.id);

  // 1. Emit a "welcome" event to the connected client
  client.emit("greetOnMount", { message: `Hello ${client.id}` });

  // 2. Listen to an event emitted by the FE called "submitUserName", this event is going to contain the username in the payload
  client.on("submitUserName", (payload) => {
    console.log(payload);
    // 2.1 Whenever we receive the username, we keep track of that together with the socket.id
    users.push({ username: payload.username, socketId: client.id });

    // 2.2 Then we have to send the list of online users to the current user that just logged in
    client.emit("usersLoggedIn", users);

    // 2.3 We have also to inform everybody (but not the sender) of the new user which just joined
    client.broadcast.emit("updateUsersList", users);
    console.log("the updated users list: ", users);
  });

  // 3. Listen to "sendMessage" event, this is received when an user sends a new message
  client.on("submitMessage", (message) => {
    console.log("NEW SUBMITTED MESSAGE:", message);
    // 3.1 Whenever we receive that new message we have to propagate that message to everybody but not sender
    client.broadcast.emit("submittedMessage", message);
  });

  // 4. Listen to an event called "disconnect", this is NOT a custom event!! This event happens when an user closes browser/tab
  client.on("disconnect", () => {
    // 4.1 Server shall update the list of users by removing the one that has disconnected
    users = users.filter((user) => user.socketId !== client.id);
    // 4.2 Let's communicate the updated list all the remaining clients
    client.broadcast.emit("updateUsersList", users);
  });
};
