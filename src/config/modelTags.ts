export type ModelTag =
  | 'OpenAI'
  | 'Anthropic'
  | 'Google'
  | 'Meta'
  | 'Mistral'
  | 'Cohere'
  | 'xAI'
  | 'Perplexity'
  | 'DeepSeek'
  | 'NVIDIA'
  | 'Groq'
  | 'Qwen'
  | 'Phi'
  | 'LLaVA'
  | 'Open Source'
  | 'Commercial'
  | 'Free'
  | 'Paid'
  | 'New'
  | 'Long Context'
  | 'Vision'
  | 'Audio'
  | 'Function Calling'
  | 'JSON'
  | 'Reasoning'
  | 'Small'
  | 'Fast'
  | 'High Quality'
  | 'Prompt Caching'

export const TAG_STYLES: Record<
  ModelTag,
  { variant?: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }
> = {
  OpenAI: { variant: 'outline', className: 'bg-sky-600 text-white border-transparent' },
  Anthropic: { variant: 'outline', className: 'bg-amber-600 text-white border-transparent' },
  Google: { variant: 'outline', className: 'bg-red-600 text-white border-transparent' },
  Meta: { variant: 'outline', className: 'bg-fuchsia-600 text-white border-transparent' },
  Mistral: { variant: 'outline', className: 'bg-orange-600 text-white border-transparent' },
  Cohere: { variant: 'outline', className: 'bg-indigo-600 text-white border-transparent' },
  xAI: { variant: 'outline', className: 'bg-zinc-700 text-white border-transparent' },
  Perplexity: { variant: 'outline', className: 'bg-purple-600 text-white border-transparent' },
  DeepSeek: { variant: 'outline', className: 'bg-emerald-600 text-white border-transparent' },
  NVIDIA: { variant: 'outline', className: 'bg-green-700 text-white border-transparent' },
  Groq: { variant: 'outline', className: 'bg-rose-600 text-white border-transparent' },
  Qwen: { variant: 'outline', className: 'bg-lime-600 text-white border-transparent' },
  Phi: { variant: 'outline', className: 'bg-teal-600 text-white border-transparent' },
  LLaVA: { variant: 'outline', className: 'bg-yellow-500 text-white border-transparent' },
  'Open Source': { variant: 'outline', className: 'bg-emerald-700 text-white border-transparent' },
  Commercial: { variant: 'outline', className: 'bg-slate-600 text-white border-transparent' },
  Free: { variant: 'outline', className: 'bg-green-700 text-white border-transparent' },
  Paid: { variant: 'outline', className: 'bg-pink-600 text-white border-transparent' },
  New: { variant: 'outline', className: 'bg-fuchsia-700 text-white border-transparent' },
  'Long Context': { variant: 'outline', className: 'bg-cyan-700 text-white border-transparent' },
  Vision: { variant: 'outline', className: 'bg-violet-700 text-white border-transparent' },
  Audio: { variant: 'outline', className: 'bg-orange-700 text-white border-transparent' },
  'Function Calling': { variant: 'outline', className: 'bg-blue-700 text-white border-transparent' },
  JSON: { variant: 'outline', className: 'bg-indigo-700 text-white border-transparent' },
  Reasoning: { variant: 'outline', className: 'bg-purple-700 text-white border-transparent' },
  Small: { variant: 'outline', className: 'bg-zinc-600 text-white border-transparent' },
  Fast: { variant: 'outline', className: 'bg-teal-700 text-white border-transparent' },
  'High Quality': { variant: 'outline', className: 'bg-rose-700 text-white border-transparent' },
  'Prompt Caching': { variant: 'outline', className: 'bg-amber-700 text-white border-transparent' },
}

export const FILTER_TAGS: ModelTag[] = [
  'OpenAI',
  'Anthropic',
  'Google',
  'Meta',
  'Mistral',
  'Cohere',
  'xAI',
  'Perplexity',
  'DeepSeek',
  'Qwen',
  'Long Context',
  'Fast',
  'High Quality',
  'Vision',
]

export function inferTagsForOpenRouter(idOrName: string, contextWindow?: number): ModelTag[] {
  const src = idOrName.toLowerCase()
  const tags = new Set<ModelTag>()

  // Vendor
  if (src.includes('openai/')) tags.add('OpenAI')
  if (src.includes('anthropic/')) tags.add('Anthropic')
  if (src.includes('google/') || src.includes('gemini')) tags.add('Google')
  if (src.includes('meta/') || src.includes('meta-') || src.includes('llama')) tags.add('Meta')
  if (src.includes('mistral')) tags.add('Mistral')
  if (src.includes('cohere')) tags.add('Cohere')
  if (src.includes('xai') || src.includes('grok')) tags.add('xAI')
  if (src.includes('perplexity')) tags.add('Perplexity')
  if (src.includes('deepseek')) tags.add('DeepSeek')
  if (src.includes('nvidia')) tags.add('NVIDIA')
  if (src.includes('groq')) tags.add('Groq')
  if (src.includes('qwen') || src.includes('alibaba')) tags.add('Qwen')
  if (src.includes('phi')) tags.add('Phi')
  if (src.includes('llava')) tags.add('LLaVA')

  // Open source heuristic
  if ([...tags].some(t => ['Meta', 'Mistral', 'Qwen', 'LLaVA', 'Phi'].includes(t))) {
    tags.add('Open Source')
  } else if ([...tags].some(t => ['OpenAI', 'Anthropic', 'Google', 'Cohere', 'xAI', 'Perplexity'].includes(t))) {
    tags.add('Commercial')
  }

  // Capabilities / qualities
  if ((contextWindow ?? 0) >= 256000) tags.add('Long Context')
  if (src.includes('vision') || src.includes('gpt-4o') || src.includes('gpt-image') || src.includes('omni')) tags.add('Vision')
  if (src.includes('audio')) tags.add('Audio')
  if (src.includes('function') || src.includes('tools')) tags.add('Function Calling')
  if (src.includes('json') || src.includes('structured') || src.includes('strict-json')) tags.add('JSON')
  if (src.includes('o3') || src.includes('r1') || src.includes('reason') || src.includes('thinking')) tags.add('Reasoning')
  if (src.includes('mini') || src.includes('flash') || src.includes('turbo') || src.includes('instant') || src.includes('lite')) tags.add('Fast')
  if (src.includes('opus') || src.includes('sonnet') || src.includes('pro') || src.includes('405b') || src.includes('70b')) tags.add('High Quality')
  if (src.includes('preview') || src.includes('experimental') || src.includes('beta')) tags.add('New')

  return Array.from(tags)
}
