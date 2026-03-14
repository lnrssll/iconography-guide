import type { Database } from 'better-sqlite3';

export type InsertFeastDayParams = {
	saint_id: number;
	label: string;
	sort_month: number | null;
	sort_day: number | null;
}

export type InsertFeastDayResult = {
	changes: number;
	lastInsertRowid: number;
}

export function insertFeastDay(db: Database, params: InsertFeastDayParams): InsertFeastDayResult {
	const sql = `
	-- @name InsertFeastDay
	INSERT INTO feast_days (saint_id, label, sort_month, sort_day) VALUES (?, ?, ?, ?);
	
	`
	return db.prepare(sql)
		.run([params.saint_id, params.label, params.sort_month, params.sort_day]) as InsertFeastDayResult;
}