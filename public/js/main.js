
const greeting = document.querySelector("#bot-welcome-message");
const option_container = document.querySelector(".option-container");
const option_grid = document.querySelector("#option-grid");
const list = document.querySelector("#list");
const user_selection = document.querySelector("#user-message");
const send_message = document.querySelector("#send-message");
const message_box = document.querySelector("#message-box");



let userId = localStorage.getItem("userId")
if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId)
}
// const socket = io("http://localhost:8080", { auth: { userId } })
const socket = io(`${location.origin}`, {
    auth: { userId },
    transports: ['websocket'],
});

socket.on("connect", ()=>{
    console.log("connect was made before greeting")
})

socket.on("greeting", (data) => {
    console.log(data)

    setTimeout(() => {
        greeting.innerHTML = data
    }, 1000);


})

socket.on("menus", (options) => {
    option_container.classList.add("hidden")
    function getList() {
        for (option of options) {
            option_container.classList.remove("hidden")
            const list = document.createElement('span')
            const listText = document.createTextNode(option)
            list.appendChild(listText)
            option_grid.appendChild(list)
        }

    }

    setTimeout(() => {
        getList()
    }, 2000);

    
})


const handleSubmit = (e) => {
    e.preventDefault();
    const message = list.value
    socket.emit("selected", message)
    socket.emit("menu-selected", message)
    const user_container = document.createElement('div');
    user_container.classList.add("selected-options");
    const user_message_el = document.createElement('p');
    user_message_el.classList.add("user-message")
    const user_profile_image = document.createElement("img")
    user_profile_image.width = 30;
    user_profile_image.height = 30;
    user_profile_image.alt = "user profile image";
    user_profile_image.src = "/images/user.png";
    const user_text = document.createTextNode(message)
    user_message_el.appendChild(user_text)
    user_container.appendChild(user_message_el)
    user_container.appendChild(user_profile_image)
    message_box.appendChild(user_container)
    list.value = ""
}

send_message.removeEventListener("submit", handleSubmit)
send_message.addEventListener("submit", handleSubmit)

socket.on("request", (message) => {
    const chat_section = document.querySelector(".chat-section")

    const bot_reponse_container = document.createElement('div');
    bot_reponse_container.classList.add("welcome-message-container");
    const bot_message_el = document.createElement('p');
    bot_message_el.classList.add("bot-response")
    const bot_image = document.createElement("img")
    bot_image.width = 30;
    bot_image.height = 30;
    bot_image.alt = "bot image";
    bot_image.src = "/images/bot.png";
    if (message) {
        if (typeof (message) == "string") {
            bot_message_el.innerHTML = message
            // bot_message_el.appendChild(document.createTextNode(message))
        } else if (Array.isArray(message)) {
            const formattedMenu = message.map((msg) => {
                return `${msg.number}.  ${msg.name} ------> &#8358;${msg.price}`
            }).join("<br>")

            bot_message_el.innerHTML = formattedMenu
            // bot_message_el.appendChild(document.createTextNode(formattedMenu))
        }   
        bot_reponse_container.appendChild(bot_image)
        bot_reponse_container.appendChild(bot_message_el)
        message_box.appendChild(bot_reponse_container)
        chat_section.scrollTo({
            top: chat_section.scrollHeight,
            behavior: 'smooth'
        });
    }

})

socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
    console.warn("Socket disconnected:", reason);
});