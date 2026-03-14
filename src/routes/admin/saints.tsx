import { Hono } from 'hono'
import { requireAdmin } from '../../middleware/auth'
import { db } from '../../db/client'
import { listSaints } from '../../db/queries/list-saints'
import { getSaint } from '../../db/queries/get-saint'
import { insertSaint } from '../../db/queries/insert-saint'
import { updateSaint } from '../../db/queries/update-saint'
import { listCurrentSectionsBySaint } from '../../db/queries/list-current-sections-by-saint'
import { insertSection } from '../../db/queries/insert-section'
import { markSectionSuperseded } from '../../db/queries/mark-section-superseded'
import { markSectionDeleted } from '../../db/queries/mark-section-deleted'
import { listActiveLinksBySaint } from '../../db/queries/list-active-links-by-saint'
import { insertLink } from '../../db/queries/insert-link'
import { softDeleteLink } from '../../db/queries/soft-delete-link'
import { listFeastDaysBySaint } from '../../db/queries/list-feast-days-by-saint'
import { insertFeastDay } from '../../db/queries/insert-feast-day'
import { deleteFeastDay } from '../../db/queries/delete-feast-day'

const app = new Hono()

app.use('*', requireAdmin)

// List saints
app.get('/', (c) => {
  const saints = listSaints(db)
  return c.render(
    <main class="max-w-3xl mx-auto px-4 py-10">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Saints</h1>
        <div class="flex gap-4 items-center">
          <a href="/admin/saints/new" class="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800">
            Add Saint
          </a>
          <form method="post" action="/admin/logout">
            <button type="submit" class="text-sm text-gray-500 hover:underline">Logout</button>
          </form>
        </div>
      </div>
      <ul class="divide-y">
        {saints.map((s) => (
          <li key={s.id} class="py-3 flex items-center justify-between">
            <span class="font-medium">{s.name}</span>
            <div class="flex gap-4 text-sm">
              <a href={`/saints/${s.id}`} class="text-gray-500 hover:underline" target="_blank">View</a>
              <a href={`/admin/saints/${s.id}`} class="text-blue-700 hover:underline">Edit</a>
            </div>
          </li>
        ))}
      </ul>
    </main>,
    { title: 'Admin – Saints' }
  )
})

// New saint form
app.get('/new', (c) => {
  return c.render(
    <main class="max-w-xl mx-auto px-4 py-10">
      <h1 class="text-2xl font-bold mb-6">Add Saint</h1>
      <form method="post" action="/admin/saints" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input name="name" required class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Birth Date</label>
          <input name="birth_date" placeholder="e.g. c. 35 AD" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Repose Date</label>
          <input name="repose_date" placeholder="e.g. 107 AD" class="w-full border rounded px-3 py-2" />
        </div>
        <div class="flex gap-3">
          <button type="submit" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Create</button>
          <a href="/admin/saints" class="px-4 py-2 text-gray-600 hover:underline">Cancel</a>
        </div>
      </form>
    </main>,
    { title: 'Add Saint' }
  )
})

// Create saint
app.post('/', async (c) => {
  const form = await c.req.formData()
  const name = String(form.get('name') ?? '').trim()
  const birth_date = String(form.get('birth_date') ?? '').trim() || null
  const repose_date = String(form.get('repose_date') ?? '').trim() || null
  if (!name) return c.redirect('/admin/saints/new')
  const result = insertSaint(db, { name, birth_date, repose_date })
  return c.redirect(`/admin/saints/${result.lastInsertRowid}`)
})

// Edit saint page
app.get('/:id', (c) => {
  const id = Number(c.req.param('id'))
  const saint = getSaint(db, { id })
  if (!saint) return c.notFound()

  const sections = listCurrentSectionsBySaint(db, { saint_id: id })
  const links = listActiveLinksBySaint(db, { saint_id: id })
  const feastDays = listFeastDaysBySaint(db, { saint_id: id })

  return c.render(
    <main class="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <div class="flex items-center justify-between">
        <a href="/admin/saints" class="text-sm text-gray-500 hover:underline">← All saints</a>
        <a href={`/saints/${saint.id}`} target="_blank" class="text-sm text-blue-700 hover:underline">View public page ↗</a>
      </div>

      {/* Basic info */}
      <section>
        <h1 class="text-2xl font-bold mb-4">{saint.name}</h1>
        <form method="post" action={`/admin/saints/${saint.id}`} class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input name="name" value={saint.name} required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Birth Date</label>
            <input name="birth_date" value={saint.birth_date ?? ''} placeholder="e.g. c. 35 AD" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Repose Date</label>
            <input name="repose_date" value={saint.repose_date ?? ''} placeholder="e.g. 107 AD" class="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
            Save Changes
          </button>
        </form>
      </section>

      {/* Feast Days */}
      <section class="border-t pt-6">
        <h2 class="text-lg font-semibold mb-4">Feast Days</h2>
        {feastDays.length > 0 && (
          <ul class="space-y-2 mb-4">
            {feastDays.map((f) => (
              <li key={f.id} class="flex items-center justify-between">
                <span class="text-sm">{f.label}</span>
                <form method="post" action={`/admin/saints/${saint.id}/feast-days/${f.id}/delete`}>
                  <button type="submit" class="text-xs text-red-600 hover:underline">Remove</button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form method="post" action={`/admin/saints/${saint.id}/feast-days`} class="flex gap-2">
          <input name="label" placeholder="e.g. Jan. 18" class="border rounded px-3 py-1 text-sm flex-1" />
          <input name="sort_month" type="number" placeholder="Month #" class="border rounded px-3 py-1 text-sm w-24" />
          <input name="sort_day" type="number" placeholder="Day #" class="border rounded px-3 py-1 text-sm w-20" />
          <button type="submit" class="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800">Add</button>
        </form>
      </section>

      {/* Sections */}
      <section class="border-t pt-6">
        <h2 class="text-lg font-semibold mb-4">Sections</h2>
        <div class="space-y-6 mb-6">
          {sections.map((s) => (
            <div key={s.id} class="border rounded p-4">
              <form method="post" action={`/admin/saints/${saint.id}/sections/${s.id}/edit`} class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Title</label>
                  <input name="title" value={s.title} required class="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Body</label>
                  <textarea name="body" rows={6} required class="w-full border rounded px-3 py-2 text-sm">{s.body}</textarea>
                </div>
                <input name="sort_order" type="hidden" value={String(s.sort_order)} />
                <div class="flex gap-3">
                  <button type="submit" class="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800">Save</button>
                  <form method="post" action={`/admin/saints/${saint.id}/sections/${s.id}/delete`}>
                    <button type="submit" class="text-xs text-red-600 hover:underline">Remove</button>
                  </form>
                </div>
              </form>
            </div>
          ))}
        </div>

        <details class="border rounded p-4">
          <summary class="cursor-pointer text-sm font-medium">Add Section</summary>
          <form method="post" action={`/admin/saints/${saint.id}/sections`} class="space-y-3 mt-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Title</label>
              <input name="title" required class="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Body</label>
              <textarea name="body" rows={6} required class="w-full border rounded px-3 py-2 text-sm"></textarea>
            </div>
            <input name="sort_order" type="hidden" value={String(sections.length)} />
            <button type="submit" class="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800">Add Section</button>
          </form>
        </details>
      </section>

      {/* Links */}
      <section class="border-t pt-6">
        <h2 class="text-lg font-semibold mb-4">Links</h2>
        {links.length > 0 && (
          <ul class="space-y-2 mb-4">
            {links.map((l) => (
              <li key={l.id} class="flex items-center justify-between">
                <div class="text-sm">
                  <span class="font-medium">{l.label}</span>{' '}
                  <a href={l.url} target="_blank" class="text-gray-500 hover:underline text-xs">{l.url}</a>
                </div>
                <form method="post" action={`/admin/saints/${saint.id}/links/${l.id}/delete`}>
                  <button type="submit" class="text-xs text-red-600 hover:underline">Remove</button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form method="post" action={`/admin/saints/${saint.id}/links`} class="flex gap-2">
          <input name="label" placeholder="Label" class="border rounded px-3 py-1 text-sm flex-1" />
          <input name="url" type="url" placeholder="https://..." class="border rounded px-3 py-1 text-sm flex-1" />
          <button type="submit" class="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800">Add</button>
        </form>
      </section>
    </main>,
    { title: `Edit – ${saint.name}` }
  )
})

// Update saint basic info
app.post('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const form = await c.req.formData()
  const name = String(form.get('name') ?? '').trim()
  const birth_date = String(form.get('birth_date') ?? '').trim() || null
  const repose_date = String(form.get('repose_date') ?? '').trim() || null
  if (name) updateSaint(db, { name, birth_date, repose_date }, { id })
  return c.redirect(`/admin/saints/${id}`)
})

// Add feast day
app.post('/:id/feast-days', async (c) => {
  const id = Number(c.req.param('id'))
  const form = await c.req.formData()
  const label = String(form.get('label') ?? '').trim()
  const sort_month = Number(form.get('sort_month')) || null
  const sort_day = Number(form.get('sort_day')) || null
  if (label) insertFeastDay(db, { saint_id: id, label, sort_month, sort_day })
  return c.redirect(`/admin/saints/${id}`)
})

// Delete feast day
app.post('/:id/feast-days/:fid/delete', (c) => {
  const fid = Number(c.req.param('fid'))
  deleteFeastDay(db, { id: fid })
  return c.redirect(`/admin/saints/${c.req.param('id')}`)
})

// Add section
app.post('/:id/sections', async (c) => {
  const id = Number(c.req.param('id'))
  const form = await c.req.formData()
  const title = String(form.get('title') ?? '').trim()
  const body = String(form.get('body') ?? '').trim()
  const sort_order = Number(form.get('sort_order')) || 0
  if (title && body) insertSection(db, { saint_id: id, title, body, sort_order })
  return c.redirect(`/admin/saints/${id}`)
})

// Edit section (creates new revision)
app.post('/:id/sections/:sid/edit', async (c) => {
  const id = Number(c.req.param('id'))
  const sid = Number(c.req.param('sid'))
  const form = await c.req.formData()
  const title = String(form.get('title') ?? '').trim()
  const body = String(form.get('body') ?? '').trim()
  const sort_order = Number(form.get('sort_order')) || 0
  if (title && body) {
    const result = insertSection(db, { saint_id: id, title, body, sort_order })
    markSectionSuperseded(db, { superseded_by: result.lastInsertRowid }, { id: sid })
  }
  return c.redirect(`/admin/saints/${id}`)
})

// Delete section
app.post('/:id/sections/:sid/delete', (c) => {
  const sid = Number(c.req.param('sid'))
  markSectionDeleted(db, { id: sid })
  return c.redirect(`/admin/saints/${c.req.param('id')}`)
})

// Add link
app.post('/:id/links', async (c) => {
  const id = Number(c.req.param('id'))
  const form = await c.req.formData()
  const label = String(form.get('label') ?? '').trim()
  const url = String(form.get('url') ?? '').trim()
  if (label && url) insertLink(db, { saint_id: id, label, url })
  return c.redirect(`/admin/saints/${id}`)
})

// Soft-delete link
app.post('/:id/links/:lid/delete', (c) => {
  const lid = Number(c.req.param('lid'))
  softDeleteLink(db, { deleted_at: Math.floor(Date.now() / 1000) }, { id: lid })
  return c.redirect(`/admin/saints/${c.req.param('id')}`)
})

export default app
