import { db } from './client'
import * as sql from './sql'

// ---- Types ----

export type Saint = {
  id: number
  name: string
  birth_date: string | null
  repose_date: string | null
  created_at: number
}

export type FeastDay = {
  id: number
  saint_id: number
  label: string
  sort_month: number | null
  sort_day: number | null
}

export type Section = {
  id: number
  saint_id: number
  title: string
  body: string
  sort_order: number
  created_at: number
}

export type Link = {
  id: number
  saint_id: number
  label: string
  url: string
  created_at: number
}

// ---- Saints ----

export function listSaints(): Saint[] {
  return db.prepare(sql.LIST_SAINTS).all() as Saint[]
}

export function getSaint(id: number): Saint | undefined {
  return db.prepare(sql.GET_SAINT).get(id) as Saint | undefined
}

export function insertSaint(name: string, birth_date: string | null, repose_date: string | null): number {
  const result = db.prepare(sql.INSERT_SAINT).run(name, birth_date, repose_date)
  return Number(result.lastInsertRowid)
}

export function updateSaint(id: number, name: string, birth_date: string | null, repose_date: string | null): void {
  db.prepare(sql.UPDATE_SAINT).run(name, birth_date, repose_date, id)
}

// ---- Feast Days ----

export function listFeastDaysBySaint(saint_id: number): FeastDay[] {
  return db.prepare(sql.LIST_FEAST_DAYS_BY_SAINT).all(saint_id) as FeastDay[]
}

export function insertFeastDay(saint_id: number, label: string, sort_month: number | null, sort_day: number | null): void {
  db.prepare(sql.INSERT_FEAST_DAY).run(saint_id, label, sort_month, sort_day)
}

export function deleteFeastDay(id: number): void {
  db.prepare(sql.DELETE_FEAST_DAY).run(id)
}

// ---- Sections ----

export function listCurrentSectionsBySaint(saint_id: number): Section[] {
  return db.prepare(sql.LIST_CURRENT_SECTIONS_BY_SAINT).all(saint_id) as Section[]
}

export function insertSection(saint_id: number, title: string, body: string, sort_order: number): number {
  const result = db.prepare(sql.INSERT_SECTION).run(saint_id, title, body, sort_order)
  return Number(result.lastInsertRowid)
}

export function markSectionSuperseded(id: number, superseded_by: number): void {
  db.prepare(sql.MARK_SECTION_SUPERSEDED).run(superseded_by, id)
}

export function markSectionDeleted(id: number): void {
  db.prepare(sql.MARK_SECTION_DELETED).run(id)
}

// ---- Links ----

export function listActiveLinksBySaint(saint_id: number): Link[] {
  return db.prepare(sql.LIST_ACTIVE_LINKS_BY_SAINT).all(saint_id) as Link[]
}

export function insertLink(saint_id: number, label: string, url: string): void {
  db.prepare(sql.INSERT_LINK).run(saint_id, label, url)
}

export function softDeleteLink(id: number): void {
  db.prepare(sql.SOFT_DELETE_LINK).run(id)
}
