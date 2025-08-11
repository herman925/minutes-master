export interface GeneratedMinutes {
  title: string
  date: string
  attendees: string[]
  agenda: string[]
  keyDecisions: string[]
  actionItems: Array<{ task: string; assignee: string; dueDate: string }>
  nextSteps: string[]
  summary?: string
  duration?: string
}

export interface ApiConfig {
  provider: 'openrouter' | 'poe' | 'custom'
  apiKey: string
  baseUrl?: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
}

export interface DictionaryEntry {
  id: string
  term: string
  definition: string
  context?: string
}

export interface UserInstruction {
  id: string
  title: string
  category: string
  instruction: string
  priority: 'low' | 'medium' | 'high'
}

export interface SampleMinute {
  id: string
  name: string
  content: string
  tags: string[]
  dateAdded: string
  fileSize: number
  meetingType?: string
  organization?: string
}
