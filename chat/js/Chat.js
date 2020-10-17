const username = "FunctionGer"
const token = "oauth:nmj91zmls0e5dz1bmdnex0q3jzlfaf"
const { chat } = new TwitchJs({ username, token })

chat.connect().then(() => {
  chat.join(username)
})

export default chat