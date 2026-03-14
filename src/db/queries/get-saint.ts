import type { Database } from 'better-sqlite3';

export type GetSaintParams = {
	id: number;
}

export type GetSaintResult = {
	id: number;
	name: string;
	birth_date?: string;
	repose_date?: string;
	created_at: number;
}

export function getSaint(db: Database, params: GetSaintParams): GetSaintResult | null {
	const sql = `
	-- @name GetSaint
	SELECT id, name, birth_date, repose_date, created_at FROM saints WHERE id = ?;
	
	`
	const res = db.prepare(sql)
		.raw(true)
		.get([params.id]);

	return res ? mapArrayToGetSaintResult(res) : null;
}

function mapArrayToGetSaintResult(data: any) {
	const result: GetSaintResult = {
		id: data[0],
		name: data[1],
		birth_date: data[2],
		repose_date: data[3],
		created_at: data[4]
	}
	return result;
}