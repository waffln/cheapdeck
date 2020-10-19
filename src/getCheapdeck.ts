export default async (vendorId: number, productId: number) => {
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

  return cheapdeck
}