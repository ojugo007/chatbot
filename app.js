const express = require("express");
const {createServer} = require("node:http")
const {Server} = require("socket.io")
const join = require("path").join
require("dotenv").config()
const cache = require("./redisClient")
const menus = require("./menu")
const {showMenu, checkDbForOrder, selectOrder } = require("./orderLogic")

const PORT = process.env.PORT || 8080

const app = express()
const server = createServer(app)
cache.connect()
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

    let userState = {};

    socket.on("selected", (message)=>{
        console.log(message)
        const currentState = userState[socket.id] || "main-menu"
        console.log("current state: ", currentState)
        const userId = socket.handshake.auth.userId;
        const key = `user:${socket.id}:${userId}`

        switch(currentState){
            
            case "main-menu":
                console.log("user state: ", userState)

                switch(message){

                    case '1':
                        userState[socket.id] = "ordering"
                        console.log(userState)
                        showMenu(socket)

                        socket.on("menu-selected", (selection)=>{
                            selectOrder(selection, socket, key)

                        })
                        break;
                    case '99':
                        // socket.emit( "request" ,`you selected ${message} to checkout order`)
                        // redirect to checkout page
                        checkDbForOrder(socket,key).then((order)=>{
                            if(order){
                                socket.emit("request", `you have an order with id ${order}`)
                            }else{
                                socket.emit("request", "you have no order yet")
                            }
                        }).catch((err)=>{
                            console.log(err)
                            socket.emit("request", "an error occurred while checking your order")
                        })

                        break;
                    case '98':
                        
                        socket.emit("request",`you selected ${message} to see order history`)
                        // fetch order history of this user
                        break;
                    case '97':
                        checkDbForOrder(socket,key).then((order)=>{
                            if(order){
                                socket.emit("request", order)
                                userState[socket.id] = "main-menu"
                            }else{
                                socket.emit("request", "you have no order yet")
                            }
                        }).catch((err)=>{
                            console.log(err)
                            socket.emit("request", "an error occurred while checking your order")
                        })
                        break;
                    case '0':
                        socket.emit("request",`you selected ${message} to cancel an order`)
                        // cancel the current order, more like delete
                        break;
                    default:
                        socket.emit("request","unkown selection")
                        break;
                }
                break;
            case "ordering":
                switch(message){
                    case "2":
                        break;
                    case "3":
                        break;
                    case "4":
                        break;
                    case "5":
                        break;
                    case "6":
                        break;
                    case "7":
                        break;
                    case "8":
                        break;
                    case "9":
                        break;

                    case "99":
                        checkDbForOrder(socket,key).then((order)=>{
                            if(order){
                                // socket.emit("request", `you have an order with id ${order}`)
                                socket.emit("request", `checkout`)
                                
                                userState[socket.id] = "main-menu"
                            }else{
                                socket.emit("request", "you have no order yet")
                            }
                        }).catch((err)=>{
                            console.log(err)
                            socket.emit("request", "an error occurred while checking your order")
                        })
                        break;
                    default:
                        socket.emit("request", "❌ invalid food selection, try again")
                        break;
                    }
                    break;
            default:
                userState[socket.id] = "main-menu";
                socket.emit("request", "Welcome! Choose an option:\n1. Place Order\n99. Checkout\n98. Order history\n97. 97 Current order\n0. Cancel order");
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


