import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

const getBadges = (() => {
  let globalBadges = null

  return () => {
    if (globalBadges === null) {
      globalBadges = fetch("https://badges.twitch.tv/v1/badges/global/display")
        .then(r => r.json())
    }

    return globalBadges
  }
})()

Vue.component("Test", {
  data: () => ({
    foo: "foo!"
  }),
  created() {
    setTimeout(() => {
      this.foo = "bar!"
    }, 1000)
  },
  template: `<p>{{ foo }}</p>`
})

Vue.component("Badge", {
  props: {
    badgeData: Array
  },
  data: () => ({
    url: ""
  }),
  created() {
    this.load()
  },
  methods: {
    load() {
      const [badgeName, version] = this.badgeData

      getBadges().then(({ badge_sets }) => {
        const url = badge_sets[badgeName].versions[parseInt(version, 10)].image_url_1x
        this.url = url
      })
    }
  },
  template: `
    <span>
      <img :src="url"/>
      <span>{{ url }}</span>
    </span>
  `
})

const getEmoteUrl = id =>
  `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`

export default Vue.component("Message", {
  props: {
    badges: Object,
    userName: String,
    content: String,
    emotes: Array
  },
  computed: {
    emojifiedMessage() {
      const emojiNames = this.emotes.map(emote =>
          this.content.slice(emote.start, emote.end + 1))

      return this.emotes.reduce((prevMarkup, emote, i) =>
        prevMarkup.replace(
          emojiNames[i],
          `<img src="${getEmoteUrl(emote.id)}"/>`
        ), this.content
      )
    }
  },
  template: `
    <div class="message">
      <Badge
        v-for="badgeData in Object.entries(badges)"
        :key="badgeData[0]"
        :badgeData="badgeData"
      />
      <span>{{ userName }}: </span>
      <span v-html="emojifiedMessage"></span>
      <Test/>
    </div>
  `
})