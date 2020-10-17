import obsWS from "obs-websocket-js"

export const setScene = (obs: obsWS, scene: string) => obs.send("SetCurrentScene", {"scene-name": scene})

export const switcherToSecondary = async (obs: obsWS) => {
  if (!autoSceneSwitcher) {
    return
  }

  await setScene(obs, "Secondary")

  setTimeout(switcherToMain, 30 * 1000)
}

export const switcherToMain = async (obs: obsWS) => {
  if (!autoSceneSwitcher) {
    return
  }

  await setScene(obs, "Main")

  setTimeout(switcherToSecondary, 60 * 1000)
}

let autoSceneSwitcher = false
export const toggleAutoSceneSwitcher = async (obs: obsWS, enable: boolean) => {
  if (!enable) {
    autoSceneSwitcher = false
  } else {
    autoSceneSwitcher = true
    const { name: currentSceneName } = await obs.send("GetCurrentScene")
    currentSceneName === "Main" ? switcherToSecondary(obs) : switcherToMain(obs)
  }
}

export const setTemporaryPath = async (obs: obsWS, sourceName: string, originalPath: string, temporaryPath: string) => {
  const setSetting = (path: string) => obs.send("SetSourceSettings", {
    sourceName: sourceName,
    sourceType: "browser_source",
    sourceSettings: {
      local_file: path
    }
  })

  await setSetting(temporaryPath)

  return new Promise(res => {
    setTimeout(() => {
      setSetting(originalPath).then(res)
    }, 20) // kinda arbitrary... but not my fault lel
  })
}

export const rave = async (obs: obsWS) => {
  const { name: previousScene } = await obs.send("GetCurrentScene")
  
  let count = 0
  const sequence = setInterval(() => {

    if (count > 50) {
      clearInterval(sequence)
      setScene(obs, previousScene)
      return
    }

    if (count % 2 === 0) {
      setScene(obs, "Main")
    } else {
      setScene(obs, "Secondary")
    }

    count++
  }, 16 * 2)
}