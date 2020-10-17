import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

export default Vue.component("Track", {
  props: {
    artist: String,
    title: String
  },
  template: `
    <div class="track">
      <span>{{ artist }}</span>
      <span> - </span>
      <span>{{ title }}</span>
    </div>
  `
})