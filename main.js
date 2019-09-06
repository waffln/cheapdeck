const hid = require("node-hid")

const keyboardInstances = hid.devices().filter(d => d.manufacturer === "HCT")

const path = keyboardInstances[1].path

const keyboard = new hid.HID(path)

keyboard.on("data", data => console.log("data", data))
keyboard.on("error", error => console.error("error", error))