import { InEndpoint } from "usb";
import { rave, setScene, toggleAutoSceneSwitcher } from "./obs";
import listen from "./listener"

import obsWS from 'obs-websocket-js'

const vendorId = 3163
const productId = 720

const obs = new obsWS()

;(async () => {
  let usb

  try {
    usb = await import("usb")
  } catch (error) {
    throw new Error(
      `Error while loading usb module (${error.message}).
      Are you running in WSL?`)
  }

  const cheapdeck = usb.findByIds(vendorId, productId)
  
  if (!cheapdeck) {
    throw new Error("Could not find cheapdeck device. Is the cheapdeck plugged in? WSL?")
  }

  const m = {
    NumLock: 83,
    "/": 84,
    "*": 85,
    "-": 86,
    7: 95,
    8: 96,
    9: 97,
    "+": 87,
    4: 92,
    5: 93,
    6: 94,
    Backspace: 42,
    1: 89,
    2: 90,
    3: 91,
    Enter: 88,
    0: 98,
    ",": 99
  }

  const actionMapping = {
    [m[0]]: () => toggleAutoSceneSwitcher(obs, true),
    [m[","]]: () => toggleAutoSceneSwitcher(obs, false),
    [m.Backspace]: () => setScene(obs, "Be Right Back"),
    [m["*"]]: () => rave(obs),
    [m[2]]: () => setScene(obs, "Secondary"),
    [m[1]]: () => setScene(obs, "Main")
  }

  cheapdeck.open()
  const cdInterface = cheapdeck.interface(0)
  cdInterface.claim()
  const endpoint = Array.from(cdInterface.endpoints)[0] as InEndpoint

  if (!endpoint) {
    throw new Error("no endpoint")
  }

  listen(cheapdeck, cmd => {
    if (actionMapping[cmd]) {
      actionMapping[cmd]()
    }
  })
  
  try {
    await obs.connect({ address: "localhost:4444" })
    console.log("OBS connected")
  } catch (error) {
    throw new Error(
      "Cannot connect to OBS. Is OBS running?\n" +
      "Error Object: " + JSON.stringify(error, null, 2)
    )
  }
  
  // await setTemporaryPath("Song Overlay", "D:/Documents/Git/cheapdeck/overlay/index.html", "D:/Documents/Git/cheapdeck/overlay/bruv.html")
})().catch(error => {
  console.error(error)
  process.exit()
})