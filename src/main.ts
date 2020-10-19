import { InEndpoint } from "usb";
import { rave, setScene, toggleAutoSceneSwitcher } from "./obs";
import listen from "./listener"
import m from "./mapping"

import obsWS from 'obs-websocket-js'
import getCheapdeck from "./getCheapdeck";

const vendorId = 3163
const productId = 720

const obs = new obsWS()

;(async () => {
  const cheapdeck = await getCheapdeck(vendorId, productId)

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