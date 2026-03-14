import type { Database } from 'better-sqlite3';

export type UpdateSaintData = {
	name: string;
	birth_date: string | null;
	repose_date: string | null;
}

export type UpdateSaintParams = {
	id: number;
}

export type UpdateSaintResult = {
	changes: number;
}

export function updateSaint(db: Database, data: UpdateSaintData, params: UpdateSaintParams): UpdateSaintResult {
	const sql = `
	-- @name UpdateSaint
	UPDATE saints SET name = ?, birth_date = ?, repose_date = ? WHERE id = ?;
	
	`
	return db.prepare(sql)
		.run([data.name, data.birth_date, data.repose_date, params.id]) as UpdateSaintResult;
}