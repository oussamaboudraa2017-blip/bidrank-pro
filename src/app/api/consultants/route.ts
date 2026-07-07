export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { seedConsultants } from '@/lib/seed-consultants'

const EXPERIENCE_ORDER: Record<string, number> = {
  '1-3': 1,
  '3-5': 2,
  '5-10': 3,
  '10+': 4,
}

function getExperienceKey(exp: string): string {
  if (exp === '1-3 yrs') return '1-3'
  if (exp === '3-5 yrs') return '3-5'
  if (exp === '5-10 yrs') return '5-10'
  if (exp === '10+ yrs') return '10+'
  // Already in key format
  if (EXPERIENCE_ORDER[exp] !== undefined) return exp
  return '0'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const certification = searchParams.get('certification')
  const industry = searchParams.get('industry')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort')
  const experience = searchParams.get('experience')

  let results = [...seedConsultants]

  // ── Filter by search ──────────────────────────────────────────────────────
  if (search) {
    const q = search.toLowerCase()
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.specializations.some((s) => s.toLowerCase().includes(q)) ||
        c.bio.toLowerCase().includes(q)
    )
  }

  // ── Filter by certification ───────────────────────────────────────────────
  if (certification) {
    const cert = certification.toLowerCase()
    results = results.filter((c) =>
      c.certifications.some((c2) => c2.toLowerCase() === cert)
    )
  }

  // ── Filter by industry ────────────────────────────────────────────────────
  if (industry) {
    const ind = industry.toLowerCase()
    results = results.filter((c) => c.industry.toLowerCase() === ind)
  }

  // ── Filter by experience ──────────────────────────────────────────────────
  if (experience) {
    const expKey = getExperienceKey(experience)
    results = results.filter((c) => getExperienceKey(c.experience) === expKey)
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  if (sort) {
    switch (sort.toLowerCase()) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'experience':
        results.sort(
          (a, b) =>
            (EXPERIENCE_ORDER[getExperienceKey(b.experience)] || 0) -
            (EXPERIENCE_ORDER[getExperienceKey(a.experience)] || 0)
        )
        break
      // default: keep original order (relevance)
    }
  }

  return NextResponse.json({
    consultants: results,
    total: results.length,
  })
}