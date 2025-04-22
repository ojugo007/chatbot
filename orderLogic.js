const menus = require("./menu")
const cache = require("./redisClient")

function showMenu(socket) {
    socket.emit("request", menus)

}

const selectOrder = async (selection, socket, key) => {
    const selectedItem = menus.find((menu) => menu.id === selection)

    if (!selectedItem) {
        return "invalid selection"
    }

    const existingOrder = await cache.redis.get(key)
    let orders = []
    if (existingOrder) {
        orders = JSON.parse(existingOrder)
    }

    orders.push(selectedItem);
    // console.log(orders)
    const orderTotal = orders.map((order)=> order.price).reduce((cum, curr)=> cum + curr)
    const orderList = orders.map((order)=> order.name).reduce((cum, curr)=> cum + ", " + curr) 

    socket.emit("request", `your orders: ${orderList}... Total: #${orderTotal}`)

    await cache.redis.set(key, JSON.stringify(orders), { EX: 24 * 60 * 60 * 7 })

}

const checkDbForOrder = async (socket, key) => {
    const order = await cache.redis.get(key)
    if (order) {
        console.log("order: ", order)
        return order
    } else {
        console.log("no order found")
        return null
    }
}







module.exports = { showMenu, checkDbForOrder, selectOrder }