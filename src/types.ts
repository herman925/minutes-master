export interface GeneratedMinutes {
  title: string
  date: string
  attendees: string[]
  agenda: string[]
  keyDecisions: string[]
  actionItems: Array<{ task: string; assignee: string; dueDate: string }>
  nextSteps: string[]
}
