import source from './content/qa-articles.md?raw'

// Stable URLs are independent of editable article titles.
const articleSlugs = [
  "the-requirement-is-unclear-what-should-a-qa-engineer-do-next",
  "what-should-we-test-first-a-practical-guide-to-risk-based-testing",
  "the-api-returned-200-ok-is-it-really-working",
  "one-small-change-twenty-possible-problems-finding-the-regression-scope",
  "what-should-you-not-automateand-why",
  "would-you-block-the-release-for-this-bug"
]

const parts = source.replace(/\r\n/g, '\n').split(/^# \d+\. /m)
export const articleIntroduction = parts.shift().replace(/^# .*\n+/, '').replace(/\n+---\s*$/, '').trim()
export const articles = parts.map((part, index) => {
  const title = part.slice(0, part.indexOf('\n')).trim()
  const excerpt = part.match(/^\*\*Excerpt:\*\* (.+)$/m)?.[1]
  const tags = part.match(/^\*\*Tags:\*\* (.+)$/m)?.[1].split(', ')
  const content = part.slice(part.indexOf('\n')).replace(/^\*\*(Excerpt|Tags):\*\* .*\n/gm, '').replace(/\n+---\s*$/, '').trim()
  if (!excerpt || !tags || !content) throw new Error(`Incomplete article: ${title}`)
  const slug = articleSlugs[index]
  const words = `${title} ${content}`.match(/\S+/g)?.length || 0
  return { title, excerpt, tags, content, slug, readingTime: Math.max(1, Math.ceil(words / 200)) }
})
if (articles.length !== 6) throw new Error('Expected six QA articles in source order.')
