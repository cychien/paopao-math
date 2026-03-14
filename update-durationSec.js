import "dotenv/config"
import pg from "pg"
import process from "node:process"

const { Pool } = pg

const VIMEO_TOKEN = process.env.VIMEO_TOKEN
const DATABASE_URL = process.env.DATABASE_URL

const CONCURRENCY = 6
const LIMIT = 200
const DRY_RUN = false

// ---- Adjust these if your real table/column names differ ----
const TABLE = `"CourseLesson"`
const COL_ID = `"id"`
const COL_DURATION = `"durationSec"` // camelCase -> quoted
const COL_CONTENT_JSON = `"content_json"` // snake_case -> quoted to be safe
// ------------------------------------------------------------

function getPoolConfig() {
  if (DATABASE_URL) {
    return {
      connectionString: DATABASE_URL,
      // Supabase commonly requires SSL; this keeps local scripts simple.
      ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
    }
  }

  const required = ["PGHOST", "PGPORT", "PGUSER", "PGPASSWORD", "PGDATABASE"]
  const missing = required.filter((k) => !process.env[k])
  if (missing.length > 0) {
    throw new Error(
      `Missing DB env vars: ${missing.join(", ")}. Set DATABASE_URL or PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE in .env.`,
    )
  }

  return {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
  }
}

if (!VIMEO_TOKEN) {
  throw new Error("Missing VIMEO_TOKEN in .env")
}

const pool = new Pool(getPoolConfig())

function collectVimeoIds(node, out) {
  if (!node) return
  if (Array.isArray(node)) {
    for (const item of node) collectVimeoIds(item, out)
    return
  }
  if (typeof node === "object") {
    if (typeof node.vimeoId === "string" && node.vimeoId.trim()) {
      out.add(node.vimeoId.trim())
    }
    for (const v of Object.values(node)) collectVimeoIds(v, out)
  }
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms))
}

async function fetchVimeoDurationSec(vimeoId) {
  const url = `https://api.vimeo.com/videos/${encodeURIComponent(vimeoId)}?fields=duration`

  const maxAttempts = 4
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${VIMEO_TOKEN}`,
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
    })

    if (res.ok) {
      const data = await res.json()
      const d = data?.duration
      if (typeof d === "number" && Number.isFinite(d) && d >= 0) return Math.floor(d)
      return null
    }

    const retryable = res.status === 429 || (res.status >= 500 && res.status <= 599)
    if (!retryable) {
      const body = await res.text().catch(() => "")
      console.warn(`[vimeo] ${vimeoId} failed: ${res.status} ${res.statusText} ${body}`)
      return null
    }

    // exponential backoff
    await sleep(250 * Math.pow(2, attempt - 1))
  }

  return null
}

async function mapWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length)
  let idx = 0

  async function worker() {
    for (;;) {
      const i = idx++
      if (i >= items.length) return
      results[i] = await fn(items[i], i)
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker())
  await Promise.all(workers)
  return results
}

async function main() {
  const client = await pool.connect()
  try {
    const selectSql = `
      SELECT ${COL_ID} as id, ${COL_CONTENT_JSON} as content_json, ${COL_DURATION} as duration_sec
      FROM ${TABLE}
      WHERE ${COL_CONTENT_JSON} IS NOT NULL
        AND (${COL_DURATION} IS NULL OR ${COL_DURATION} = 600)
      ORDER BY "updatedAt" DESC
      LIMIT $1
    `

    console.log(selectSql)

    const { rows } = await client.query(selectSql, [LIMIT])
    console.log(`Found ${rows.length} lessons to sync.`)

    const durationCache = new Map() // vimeoId -> number|null
    let updated = 0
    let skipped = 0

    for (const row of rows) {
      const ids = new Set()
      collectVimeoIds(row.content_json, ids)
      const vimeoIds = [...ids]

      if (vimeoIds.length === 0) {
        skipped++
        continue
      }

      const durations = await mapWithConcurrency(vimeoIds, CONCURRENCY, async (vid) => {
        if (durationCache.has(vid)) return durationCache.get(vid)
        const d = await fetchVimeoDurationSec(vid)
        durationCache.set(vid, d)
        return d
      })

      const gotAny = durations.some((d) => typeof d === "number")
      if (!gotAny) {
        console.warn(`[lesson ${row.id}] no durations fetched (vimeoIds=${vimeoIds.join(",")})`)
        skipped++
        continue
      }

      const total = durations.reduce((sum, d) => sum + (typeof d === "number" ? d : 0), 0)

      if (DRY_RUN) {
        console.log(`[dry-run] would update lesson=${row.id} durationSec=${total} (videos=${vimeoIds.length})`)
      } else {
        const updateSql = `
          UPDATE ${TABLE}
          SET ${COL_DURATION} = $1, "updatedAt" = NOW()
          WHERE ${COL_ID} = $2
        `
        await client.query(updateSql, [total, row.id])
        console.log(`[updated] lesson=${row.id} durationSec=${total} (videos=${vimeoIds.length})`)
      }

      updated++
    }

    console.log(`Done. updated=${updated} skipped=${skipped} dryRun=${DRY_RUN}`)
  } finally {
    client.release()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })

