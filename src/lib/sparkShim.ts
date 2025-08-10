declare global {
  interface Window {
    spark?: {
      llmPrompt: (strings: TemplateStringsArray, ...expr: unknown[]) => string
      llm: (prompt: string, model: string, json: boolean) => Promise<string>
    }
  }
}

const llmPrompt = (strings: TemplateStringsArray, ...expr: unknown[]) => {
  let out = ''
  strings.forEach((chunk, i) => {
    out += chunk + (i < expr.length ? String(expr[i]) : '')
  })
  return out
}

async function llm(prompt: string): Promise<string> {
  // Minimal offline stub: returns a deterministic JSON payload so the UI can flow.
  // Replace with real API call in ApiManager.testConnection at runtime using user-provided key.
  return JSON.stringify({
    title: 'Sample Meeting',
    date: new Date().toISOString().slice(0, 10),
    attendees: ['Jane', 'John', 'Sarah'],
    agenda: ['Roadmap', 'Marketing', 'Next steps'],
    keyDecisions: ['Allocate backend resources', 'Form marketing task force'],
    actionItems: [
      { task: 'Backend resourcing plan', assignee: 'John', dueDate: '2025-08-15' },
      { task: 'Marketing plan proposal', assignee: 'Sarah', dueDate: '2025-08-15' }
    ],
    nextSteps: ['Sync Friday', 'Share draft minutes']
  })
}

if (typeof window !== 'undefined') {
  window.spark = { llmPrompt, llm }
}

export {}



