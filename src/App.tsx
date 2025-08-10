import { useState, useEffect } from 'react'
import { useKV } from '@/lib/useKV'
import { toast } from 'sonner'
import HomePage from '@/components/HomePage'
import WorkspaceLayout from '@/components/WorkspaceLayout'
import SetupWizard from '@/components/SetupWizard'
import type { GeneratedMinutes } from '@/types'

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
  const [currentView, setCurrentView] = useState<'home' | 'wizard' | 'workspace'>('home')
  const [transcript, setTranscript] = useState('')
  const [generatedMinutes, setGeneratedMinutes] = useState<GeneratedMinutes | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

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

  const generateMinutes = async () => {
    if (!transcript.trim()) {
      toast.error('Please enter a transcript first')
      return
    }

    setIsGenerating(true)
    setProgress(10)

    try {
      // Build dictionary context - ensure arrays exist and are valid
      const validDictionary = Array.isArray(dictionary) ? dictionary : []
      const dictContext = validDictionary.length > 0 
        ? `\n\nCustom terminology:\n${validDictionary.map(entry => `${entry.term}: ${entry.definition}${entry.context ? ` (${entry.context})` : ''}`).join('\n')}`
        : ''

      // Build instructions context - ensure arrays exist and are valid
      const validInstructions = Array.isArray(userInstructions) ? userInstructions : []
      const instructionsContext = validInstructions.length > 0
        ? `\n\nUser Instructions (follow these rules):\n${validInstructions
            .sort((a, b) => {
              const priorityOrder = { high: 3, medium: 2, low: 1 }
              return priorityOrder[b.priority] - priorityOrder[a.priority]
            })
            .map(inst => `[${inst.category}] ${inst.title}: ${inst.instruction}`)
            .join('\n')}`
        : ''

      // Build sample context from pool - ensure arrays exist and are valid
      const validSamples = Array.isArray(sampleMinutes) ? sampleMinutes : []
      const sampleContext = validSamples.length > 0
        ? `\n\nStyle and format guidelines based on your sample library:\n${validSamples
            .slice(0, 3) // Use top 3 samples
            .map(sample => `${sample.name}:\n${sample.content.substring(0, 1000)}`)
            .join('\n\n---\n\n')}`
        : ''

      setProgress(30)

      const prompt = spark.llmPrompt`You are an expert meeting minutes generator. Transform the following transcript into professional meeting minutes that match the provided style guidelines.

      Structure the output as a JSON object with these fields:
      - title: Meeting title/subject
      - date: Meeting date (if mentioned, otherwise use today's date)
      - attendees: Array of participant names (extract from transcript speakers)
      - agenda: Array of main topics discussed
      - keyDecisions: Array of important decisions made
      - actionItems: Array of objects with task, assignee, and dueDate
      - nextSteps: Array of follow-up items

      Make the minutes professional, concise, and well-organized. Follow the style and terminology from the provided samples and guidelines.${dictContext}${instructionsContext}${sampleContext}

      Transcript:
      ${transcript}`

      setProgress(60)

      const response = await spark.llm(prompt, 'gpt-4o', true)
      setProgress(80)

      const minutes = JSON.parse(response)
      setGeneratedMinutes(minutes)
      setMeetingHistory(prev => {
        const history = Array.isArray(prev) ? prev : []
        return [...history, minutes]
      })
      setProgress(100)

      toast.success('Meeting minutes generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate minutes. Please try again.')
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const exportMinutes = () => {
    if (!generatedMinutes) return

    const content = `# ${generatedMinutes.title}

**Date:** ${generatedMinutes.date}

## Attendees
${Array.isArray(generatedMinutes.attendees) ? generatedMinutes.attendees.map(name => `- ${name}`).join('\n') : ''}

## Agenda
${Array.isArray(generatedMinutes.agenda) ? generatedMinutes.agenda.map(item => `- ${item}`).join('\n') : ''}

## Key Decisions
${Array.isArray(generatedMinutes.keyDecisions) ? generatedMinutes.keyDecisions.map(decision => `- ${decision}`).join('\n') : ''}

## Action Items
${Array.isArray(generatedMinutes.actionItems) ? generatedMinutes.actionItems.map(item => `- **${item.task}** (Assigned to: ${item.assignee}, Due: ${item.dueDate})`).join('\n') : ''}

## Next Steps
${Array.isArray(generatedMinutes.nextSteps) ? generatedMinutes.nextSteps.map(step => `- ${step}`).join('\n') : ''}
`

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
    const sampleTranscript = wizardData.transcript || `Jane (00:02): Alright team, let's kick off the Q3 planning. First on the agenda is the product roadmap. John, can you give us an update?

John (00:15): Thanks, Jane. We've finalized the specs for Project Phoenix. The key challenge is the integration with the new API. We'll need to allocate more resources to backend development. I've updated the JIRA ticket.

Sarah (00:35): On the marketing side, we're preparing a campaign for the v2.1 launch. We need to define the target ICP and messaging. I suggest we form a small task force.

Jane (00:55): Good point, Sarah. Let's make that an action item. John, Sarah, please sync up and propose a plan by EOD Friday.`

    setTranscript(sampleTranscript)
    
    // Add samples to sample pool
    const newSamples = wizardData.samples.map(file => ({
      id: Math.random().toString(),
      name: file.name,
      content: `Sample content from ${file.name}`, // In real app, you'd read the file
      tags: ['wizard-upload'],
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
      const newInstruction = {
        id: Math.random().toString(),
        title: `Instructions for ${wizardData.meetingTitle}`,
        category: 'Meeting Specific',
        instruction: wizardData.instructions,
        priority: 'high' as const
      }
      setUserInstructions(prev => {
        const currentInstructions = Array.isArray(prev) ? prev : []
        return [...currentInstructions, newInstruction]
      })
    }
    
    // Switch to workspace and auto-generate
    setCurrentView('workspace')
    
    // Auto-generate if we have content
    setTimeout(() => {
      generateMinutes()
    }, 500)
    
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
          onGenerate={generateMinutes}
          isGenerating={isGenerating}
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
        />
      )}
    </>
  )
}

export default App