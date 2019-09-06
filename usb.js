const usb = require("usb")

const numpadDevice = usb.findByIds(0x046D, 0x0A4D)

numpadDevice.__open()
numpadDevice.__claimInterface(0)

numpadDevice.open()

const intf = numpadDevice.interface(0)

