import type { Database } from 'better-sqlite3';

export type MarkSectionSupersededData = {
	superseded_by: number | null;
}

export type MarkSectionSupersededParams = {
	id: number;
}

export type MarkSectionSupersededResult = {
	changes: number;
}

export function markSectionSuperseded(db: Database, data: MarkSectionSupersededData, params: MarkSectionSupersededParams): MarkSectionSupersededResult {
	const sql = `
	-- @name MarkSectionSuperseded
	UPDATE sections SET is_current = 0, superseded_by = ? WHERE id = ?;
	
	`
	return db.prepare(sql)
		.run([data.superseded_by, params.id]) as MarkSectionSupersededResult;
}