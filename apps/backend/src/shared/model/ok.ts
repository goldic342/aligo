import { t } from "elysia";

export const ok = t.Object({ ok: t.Boolean() });
export type ok = typeof ok.static;
