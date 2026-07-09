import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  studio: {
    port: 5555,
  },
  migrate: {
    url: 'file:./dev.db',
  }
})
