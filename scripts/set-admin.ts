/**
 * Usage: npx tsx scripts/set-admin.ts <email>
 *
 * Sets a user's role to "admin" and plan to "enterprise" for unlimited testing.
 * Also resets their monthly analysis count to 0.
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Usage: npx tsx scripts/set-admin.ts <email>')
    process.exit(1)
  }

  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`User not found: ${email}`)
    process.exit(1)
  }

  const updated = await db.user.update({
    where: { email },
    data: {
      role: 'admin',
      plan: 'enterprise',
      analysesThisMonth: 0,
    },
  })

  console.log(`✅ Updated user:`)
  console.log(`   Email:  ${updated.email}`)
  console.log(`   Name:   ${updated.name}`)
  console.log(`   Role:   ${updated.role}`)
  console.log(`   Plan:   ${updated.plan}`)
  console.log(`   Analyses this month: ${updated.analysesThisMonth}`)
  console.log()
  console.log('Admin users bypass all rate limits (999 analyses/mo, 50MB files, 1M chars).')

  await db.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})