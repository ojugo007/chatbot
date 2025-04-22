//     socket.on("selected", (message)=>{
//         console.log(message)
//         switch(message){
//             case '1':
//                 // socket.emit( "request" ,`you selected ${message} to make an order`)
//                 showMenu(socket)
//                 break;
//             case '99':
//                 socket.emit( "request" ,`you selected ${message} to checkout order`)
//                 // redirect to checkout page
//                 break;
//             case '98':
                
//                 socket.emit("request",`you selected ${message} to see order history`)
//                 // fetch order history of this user
//                 break;
//             case '97':
//                 socket.emit("request",`you selected ${message} to see current order`)
//                 // show the current order by checking the order id and comparing
//                 break;
//             case '0':
//                 socket.emit("request",`you selected ${message} to cancel an order`)
//                 // cancel the current order, more like delete
//                 break;
//             default:
//                 socket.emit("request","unkown selection")
//                 break;
//         }
//     })

//     io.on("disconnect", (socket)=>{
//         console.log(socket.id, " has disconnected")
//     })
// })