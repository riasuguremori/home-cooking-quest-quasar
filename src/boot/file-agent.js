import { defineBoot } from '#q-app/wrappers'

import VueFileAgentNext from '@boindil/vue-file-agent-next'
import '@boindil/vue-file-agent-next/dist/vue-file-agent-next.css' // 務必引入 CSS

export default defineBoot(({ app }) => {
  app.use(VueFileAgentNext)
})
