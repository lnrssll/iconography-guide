import { Hono } from 'hono'
import { requireAdmin, clearAdminSession } from '../../middleware/auth'

const app = new Hono()

app.use('*', requireAdmin)

app.get('/', (c) => {
  return c.redirect('/admin/saints')
})

app.post('/logout', (c) => {
  clearAdminSession(c)
  return c.redirect('/')
})

export default app
