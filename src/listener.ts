import usb, { InEndpoint } from "usb"

export default (device: usb.Device, callback: (cmdId: number) => void) => {
  if (!device) {
    throw new Error("no device")
  }

  device.open()
  const numpadInterface = device.interface(0)
  numpadInterface.claim()
  const endpoint = Array.from(numpadInterface.endpoints)[0] as InEndpoint

  if (!endpoint) {
    throw new Error("no endpoint")
  }

  const listen = () => {
    endpoint.transfer(8, (err, data) => {
      if (err) {
        throw err
      }

      if (!data) {
        return
      }
  
      const commands = data.toJSON().data.slice(2)
  
      for (const cmdId of commands) {
        callback(cmdId)
      }
  
      listen()
    })
  }

  listen()
}