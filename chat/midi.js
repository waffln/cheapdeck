const midi = require("easymidi")

const input = new midi.Input("LoopBe Internal MIDI 0")

for (const prop of ["noteon", "noteoff", "poly aftertouch", "cc", "program", "channel aftertouch", "pitch", "position", "mtc", "select", "start", "continue", "stop", "activesense", "reset", "sysex", "clock"]) {
  input.on(prop, (...any) => {
    console.log(prop, Date.now().toString(), any)
  })
}
