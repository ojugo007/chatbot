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

    console.log(typeof(orderList), typeof(orderTotal))
    const message = `<p>your orders: ${orderList}</p>
                    <p>Total: &#8358;${orderTotal}</p>
                    <b>enter 99 to checkout</b>`

    socket.emit("request", message)
    // socket.emit("request", `your orders: ${orderList}... <br> Total: #${orderTotal} <br> enter 99 to checkout`)

    await cache.redis.set(key, JSON.stringify(orders), { EX: 24 * 60 * 60 * 7 })

}

const checkDbForOrder = async (key) => {
    const order = await cache.redis.get(key)
    if (order) {
        console.log("order: ", order)
        return order
    } else {
        console.log("no order found")
        return null
    }
}

const getOrderHistory = async(key) =>{
    console.log(key.split(":")[2])
    const userKey = key.split(":")[2]
    const keys  = await cache.redis.keys("*")
    const userKeys = keys.filter((ky)=> ky.split(":")[2] === userKey)
    if(userKeys.length === 0){
        return `no order history was found`
    }
    const allOrders = await cache.redis.mGet(userKeys)
    return allOrders
        
}

const cancelOrder = async(key)=>{
    const order = await cache.redis.get(key)
    if(!order){
        return "you do not have any order to cancel"
    }
    // clear data from redis here
    await cache.redis.del(key)
    return "your current order has been cancelled";
}






module.exports = { showMenu, checkDbForOrder, selectOrder, getOrderHistory, cancelOrder }