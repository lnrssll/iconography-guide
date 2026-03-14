import type { Database } from 'better-sqlite3';

export type ListFeastDaysBySaintParams = {
	saint_id: number;
}

export type ListFeastDaysBySaintResult = {
	id: number;
	saint_id: number;
	label: string;
	sort_month?: number;
	sort_day?: number;
}

export function listFeastDaysBySaint(db: Database, params: ListFeastDaysBySaintParams): ListFeastDaysBySaintResult[] {
	const sql = `
	-- @name ListFeastDaysBySaint
	SELECT id, saint_id, label, sort_month, sort_day FROM feast_days WHERE saint_id = ? ORDER BY sort_month ASC, sort_day ASC;
	
	`
	return db.prepare(sql)
		.raw(true)
		.all([params.saint_id])
		.map(data => mapArrayToListFeastDaysBySaintResult(data));
}

function mapArrayToListFeastDaysBySaintResult(data: any) {
	const result: ListFeastDaysBySaintResult = {
		id: data[0],
		saint_id: data[1],
		label: data[2],
		sort_month: data[3],
		sort_day: data[4]
	}
	return result;
}