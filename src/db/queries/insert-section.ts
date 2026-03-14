import type { Database } from 'better-sqlite3';

export type InsertSectionParams = {
	saint_id: number;
	title: string;
	body: string;
	sort_order: number;
}

export type InsertSectionResult = {
	changes: number;
	lastInsertRowid: number;
}

export function insertSection(db: Database, params: InsertSectionParams): InsertSectionResult {
	const sql = `
	-- @name InsertSection
	INSERT INTO sections (saint_id, title, body, sort_order) VALUES (?, ?, ?, ?);
	
	`
	return db.prepare(sql)
		.run([params.saint_id, params.title, params.body, params.sort_order]) as InsertSectionResult;
}