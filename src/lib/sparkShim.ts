import { AIService, type GeneratedMinutes } from './aiService'

declare global {
  interface Window {
    spark?: {
      llmPrompt: (strings: TemplateStringsArray, ...expr: unknown[]) => string
      llm: (prompt: string, model: string, json: boolean) => Promise<string>
      aiService?: AIService
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

/**
 * Legacy llm function for backward compatibility
 * This now returns a stub but the real generation happens through the AIService
 */
async function llm(prompt: string, model?: string, json?: boolean): Promise<string> {
  // Check if we have a configured AI service
  if (window.spark?.aiService) {
    try {
      console.warn('spark.llm is deprecated. Use AIService directly for better features.')
      // This is a simplified fallback - real usage should go through AIService
      return JSON.stringify({
        title: 'Generated via Legacy Method',
        date: new Date().toISOString().slice(0, 10),
        attendees: ['Legacy Mode User'],
        agenda: ['Please use AIService directly'],
        keyDecisions: ['Migrate to new AI pipeline'],
        actionItems: [
          { task: 'Update code to use AIService', assignee: 'Developer', dueDate: 'ASAP' }
        ],
        nextSteps: ['See aiService.ts for proper implementation']
      })
    } catch (error) {
      console.error('Legacy llm call failed:', error)
      throw error
    }
  }

  // Fallback stub for when no AI service is configured
  return JSON.stringify({
    title: 'Demo Meeting Minutes',
    date: new Date().toISOString().slice(0, 10),
    attendees: ['Jane Doe', 'John Smith', 'Sarah Wilson'],
    agenda: ['Project Review', 'Marketing Strategy', 'Next Quarter Planning'],
    keyDecisions: [
      'Approved budget increase for Q2',
      'Selected new marketing vendor',
      'Delayed product launch by 2 weeks'
    ],
    actionItems: [
      { task: 'Finalize budget documentation', assignee: 'Jane Doe', dueDate: '2025-01-20' },
      { task: 'Contract negotiation with vendor', assignee: 'John Smith', dueDate: '2025-01-25' },
      { task: 'Update project timeline', assignee: 'Sarah Wilson', dueDate: '2025-01-18' }
    ],
    nextSteps: [
      'Schedule follow-up meeting for next week',
      'Distribute updated project plan to stakeholders',
      'Begin vendor onboarding process'
    ],
    summary: 'Team meeting focused on budget planning, vendor selection, and timeline adjustments for upcoming product launch.',
    duration: 'Approximately 45 minutes'
  })
}

// Initialize the global spark object
if (typeof window !== 'undefined') {
  window.spark = { 
    llmPrompt, 
    llm,
    aiService: undefined // Will be set by the app when API config is available
  }
}

export { AIService }
export type { GeneratedMinutes }



