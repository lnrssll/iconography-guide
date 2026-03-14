import type { Database } from 'better-sqlite3';

export type DeleteFeastDayParams = {
	id: number;
}

export type DeleteFeastDayResult = {
	changes: number;
}

export function deleteFeastDay(db: Database, params: DeleteFeastDayParams): DeleteFeastDayResult {
	const sql = `
	-- @name DeleteFeastDay
	DELETE FROM feast_days WHERE id = ?;
	
	`
	return db.prepare(sql)
		.run([params.id]) as DeleteFeastDayResult;
}