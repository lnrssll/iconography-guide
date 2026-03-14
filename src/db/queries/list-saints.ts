import type { Database } from 'better-sqlite3';

export type ListSaintsResult = {
	id: number;
	name: string;
	birth_date?: string;
	repose_date?: string;
	created_at: number;
}

export function listSaints(db: Database): ListSaintsResult[] {
	const sql = `
	-- @name ListSaints
	SELECT id, name, birth_date, repose_date, created_at FROM saints ORDER BY name ASC;
	
	`
	return db.prepare(sql)
		.raw(true)
		.all()
		.map(data => mapArrayToListSaintsResult(data));
}

function mapArrayToListSaintsResult(data: any) {
	const result: ListSaintsResult = {
		id: data[0],
		name: data[1],
		birth_date: data[2],
		repose_date: data[3],
		created_at: data[4]
	}
	return result;
}