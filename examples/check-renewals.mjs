import fs from 'node:fs'
const file = process.env.SUBSCRIPTIONS_FILE || new URL('./subscriptions.example.json', import.meta.url)
const days = Number(process.env.RENEWAL_WINDOW_DAYS || 7)
const rows = JSON.parse(fs.readFileSync(file, 'utf8'))
const limit = Date.now() + days * 86400000
const report = rows.map(row => ({ ...row, ownerMissing: !row.owner, invalidBudget: !(row.monthlyBudget > 0), renewsSoon: new Date(row.renewalDate).getTime() <= limit }))
console.log(JSON.stringify(report, null, 2))
if (report.some(row => row.ownerMissing || row.invalidBudget)) process.exitCode = 1
