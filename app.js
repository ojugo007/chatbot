const express = require("express");
const {createServer} = require("node:http")
const {Server} = require("socket.io")
const join = require("path").join
require("dotenv").config()

const PORT = process.env.PORT || 8080

const app = express()
const server = createServer(app)
const io = new Server(server)
app.use(express.static("public"))

io.on("connection", (socket)=>{
    const userId = socket.handshake.auth.userId;

    console.log( "a user connected " + userId + " " + socket.id)
    console.log(socket.listenerCount)
    // socket.on("greeting", (data)=>{
    //     console.log(data)
    // })
    socket.emit("greeting", "Welcome to Iya-Bashira Buka! My name na Padi, your assistant bot.")

    const options = [
        'Select 1 to Place an order',
        'Select 99 to checkout order',
        'Select 98 to see order history',
        'Select 97 to see current order',
        'Select 0 to cancel order'
    ]
    socket.emit("menus", options )

    socket.on("selected", (message)=>{
        console.log(message)
        switch(message){
            case '1':
                socket.emit( "request" ,`you selected ${message} to make an order`)
                // redirect to order page or show a list of food to order from
                break;
            case '99':
                socket.emit( "request" ,`you selected ${message} to checkout order`)
                // redirect to checkout page
                break;
            case '98':
                
                socket.emit("request",`you selected ${message} to see order history`)
                // fetch order history of this user
                break;
            case '97':
                socket.emit("request",`you selected ${message} to see current order`)
                // show the current order by checking the order id and comparing
                break;
            case '0':
                socket.emit("request",`you selected ${message} to cancel an order`)
                // cancel the current order, more like delete
                break;
            default:
                socket.emit("request","unkown selection")
                break;
        }
    })

    io.on("disconnect", (socket)=>{
        console.log(socket.id, " has disconnected")
    })
})

app.get("/", (req, res)=>{
    res.sendFile(join(__dirname , "index.html"))
})

server.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})


