"use strict"

const usb = require("usb"),
      vendorId = 3163,
      productId = 720,
      obsWS = require("obs-websocket-js")

const device = usb.findByIds(vendorId, productId),
      obs = new obsWS()

device.open()
const numpadInterface = device.interface(0)
numpadInterface.claim()
const endpoint = [...numpadInterface.endpoints][0]

obs.connect({
  address: "localhost:4444"
}).then(() => console.log("OBS connected"))

const listen = () => {
  endpoint.transfer(8, (err, data) => {
    if (err) throw err

    const commands = data.toJSON().data.slice(2)

    for (const cmd of commands) {
      switch (cmd) {
        case 83: break
        case 84: break
        case 85: break
        case 86: break
        case 95: break
        case 96: break
        case 97: break
        case 87: break
        case 92: break
        case 93: break
        case 94: break
        case 42: setScene("Main Flipped"); break
        case 89: setScene("Players"); break
        case 90: setScene("Commentators"); break
        case 91: setScene("Venue", "Stinger"); break
        case 88: setScene("Main"); break
        case 98: startRecording(); break
        case 99: stopRecording(); break
      }
    }

    listen()
  })
}

listen()

const startRecording = () => obs.send("StartRecording")

const stopRecording = () => obs.send("StopRecording")

const setTransition = transition => obs.send("SetCurrentTransition", {"transition-name": transition})

const setScene = (scene, transition = "Fade") => {
  return obs.send("GetCurrentScene")
    /*.then(res => {
      return setTransition(["Venue"].includes(res.name) ? "Stinger" : transition)
    })*/
    .then(() => obs.send("SetCurrentScene", {"scene-name": scene}))
}