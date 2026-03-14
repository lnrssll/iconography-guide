import type { Database } from 'better-sqlite3';

export type MarkSectionDeletedParams = {
	id: number;
}

export type MarkSectionDeletedResult = {
	changes: number;
}

export function markSectionDeleted(db: Database, params: MarkSectionDeletedParams): MarkSectionDeletedResult {
	const sql = `
	-- @name MarkSectionDeleted
	UPDATE sections SET is_current = 0 WHERE id = ?;
	
	`
	return db.prepare(sql)
		.run([params.id]) as MarkSectionDeletedResult;
}