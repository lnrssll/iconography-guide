import type { Database } from 'better-sqlite3';

export type SoftDeleteLinkData = {
	deleted_at: number | null;
}

export type SoftDeleteLinkParams = {
	id: number;
}

export type SoftDeleteLinkResult = {
	changes: number;
}

export function softDeleteLink(db: Database, data: SoftDeleteLinkData, params: SoftDeleteLinkParams): SoftDeleteLinkResult {
	const sql = `
	-- @name SoftDeleteLink
	UPDATE links SET deleted_at = ? WHERE id = ?;
	
	`
	return db.prepare(sql)
		.run([data.deleted_at, params.id]) as SoftDeleteLinkResult;
}