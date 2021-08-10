require('dotenv').config();
const app = require('express')();

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["POST", "GET"]
    }
});

let userTotal = [];

io.on('connection', (socket) => {

    socket.on("user-connect", (user) => {

        userTotal.push(user);
        console.log(userTotal);

    });

    socket.on('req-connection', (newUser) => {

        const user = newUser;
        const sockID = socket.id;
        let count = 0;

        userTotal.forEach(index => {

            if (index.user === newUser) {

                socket.emit('res-connection', false);
                count += 1;
                return;

            } 

        });

        if(!count > 0){
            userTotal.push({ user, sockID });
            socket.emit('res-connection', true);
            console.log(userTotal)
        }

    });

    socket.on('req-logout', (userDel) => {
        

        const res = userTotal.filter((userDelete) => {
            return userDelete.user !== userDel;
        })
        userTotal = res;

    });

});

server.listen(process.env.PORT || 8000, () => {
    console.log(`Servidor escuchando en puerto: ${process.env.PORT || 8000}`);
})