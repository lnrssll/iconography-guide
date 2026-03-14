import { Hono } from 'hono'
import { db } from '../db/client'
import { listSaints } from '../db/queries/list-saints'
import { getSaint } from '../db/queries/get-saint'
import { listCurrentSectionsBySaint } from '../db/queries/list-current-sections-by-saint'
import { listActiveLinksBySaint } from '../db/queries/list-active-links-by-saint'
import { listFeastDaysBySaint } from '../db/queries/list-feast-days-by-saint'

const app = new Hono()

app.get('/', (c) => {
  const saints = listSaints(db)
  return c.render(
    <main class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold mb-2">Iconography Guide</h1>
      <p class="text-gray-600 mb-8">St. Katherine's Orthodox Church</p>
      <ul class="space-y-2">
        {saints.map((s) => (
          <li key={s.id}>
            <a href={`/saints/${s.id}`} class="text-blue-700 hover:underline text-lg">
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </main>,
    { title: 'Iconography Guide' }
  )
})

app.get('/saints/:id', (c) => {
  const id = Number(c.req.param('id'))
  const saint = getSaint(db, { id })
  if (!saint) return c.notFound()

  const sections = listCurrentSectionsBySaint(db, { saint_id: id })
  const links = listActiveLinksBySaint(db, { saint_id: id })
  const feastDays = listFeastDaysBySaint(db, { saint_id: id })

  return c.render(
    <main class="max-w-2xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold mb-1">{saint.name}</h1>

      {feastDays.length > 0 && (
        <p class="text-gray-500 mb-1">
          Feast {feastDays.length === 1 ? 'Day' : 'Days'}:{' '}
          {feastDays.map((f, i) => (
            <span key={f.id}>{i > 0 ? ', ' : ''}{f.label}</span>
          ))}
        </p>
      )}

      {(saint.birth_date || saint.repose_date) && (
        <p class="text-gray-500 mb-6">
          {saint.birth_date && <span>Born: {saint.birth_date}</span>}
          {saint.birth_date && saint.repose_date && <span> · </span>}
          {saint.repose_date && <span>Reposed: {saint.repose_date}</span>}
        </p>
      )}

      <div class="space-y-6 mt-6">
        {sections.map((s) => (
          <section key={s.id}>
            <h2 class="text-xl font-semibold mb-2">{s.title}</h2>
            <div class="text-gray-800 whitespace-pre-wrap">{s.body}</div>
          </section>
        ))}
      </div>

      {links.length > 0 && (
        <div class="mt-10 border-t pt-6">
          <h2 class="text-lg font-semibold mb-3">Further Reading</h2>
          <ul class="space-y-1">
            {links.map((l) => (
              <li key={l.id}>
                <a href={l.url} class="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div class="mt-10 text-sm text-gray-400">
        <a href="/">← All saints</a>
      </div>
    </main>,
    { title: saint.name }
  )
})

export default app
