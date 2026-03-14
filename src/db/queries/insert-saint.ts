import type { Database } from 'better-sqlite3';

export type InsertSaintParams = {
	name: string;
	birth_date: string | null;
	repose_date: string | null;
}

export type InsertSaintResult = {
	changes: number;
	lastInsertRowid: number;
}

export function insertSaint(db: Database, params: InsertSaintParams): InsertSaintResult {
	const sql = `
	-- @name InsertSaint
	INSERT INTO saints (name, birth_date, repose_date) VALUES (?, ?, ?);
	
	`
	return db.prepare(sql)
		.run([params.name, params.birth_date, params.repose_date]) as InsertSaintResult;
}