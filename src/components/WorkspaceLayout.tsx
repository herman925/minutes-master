import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, 
  Settings, 
  Download, 
  Sparkles, 
  Menu,
  ArrowLeft,
  Sun,
  Moon
} from '@phosphor-icons/react'

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

interface WorkspaceLayoutProps {
  transcript: string
  setTranscript: (transcript: string) => void
  generatedMinutes: GeneratedMinutes | null
  onGenerate: () => void
  isGenerating: boolean
  dictionary: DictionaryEntry[]
  setDictionary: (dictionary: DictionaryEntry[]) => void
  userInstructions: UserInstruction[]
  setUserInstructions: (instructions: UserInstruction[]) => void
  sampleMinutes: SampleMinute[]
  setSampleMinutes: (samples: SampleMinute[]) => void
  onExport: () => void
  onResetToWizard: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function WorkspaceLayout({
  transcript,
  setTranscript,
  generatedMinutes,
  onGenerate,
  isGenerating,
  dictionary,
  setDictionary,
  userInstructions,
  setUserInstructions,
  sampleMinutes,
  setSampleMinutes,
  onExport,
  onResetToWizard,
  darkMode,
  onToggleDarkMode
}: WorkspaceLayoutProps) {
  const [activeRightTab, setActiveRightTab] = useState('dictionary')

  // Parse transcript to extract speakers and content like the HTML example
  const parseTranscript = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const speakers: Array<{ speaker: string, time?: string, content: string }> = []
    
    for (const line of lines) {
      const speakerMatch = line.match(/^(.+?)\s*\((\d{2}:\d{2})\):\s*(.+)$/)
      if (speakerMatch) {
        speakers.push({
          speaker: speakerMatch[1],
          time: speakerMatch[2],
          content: speakerMatch[3]
        })
      } else if (line.includes(':')) {
        const [speaker, ...contentParts] = line.split(':')
        speakers.push({
          speaker: speaker.trim(),
          content: contentParts.join(':').trim()
        })
      } else if (speakers.length > 0) {
        // Continue previous speaker's content
        speakers[speakers.length - 1].content += ' ' + line
      }
    }
    
    return speakers
  }

  const parsedSpeakers = parseTranscript(transcript)

  return (
    <div className="workspace-grid">
      {/* Header */}
      <header className="workspace-header">
        <div className="flex items-center gap-4">
          <Menu className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">MinutesMaster AI</h1>
              <p className="text-xs text-muted-foreground">{generatedMinutes?.title || 'New Meeting Minutes'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={onExport} 
            disabled={!generatedMinutes} 
            variant="secondary" 
            size="sm"
            className="bg-secondary text-secondary-foreground hover:bg-accent"
          >
            Export
          </Button>
          <Button
            onClick={onToggleDarkMode}
            variant="ghost"
            size="sm"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            onClick={onResetToWizard}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Left Panel - Transcript */}
      <aside className="workspace-panel">
        <h2 className="panel-header">Transcript</h2>
        {parsedSpeakers.length > 0 ? (
          <div className="space-y-4 text-sm">
            {parsedSpeakers.map((entry, idx) => (
              <div key={idx}>
                <p className="transcript-speaker">
                  {entry.speaker} {entry.time && `(${entry.time})`}:
                </p>
                <p className="text-muted-foreground mt-1">"{entry.content}"</p>
              </div>
            ))}
          </div>
        ) : (
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here or upload a file...&#10;&#10;Format example:&#10;Jane (00:02): Welcome everyone to today's meeting.&#10;John (00:15): Thanks for having me."
            className="min-h-[400px] bg-background border-border resize-none text-sm"
          />
        )}
      </aside>

      {/* Center Panel - Generated Minutes */}
      <main className="workspace-panel rich-text-editor">
        <h2 className="panel-header">Generated Minutes</h2>
        
        {generatedMinutes ? (
          <div>
            <h2>Attendees</h2>
            <ul>
              {generatedMinutes.attendees.map((attendee, idx) => (
                <li key={idx}>{attendee}</li>
              ))}
            </ul>

            <h2>Decisions</h2>
            <ul>
              {generatedMinutes.keyDecisions.map((decision, idx) => (
                <li key={idx}>{decision}</li>
              ))}
            </ul>

            <h2>Action Items</h2>
            <ul>
              {generatedMinutes.actionItems.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.assignee}:</strong> {item.task} (Due: {item.dueDate})
                </li>
              ))}
            </ul>

            {generatedMinutes.nextSteps.length > 0 && (
              <>
                <h2>Next Steps</h2>
                <ul>
                  {generatedMinutes.nextSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Minutes Generated</h3>
            <p className="text-muted-foreground mb-4">Add a transcript and generate minutes to see them here.</p>
          </div>
        )}
      </main>

      {/* Right Panel - Customization */}
      <aside className="workspace-panel">
        <div className="border-b border-border">
          <Tabs value={activeRightTab} onValueChange={setActiveRightTab}>
            <TabsList className="flex -mb-px bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="dictionary" 
                className="inline-block p-4 border-b-2 rounded-t-lg data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent"
              >
                Dictionary
              </TabsTrigger>
              <TabsTrigger 
                value="instructions" 
                className="inline-block p-4 border-b-2 rounded-t-lg data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent hover:text-muted-foreground hover:border-muted-foreground"
              >
                Instructions
              </TabsTrigger>
            </TabsList>

            <div className="pt-4">
              <TabsContent value="dictionary" className="mt-0">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-4">
                  Add New Term
                </Button>
                <div className="space-y-3">
                  {Array.isArray(dictionary) && dictionary.length > 0 ? (
                    dictionary.map((entry) => (
                      <div key={entry.id} className="dictionary-term">
                        <p className="font-semibold">{entry.term}</p>
                        <p className="text-sm text-muted-foreground">{entry.definition}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="dictionary-term">
                        <p className="font-semibold">Project Phoenix</p>
                        <p className="text-sm text-muted-foreground">Internal codename for the new flagship product.</p>
                      </div>
                      <div className="dictionary-term">
                        <p className="font-semibold">ICP</p>
                        <p className="text-sm text-muted-foreground">Ideal Customer Profile.</p>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="mt-0">
                <Textarea
                  className="w-full bg-secondary border border-border rounded-md p-3 text-sm"
                  rows={8}
                  placeholder="Enter your custom instructions..."
                  defaultValue={Array.isArray(userInstructions) && userInstructions.length > 0 
                    ? userInstructions.map(inst => `[${inst.category}] ${inst.title}: ${inst.instruction}`).join('\n') 
                    : "Always use a formal and professional tone.\nSummarize decisions at the top of the document.\nFormat action items with the responsible person's name in bold."
                  }
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </aside>

      {/* Footer */}
      <footer className="workspace-footer">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Status: {isGenerating ? 'Generating...' : 'Ready'}</span>
          <span>AI Model: OpenRouter/GPT-4o</span>
          <span>Cost: $0.018</span>
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating || !transcript.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-semibold flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? 'Generating...' : 'Regenerate'}
        </Button>
      </footer>
    </div>
  )
}