import type { Database } from 'better-sqlite3';

export type InsertLinkParams = {
	saint_id: number;
	label: string;
	url: string;
}

export type InsertLinkResult = {
	changes: number;
	lastInsertRowid: number;
}

export function insertLink(db: Database, params: InsertLinkParams): InsertLinkResult {
	const sql = `
	-- @name InsertLink
	INSERT INTO links (saint_id, label, url) VALUES (?, ?, ?);
	
	`
	return db.prepare(sql)
		.run([params.saint_id, params.label, params.url]) as InsertLinkResult;
}