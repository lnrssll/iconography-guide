import type { Database } from 'better-sqlite3';

export type ListActiveLinksBySaintParams = {
	saint_id: number;
}

export type ListActiveLinksBySaintResult = {
	id: number;
	saint_id: number;
	label: string;
	url: string;
	created_at: number;
}

export function listActiveLinksBySaint(db: Database, params: ListActiveLinksBySaintParams): ListActiveLinksBySaintResult[] {
	const sql = `
	-- @name ListActiveLinksBySaint
	SELECT id, saint_id, label, url, created_at FROM links WHERE saint_id = ? AND deleted_at IS NULL ORDER BY created_at ASC;
	
	`
	return db.prepare(sql)
		.raw(true)
		.all([params.saint_id])
		.map(data => mapArrayToListActiveLinksBySaintResult(data));
}

function mapArrayToListActiveLinksBySaintResult(data: any) {
	const result: ListActiveLinksBySaintResult = {
		id: data[0],
		saint_id: data[1],
		label: data[2],
		url: data[3],
		created_at: data[4]
	}
	return result;
}