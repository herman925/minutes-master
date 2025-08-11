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

export interface TemplateStructure {
  sections: string[]
  fieldMappings: Record<string, string>
  format: 'structured' | 'narrative' | 'mixed'
  hasActionItems: boolean
  hasAttendees: boolean
  hasAgenda: boolean
  customFields: string[]
  analysis: string
}

export interface TemplateProfile {
  id: string
  name: string
  structure: TemplateStructure
  confidence: number
  analysis: string
  createdAt: string
}

export interface AIGenerationOptions {
  transcript: string
  dictionary?: DictionaryEntry[]
  instructions?: UserInstruction[]
  samples?: SampleMinute[]
  templateProfile?: TemplateProfile
  meetingTitle?: string
  onProgress?: (progress: number, status: string) => void
}
