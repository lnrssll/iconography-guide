import type { Database } from 'better-sqlite3';

export type ListCurrentSectionsBySaintParams = {
	saint_id: number;
}

export type ListCurrentSectionsBySaintResult = {
	id: number;
	saint_id: number;
	title: string;
	body: string;
	sort_order: number;
	created_at: number;
}

export function listCurrentSectionsBySaint(db: Database, params: ListCurrentSectionsBySaintParams): ListCurrentSectionsBySaintResult[] {
	const sql = `
	-- @name ListCurrentSectionsBySaint
	SELECT id, saint_id, title, body, sort_order, created_at FROM sections WHERE saint_id = ? AND is_current = 1 ORDER BY sort_order ASC;
	
	`
	return db.prepare(sql)
		.raw(true)
		.all([params.saint_id])
		.map(data => mapArrayToListCurrentSectionsBySaintResult(data));
}

function mapArrayToListCurrentSectionsBySaintResult(data: any) {
	const result: ListCurrentSectionsBySaintResult = {
		id: data[0],
		saint_id: data[1],
		title: data[2],
		body: data[3],
		sort_order: data[4],
		created_at: data[5]
	}
	return result;
}