const HID = require("node-hid")

const devices = HID.devices()

for (device of devices) {

  try {
    const instance = new HID.HID(device.path)
    instance.on("data", console.log)
    instance.on("error", console.error)
  } catch (err) {
    continue
  }

}