import { notFound } from 'next/navigation'
import { projects } from '@/data/site'
import CaseStudy from '@/components/CaseStudy'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const p = projects.find(x => x.slug === slug)
  return { title: p ? `${p.title} — Khushi Rathore` : 'Project — Khushi Rathore', description: p?.summary }
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params
  const index = projects.findIndex(p => p.slug === slug)
  if (index < 0) notFound()
  return <CaseStudy index={index} />
}
