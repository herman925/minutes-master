import { useState, useEffect } from 'react'
import { useKV } from '@/lib/useKV'
import { toast } from 'sonner'
import { AIService, type GeneratedMinutes, type ApiConfig } from '@/lib/aiService'
import HomePage from '@/components/HomePage'
import WorkspaceLayout from '@/components/WorkspaceLayout'
import SetupWizard from '@/components/SetupWizard'

interface DictionaryEntry {
  id: string
  term: string
  definition: string
  context?: string
}

interface UserInstruction {
  id: string
  title: string
  category: string
  instruction: string
  priority: 'low' | 'medium' | 'high'
}

interface SampleMinute {
  id: string
  name: string
  content: string
  tags: string[]
  dateAdded: string
  fileSize: number
  meetingType?: string
  organization?: string
}

function App() {
  const [dictionary, setDictionary] = useKV<DictionaryEntry[]>('user-dictionary', [])
  const [userInstructions, setUserInstructions] = useKV<UserInstruction[]>('user-instructions', [])
  const [sampleMinutes, setSampleMinutes] = useKV<SampleMinute[]>('sample-minutes', [])
  const [darkMode, setDarkMode] = useKV<boolean>('dark-mode', false)
  const [meetingHistory, setMeetingHistory] = useKV<GeneratedMinutes[]>('meeting-history', [])
  const [apiConfig, setApiConfig] = useKV<ApiConfig>('api-config', {
    provider: 'openrouter',
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'openai/gpt-4o',
    temperature: 0.7,
    maxTokens: 4000,
    topP: 0.9,
  })
  
  const [currentView, setCurrentView] = useState<'home' | 'wizard' | 'workspace'>('home')
  const [transcript, setTranscript] = useState('')
  const [generatedMinutes, setGeneratedMinutes] = useState<GeneratedMinutes | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressStatus, setProgressStatus] = useState('')

  // Initialize AI service when config changes
  const [aiService, setAiService] = useState<AIService | null>(null)

  useEffect(() => {
    if (apiConfig.apiKey && apiConfig.model) {
      const service = new AIService(apiConfig)
      setAiService(service)
      
      // Make it available globally for backward compatibility
      if (typeof window !== 'undefined' && window.spark) {
        window.spark.aiService = service
      }
    } else {
      setAiService(null)
      if (typeof window !== 'undefined' && window.spark) {
        window.spark.aiService = undefined
      }
    }
  }, [apiConfig])

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const generateMinutes = async (meetingTitle?: string) => {
    if (!transcript.trim()) {
      toast.error('Please enter a transcript first')
      return
    }

    if (!aiService) {
      toast.error('Please configure your AI service in Settings first')
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setProgressStatus('Initializing...')

    try {
      const minutes = await aiService.generateMinutes({
        transcript,
        dictionary: Array.isArray(dictionary) ? dictionary : [],
        instructions: Array.isArray(userInstructions) ? userInstructions : [],
        samples: Array.isArray(sampleMinutes) ? sampleMinutes : [],
        meetingTitle,
        onProgress: (progressValue: number, status: string) => {
          setProgress(progressValue)
          setProgressStatus(status)
        }
      })

      setGeneratedMinutes(minutes)
      setMeetingHistory(prev => {
        const history = Array.isArray(prev) ? prev : []
        return [...history, minutes]
      })

      toast.success('Meeting minutes generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to generate minutes: ${errorMessage}`)
      setProgress(0)
      setProgressStatus('')
    } finally {
      setIsGenerating(false)
      setProgress(0)
      setProgressStatus('')
    }
  }

  const exportMinutes = () => {
    if (!generatedMinutes) return

    const content = `# ${generatedMinutes.title}

**Date:** ${generatedMinutes.date}
${generatedMinutes.duration ? `**Duration:** ${generatedMinutes.duration}\n` : ''}

## Attendees
${Array.isArray(generatedMinutes.attendees) ? generatedMinutes.attendees.map(name => `- ${name}`).join('\n') : ''}

## Summary
${generatedMinutes.summary || 'No summary provided.'}

## Agenda
${Array.isArray(generatedMinutes.agenda) ? generatedMinutes.agenda.map(item => `- ${item}`).join('\n') : ''}

## Key Decisions
${Array.isArray(generatedMinutes.keyDecisions) ? generatedMinutes.keyDecisions.map(decision => `- ${decision}`).join('\n') : ''}

## Action Items
${Array.isArray(generatedMinutes.actionItems) ? generatedMinutes.actionItems.map(item => `- **${item.task}** (Assigned to: ${item.assignee}, Due: ${item.dueDate})`).join('\n') : ''}

## Next Steps
${Array.isArray(generatedMinutes.nextSteps) ? generatedMinutes.nextSteps.map(step => `- ${step}`).join('\n') : ''}

---
*Generated by MinutesMaster AI*`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedMinutes.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_minutes.md`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Minutes exported successfully!')
  }

  const handleWizardComplete = (wizardData: {
    transcript: string
    samples: File[]
    meetingTitle: string
    instructions: string
  }) => {
    // Set transcript from wizard - if empty, add sample data
    const sampleTranscript = wizardData.transcript || `Jane (00:02): Alright team, let's kick off the Q3 planning meeting. First on the agenda is the product roadmap update. John, can you give us a status report?

John (00:15): Thanks, Jane. We've finalized the technical specifications for Project Phoenix. The main challenge we're facing is the integration with the new payment API. We'll need to allocate additional backend development resources to handle the complexity. I've created a detailed JIRA ticket outlining the requirements.

Sarah (00:35): From the marketing perspective, we're preparing the launch campaign for v2.1. We need to clearly define our target customer profile and messaging strategy. I recommend forming a cross-functional task force to align our approach across sales and product teams.

Jane (00:55): Excellent point, Sarah. Let's make that an action item. John and Sarah, please coordinate and present a comprehensive plan by end of day Friday. Also, let's schedule a follow-up session next week to review progress on all fronts.

John (01:10): Understood. I'll also reach out to the DevOps team to discuss deployment strategies and timeline considerations.

Sarah (01:18): Perfect. I'll draft the initial customer persona research and share it with the team by Thursday for review.

Jane (01:25): Great work everyone. Any other items before we wrap up? If not, let's reconvene next Tuesday at the same time.`

    setTranscript(sampleTranscript)
    
    // Add samples to sample pool (in a real app, we'd read file contents)
    const newSamples: SampleMinute[] = wizardData.samples.map(file => ({
      id: Math.random().toString(),
      name: file.name,
      content: `# Sample Meeting Minutes - ${file.name}

**Date:** ${new Date().toISOString().slice(0, 10)}
**Type:** General Meeting

## Attendees
- Team Lead
- Project Manager  
- Developer

## Key Points
- Reviewed project status
- Discussed next milestones
- Assigned action items

## Decisions
- Approved next phase
- Resource allocation confirmed

## Action Items
- Complete technical review (Assignee: Developer, Due: Next week)
- Update project timeline (Assignee: Project Manager, Due: Friday)

## Next Steps
- Follow up meeting scheduled
- Progress review next week`, // Sample content for demo
      tags: ['wizard-upload', 'general'],
      dateAdded: new Date().toISOString(),
      fileSize: file.size,
      meetingType: 'General',
      organization: 'Default'
    }))
    
    setSampleMinutes(prev => {
      const currentSamples = Array.isArray(prev) ? prev : []
      return [...currentSamples, ...newSamples]
    })
    
    // Add instructions if provided
    if (wizardData.instructions) {
      const newInstruction: UserInstruction = {
        id: Math.random().toString(),
        title: `Instructions for ${wizardData.meetingTitle}`,
        category: 'Meeting Specific',
        instruction: wizardData.instructions,
        priority: 'high'
      }
      setUserInstructions(prev => {
        const currentInstructions = Array.isArray(prev) ? prev : []
        return [...currentInstructions, newInstruction]
      })
    }
    
    // Switch to workspace
    setCurrentView('workspace')
    
    // Auto-generate if we have an AI service configured
    if (aiService) {
      setTimeout(() => {
        generateMinutes(wizardData.meetingTitle)
      }, 500)
    } else {
      toast.warning('Please configure your AI service in Settings to generate minutes')
    }
    
    toast.success(`Setup complete for "${wizardData.meetingTitle}"!`)
  }

  const resetToHome = () => {
    setCurrentView('home')
    setTranscript('')
    setGeneratedMinutes(null)
    toast.success('Returned to home')
  }

  return (
    <>
      {currentView === 'home' && (
        <HomePage
          onStartWizard={() => setCurrentView('wizard')}
          onGoToWorkspace={() => setCurrentView('workspace')}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      
      {currentView === 'wizard' && (
        <SetupWizard
          onComplete={handleWizardComplete}
          onCancel={resetToHome}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      
      {currentView === 'workspace' && (
        <WorkspaceLayout
          transcript={transcript}
          setTranscript={setTranscript}
          generatedMinutes={generatedMinutes}
          onGenerate={() => generateMinutes()}
          isGenerating={isGenerating}
          progress={progress}
          progressStatus={progressStatus}
          dictionary={dictionary}
          setDictionary={setDictionary}
          userInstructions={userInstructions}
          setUserInstructions={setUserInstructions}
          sampleMinutes={sampleMinutes}
          setSampleMinutes={setSampleMinutes}
          onExport={exportMinutes}
          onResetToWizard={resetToHome}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          meetingHistory={meetingHistory}
          apiConfig={apiConfig}
          setApiConfig={setApiConfig}
          aiService={aiService}
        />
      )}
    </>
  )
}

export default App