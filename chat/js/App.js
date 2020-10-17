import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

import Message from "./Message.js"
import Track from "./Track.js"
import chat from "./Chat.js"

Vue.component("App", {
  data: () => ({
    entries: [
      { type: "track", data: {
        artist: "Skrillex", title: "Bangarang"
      } }
    ]
  }),
  created() {
    chat.on("PRIVMSG", this.addChat)

    this.addChat({
      message: "This is a text LUL !",
      tags: {
        displayName: "henlo",
        emotes: [
          { id: "425618", start: 15, end: 18 }
        ],
        badges: {}
      }
    })

    this.addChat({
      timestamp: "2020-07-19T13:50:42.924Z",
      command: "PRIVMSG", event: "PRIVMSG",
      message: "awd",
      tags: {
        badgeInfo: "subscriber/12",
        badges: {
          broadcaster: "1",
          subscriber: "0"
        },
        displayName: "FunctionGer",
        emotes: [],
        flags: "",
        emoteSets: [],
        username: "functionger"
      }
    })
  },
  methods: {
    addChat(event) {
      this.entries.push({
        type: "message",
        data: {
          timestamp: event.timestamp,
          badges: event.tags.badges,
          userName: event.tags.displayName,
          content: event.message,
          emotes: event.tags.emotes
        }
      })
    }
  },
  components: {
    Message, Track
  },
  template: `
    <div id="app">
      <template v-for="entry in entries">
        <Message
          v-if="entry.type === 'message'"
          :userName="entry.data.userName"
          :content="entry.data.content"
          :emotes="entry.data.emotes"
          :badges="entry.data.badges"
        />
        <Track
          v-if="entry.type === 'track'"
          :artist="entry.data.artist"
          :title="entry.data.title"
        />
      </template>
    </div>
  `
})

new Vue({
  el: "#app",
  template: "<App/>"
})