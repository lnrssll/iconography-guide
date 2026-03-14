import type { Database } from 'better-sqlite3';

export type GetSectionParams = {
	id: number;
}

export type GetSectionResult = {
	id: number;
	saint_id: number;
	title: string;
	body: string;
	sort_order: number;
	is_current: number;
	superseded_by?: number;
	created_at: number;
}

export function getSection(db: Database, params: GetSectionParams): GetSectionResult | null {
	const sql = `
	-- @name GetSection
	SELECT id, saint_id, title, body, sort_order, is_current, superseded_by, created_at FROM sections WHERE id = ?;
	
	`
	const res = db.prepare(sql)
		.raw(true)
		.get([params.id]);

	return res ? mapArrayToGetSectionResult(res) : null;
}

function mapArrayToGetSectionResult(data: any) {
	const result: GetSectionResult = {
		id: data[0],
		saint_id: data[1],
		title: data[2],
		body: data[3],
		sort_order: data[4],
		is_current: data[5],
		superseded_by: data[6],
		created_at: data[7]
	}
	return result;
}