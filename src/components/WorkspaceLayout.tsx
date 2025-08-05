import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  FileText, 
  Settings, 
  Sparkles, 
  Menu,
  Sun,
  Moon,
  X,
  PlusCircle
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
  const [activeTab, setActiveTab] = useState('dictionary')

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
    <>
      {/* Main Workspace Grid */}
      <div className="main-grid">
        {/* Header */}
        <header className="header bg-card border-b border-border flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-base font-semibold text-muted-foreground uppercase">Recent Meetings</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <Button onClick={onResetToWizard} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-md text-sm font-semibold flex items-center gap-2 mb-4">
                    <PlusCircle className="w-5 h-5" />
                    New Meeting
                  </Button>
                  <ul className="space-y-2 font-medium">
                    <li>
                      <a href="#" className="flex items-center p-2 text-foreground rounded-lg bg-secondary hover:bg-accent group">
                        <FileText className="mr-3" />
                        <span>Q3 Planning Meeting</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center p-2 text-foreground rounded-lg hover:bg-accent group">
                        <FileText className="mr-3" />
                        <span>Project Phoenix Kick-off</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center p-2 text-foreground rounded-lg hover:bg-accent group">
                        <FileText className="mr-3" />
                        <span>Marketing Weekly Sync</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">{generatedMinutes?.title || 'Q3 Planning Meeting'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={onExport} 
              disabled={!generatedMinutes} 
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 rounded-md text-sm font-medium"
            >
              Export
            </Button>
            <Button
              onClick={onToggleDarkMode}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {darkMode ? <Sun /> : <Moon />}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Settings className="text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Application Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key" className="block mb-2 text-sm font-medium">OpenRouter API Key</Label>
                    <Input 
                      type="password" 
                      id="api-key" 
                      defaultValue="sk-or-xxxxxxxxxx" 
                      className="bg-secondary border border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost-limit" className="block mb-2 text-sm font-medium">Monthly Cost Limit ($)</Label>
                    <Input 
                      type="number" 
                      id="cost-limit" 
                      defaultValue="20" 
                      className="bg-secondary border border-border"
                    />
                  </div>
                  <hr className="border-border"/>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-save" defaultChecked />
                    <Label htmlFor="auto-save" className="text-sm font-medium">Auto-save work in progress</Label>
                  </div>
                </div>
                <div className="flex items-center pt-4 border-t border-border">
                  <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                  <Button variant="outline" className="ml-3">Cancel</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Left Panel - Transcript */}
        <aside className="panel">
          <h2 className="panel-header">Transcript</h2>
          {parsedSpeakers.length > 0 ? (
            <div className="space-y-6 text-sm">
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
              placeholder="Paste your meeting transcript here...&#10;&#10;Format example:&#10;Jane (00:02): Welcome everyone to today's meeting.&#10;John (00:15): Thanks for having me."
              className="min-h-[400px] bg-background border-border resize-none text-sm"
            />
          )}
        </aside>

        {/* Center Panel - Generated Minutes */}
        <main className="panel rich-text-editor">
          <h2 className="panel-header">Generated Minutes</h2>
          
          {generatedMinutes ? (
            <div>
              <h2>Attendees</h2>
              <ul>
                {Array.isArray(generatedMinutes.attendees) ? generatedMinutes.attendees.map((attendee, idx) => (
                  <li key={idx}>{attendee}</li>
                )) : <li>No attendees listed</li>}
              </ul>

              <h2>Decisions</h2>
              <ul>
                {Array.isArray(generatedMinutes.keyDecisions) ? generatedMinutes.keyDecisions.map((decision, idx) => (
                  <li key={idx}>{decision}</li>
                )) : <li>No decisions recorded</li>}
              </ul>

              <h2>Action Items</h2>
              <ul>
                {Array.isArray(generatedMinutes.actionItems) ? generatedMinutes.actionItems.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.assignee}:</strong> {item.task} (Due: {item.dueDate})
                  </li>
                )) : <li>No action items</li>}
              </ul>

              {Array.isArray(generatedMinutes.nextSteps) && generatedMinutes.nextSteps.length > 0 && (
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
            <div>
              <h2>Attendees</h2>
              <ul>
                <li>Jane Doe (Chair)</li>
                <li>John Smith (Product Lead)</li>
                <li>Sarah Lee (Marketing Lead)</li>
              </ul>

              <h2>Decisions</h2>
              <ul>
                <li>Project Phoenix specifications are finalized.</li>
                <li>A task force will be formed to define the marketing campaign for v2.1.</li>
              </ul>

              <h2>Action Items</h2>
              <ul>
                <li><strong>John Smith:</strong> Allocate additional resources to backend development for Project Phoenix API integration.</li>
                <li><strong>John Smith & Sarah Lee:</strong> Sync up and propose a marketing plan for v2.1 by end of day Friday.</li>
              </ul>
            </div>
          )}
        </main>

        {/* Right Panel - Customization */}
        <aside className="panel">
          <div>
            <div className="border-b border-border">
              <ul className="flex -mb-px">
                <li className="mr-2">
                  <button 
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'dictionary' ? 'border-primary text-primary' : 'border-transparent hover:text-muted-foreground hover:border-muted-foreground'}`}
                    onClick={() => setActiveTab('dictionary')}
                  >
                    Dictionary
                  </button>
                </li>
                <li className="mr-2">
                  <button 
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'instructions' ? 'border-primary text-primary' : 'border-transparent hover:text-muted-foreground hover:border-muted-foreground'}`}
                    onClick={() => setActiveTab('instructions')}
                  >
                    Instructions
                  </button>
                </li>
              </ul>
            </div>
            <div className="pt-4">
              {activeTab === 'dictionary' && (
                <div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium mb-4">
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
                </div>
              )}
              
              {activeTab === 'instructions' && (
                <div>
                  <Textarea
                    className="w-full bg-secondary border border-border rounded-md p-2"
                    rows={8}
                    defaultValue={Array.isArray(userInstructions) && userInstructions.length > 0 
                      ? userInstructions.map(inst => `[${inst.category}] ${inst.title}: ${inst.instruction}`).join('\n\n') 
                      : "Always use a formal and professional tone.\nSummarize decisions at the top of the document.\nFormat action items with the responsible person's name in bold."
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Footer */}
        <footer className="footer bg-card border-t border-border flex items-center justify-between px-6 py-2 text-sm">
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
    </>
  )
}