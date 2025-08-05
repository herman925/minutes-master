import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
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

interface GeneratedMinutes {
  title: string
  date: string
  attendees: string[]
  agenda: string[]
  keyDecisions: string[]
  actionItems: Array<{
    task: string
    assignee: string
    dueDate: string
  }>
  nextSteps: string[]
}

function App() {
  const [dictionary, setDictionary] = useKV<DictionaryEntry[]>('user-dictionary', [])
  const [userInstructions, setUserInstructions] = useKV<UserInstruction[]>('user-instructions', [])
  const [sampleMinutes, setSampleMinutes] = useKV<SampleMinute[]>('sample-minutes', [])
  const [darkMode, setDarkMode] = useKV<boolean>('dark-mode', false)
  const [hasCompletedWizard, setHasCompletedWizard] = useKV<boolean>('wizard-completed', false)
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
      // Build dictionary context
      const dictContext = Array.isArray(dictionary) && dictionary.length > 0 
        ? `\n\nCustom terminology:\n${dictionary.map(entry => `${entry.term}: ${entry.definition}${entry.context ? ` (${entry.context})` : ''}`).join('\n')}`
        : ''

      // Build instructions context
      const instructionsContext = Array.isArray(userInstructions) && userInstructions.length > 0
        ? `\n\nUser Instructions (follow these rules):\n${userInstructions
            .sort((a, b) => {
              const priorityOrder = { high: 3, medium: 2, low: 1 }
              return priorityOrder[b.priority] - priorityOrder[a.priority]
            })
            .map(inst => `[${inst.category}] ${inst.title}: ${inst.instruction}`)
            .join('\n')}`
        : ''

      // Build sample context from pool
      const sampleContext = Array.isArray(sampleMinutes) && sampleMinutes.length > 0
        ? `\n\nStyle and format guidelines based on your sample library:\n${sampleMinutes
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
${generatedMinutes.attendees.map(name => `- ${name}`).join('\n')}

## Agenda
${generatedMinutes.agenda.map(item => `- ${item}`).join('\n')}

## Key Decisions
${generatedMinutes.keyDecisions.map(decision => `- ${decision}`).join('\n')}

## Action Items
${generatedMinutes.actionItems.map(item => `- **${item.task}** (Assigned to: ${item.assignee}, Due: ${item.dueDate})`).join('\n')}

## Next Steps
${generatedMinutes.nextSteps.map(step => `- ${step}`).join('\n')}
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
    // Set transcript from wizard
    setTranscript(wizardData.transcript)
    
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
    
    setSampleMinutes(prev => [...(Array.isArray(prev) ? prev : []), ...newSamples])
    
    // Add instructions if provided
    if (wizardData.instructions) {
      const newInstruction = {
        id: Math.random().toString(),
        title: `Instructions for ${wizardData.meetingTitle}`,
        category: 'Meeting Specific',
        instruction: wizardData.instructions,
        priority: 'high' as const
      }
      setUserInstructions(prev => [...(Array.isArray(prev) ? prev : []), newInstruction])
    }
    
    // Mark wizard as completed and switch to workspace
    setHasCompletedWizard(true)
    
    // Auto-generate if we have content
    setTimeout(() => {
      generateMinutes()
    }, 500)
    
    toast.success(`Setup complete for "${wizardData.meetingTitle}"!`)
  }

  const resetApp = () => {
    setHasCompletedWizard(false)
    setTranscript('')
    setGeneratedMinutes(null)
    toast.success('App reset to wizard')
  }

  return (
    <>
      {!hasCompletedWizard ? (
        <SetupWizard
          onComplete={handleWizardComplete}
          onCancel={() => setHasCompletedWizard(true)} // Allow skip to workspace
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      ) : (
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
          onResetToWizard={resetApp}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
    </>
  )
}

export default App