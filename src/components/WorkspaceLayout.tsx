import { useState, useRef } from 'react'
import type React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Cog, Sparkles, Sun, Moon, Home } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import MinutesHistory from './MinutesHistory'
import DictionaryManager from './DictionaryManager'
import UserInstructions from './UserInstructions'
import ApiManager from './ApiManager'
import TemplateManager from './TemplateManager'
import { toast } from 'sonner'
import type { GeneratedMinutes, ApiConfig, TemplateProfile } from '@/types'
import type { AIService } from '@/lib/aiService'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'

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

interface WorkspaceLayoutProps {
  transcript: string
  setTranscript: (transcript: string) => void
  generatedMinutes: GeneratedMinutes | null
  onGenerate: () => void
  isGenerating: boolean
  progress?: number
  progressStatus?: string
  dictionary: DictionaryEntry[]
  setDictionary: (dictionary: DictionaryEntry[]) => void
  userInstructions: UserInstruction[]
  setUserInstructions: (instructions: UserInstruction[]) => void
  sampleMinutes: SampleMinute[]
  setSampleMinutes: (samples: SampleMinute[]) => void
  templateProfiles: TemplateProfile[]
  setTemplateProfiles: (profiles: TemplateProfile[]) => void
  selectedTemplateProfile: TemplateProfile | null
  setSelectedTemplateProfile: (profile: TemplateProfile | null) => void
  onExport: () => void
  onResetToWizard: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
  meetingHistory: GeneratedMinutes[]
  apiConfig: ApiConfig
  setApiConfig: (config: ApiConfig) => void
  aiService: AIService | null
}

export default function WorkspaceLayout({
  transcript,
  setTranscript,
  generatedMinutes,
  onGenerate,
  isGenerating,
  progress = 0,
  progressStatus = '',
  dictionary,
  setDictionary,
  userInstructions,
  setUserInstructions,
  sampleMinutes,
  setSampleMinutes,
  templateProfiles,
  setTemplateProfiles,
  selectedTemplateProfile,
  setSelectedTemplateProfile,
  onExport,
  onResetToWizard,
  darkMode,
  onToggleDarkMode,
  meetingHistory,
  apiConfig,
  setApiConfig,
  aiService
}: WorkspaceLayoutProps) {
  const [activeTab, setActiveTab] = useState('dictionary')
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false)
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
  const [isTranscriptUploading, setIsTranscriptUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleTranscriptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (!file) return

    setIsTranscriptUploading(true)
    
    try {
      const fileExtension = file.name.toLowerCase().split('.').pop()
      
      if (fileExtension === 'txt' || fileExtension === 'md' || file.type.startsWith('text/')) {
        // Read text file directly
        const content = await readTextFile(file)
        setTranscript(content)
        toast.success(`Transcript loaded from ${file.name}`)
      } else if (file.type.startsWith('audio/') || file.type.startsWith('video/') || 
                 ['mp3', 'wav', 'm4a', 'mp4', 'mov', 'webm'].includes(fileExtension!)) {
        // Handle audio/video with transcription
        toast.info('Transcribing audio/video file...')
        
        const sparkApi = (window as any)?.spark
        if (!sparkApi) {
          toast.error('AI transcription is unavailable. Please configure the Spark provider or use a text transcript.')
          return
        }

        const base64 = await fileToBase64(file)
        const prompt = sparkApi.llmPrompt`Please transcribe this ${file.type.startsWith('audio/') ? 'audio' : 'video'} file. Extract all spoken content and identify speakers if possible. Format as:

Speaker Name (HH:MM): Dialogue content

If speakers cannot be identified, use Speaker 1, Speaker 2, etc. If timestamps are not clear, use incremental times like 00:01, 00:02, etc.

File: ${file.name}
Content: ${base64.substring(0, 1000)}...`

        const transcription = await sparkApi.llm(prompt, 'gpt-4o', false)
        setTranscript(transcription)
        toast.success(`Transcribed ${file.name}`)
      } else {
        toast.error('Unsupported file type. Please use TXT, MD, MP3, MP4, WAV, or M4A files.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to process file')
    } finally {
      setIsTranscriptUploading(false)
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const parsedSpeakers = parseTranscript(transcript)

  return (
    <>
      {/* Main Workspace Grid */}
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="main-grid main-grid--no-right">
        {/* Header */}
        <header className="header bg-card border-b border-border flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <MinutesHistory meetings={meetingHistory} onNewMeeting={onResetToWizard} />
            <h1 className="text-lg font-semibold">{generatedMinutes?.title || 'Q3 Planning Meeting'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={onResetToWizard}
              variant="ghost"
              size="sm"
              className="p-2"
              aria-label="Go home"
            >
              <Home />
            </Button>
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDictionaryOpen(true)}
              >
                Dictionary
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInstructionsOpen(true)}
              >
                Instructions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTemplatesOpen(true)}
              >
                Templates
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2" aria-label="Open settings">
                  <Cog className="text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl lg:max-w-5xl p-0 flex flex-col">
                <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4 sm:p-6">
                  <DialogTitle className="text-base sm:text-lg">Settings</DialogTitle>
                  <DialogDescription>Configure API, models, and usage preferences</DialogDescription>
                </DialogHeader>
                <div className="p-4 sm:p-6">
                  <ApiManager />
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
            <div className="space-y-6">
              {/* Meeting Header */}
              <div className="border-b border-border pb-4">
                <h1 className="text-xl font-bold">{generatedMinutes.title}</h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span><strong>Date:</strong> {generatedMinutes.date}</span>
                  {generatedMinutes.duration && (
                    <span><strong>Duration:</strong> {generatedMinutes.duration}</span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {generatedMinutes.summary && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Summary</h2>
                  <p className="text-muted-foreground">{generatedMinutes.summary}</p>
                </div>
              )}

              {/* Attendees */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Attendees</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {Array.isArray(generatedMinutes.attendees) && generatedMinutes.attendees.length > 0 
                    ? generatedMinutes.attendees.map((attendee, idx) => (
                        <li key={idx}>{attendee}</li>
                      ))
                    : <li className="text-muted-foreground">No attendees listed</li>
                  }
                </ul>
              </div>

              {/* Agenda */}
              {Array.isArray(generatedMinutes.agenda) && generatedMinutes.agenda.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Agenda</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {generatedMinutes.agenda.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Decisions */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Key Decisions</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {Array.isArray(generatedMinutes.keyDecisions) && generatedMinutes.keyDecisions.length > 0
                    ? generatedMinutes.keyDecisions.map((decision, idx) => (
                        <li key={idx}>{decision}</li>
                      ))
                    : <li className="text-muted-foreground">No decisions recorded</li>
                  }
                </ul>
              </div>

              {/* Action Items */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Action Items</h2>
                {Array.isArray(generatedMinutes.actionItems) && generatedMinutes.actionItems.length > 0 ? (
                  <div className="space-y-2">
                    {generatedMinutes.actionItems.map((item, idx) => (
                      <div key={idx} className="bg-muted/50 p-3 rounded-md">
                        <div className="font-medium">{item.task}</div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Assigned to:</span> {item.assignee} • 
                          <span className="font-medium"> Due:</span> {item.dueDate}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No action items</p>
                )}
              </div>

              {/* Next Steps */}
              {Array.isArray(generatedMinutes.nextSteps) && generatedMinutes.nextSteps.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Next Steps</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {generatedMinutes.nextSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
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

        {/* Right tools moved to sheets; no static right panel */}

        {/* Footer */}
        <footer className="footer bg-card border-t border-border px-6 py-2 text-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Status: {isGenerating ? progressStatus || 'Generating...' : 'Ready'}</span>
              <span>AI Service: {aiService ? `${apiConfig.provider}/${apiConfig.model}` : 'Not configured'}</span>
              {selectedTemplateProfile && (
                <span>Template: {selectedTemplateProfile.name} ({Math.round(selectedTemplateProfile.confidence * 100)}%)</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {isGenerating && (
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="w-32 h-2" />
                  <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                </div>
              )}
              <Button 
                onClick={onGenerate} 
                disabled={isGenerating || !transcript.trim() || !aiService}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate Minutes'}
              </Button>
            </div>
          </div>
        </footer>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsDictionaryOpen(true)}>Open Dictionary</ContextMenuItem>
          <ContextMenuItem onClick={() => setIsInstructionsOpen(true)}>Open Instructions</ContextMenuItem>
          <ContextMenuItem onClick={() => setIsTemplatesOpen(true)}>Open Templates</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Dictionary Sheet */}
      <Sheet open={isDictionaryOpen} onOpenChange={setIsDictionaryOpen}>
        <SheetContent side="right" className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Dictionary</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <DictionaryManager
              dictionary={dictionary}
              setDictionary={setDictionary}
              transcript={transcript}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Instructions Sheet */}
      <Sheet open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
        <SheetContent side="right" className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Instructions</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <UserInstructions
              instructions={userInstructions}
              setInstructions={setUserInstructions}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Templates Sheet */}
      <Sheet open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
        <SheetContent side="right" className="sm:max-w-6xl">
          <SheetHeader>
            <SheetTitle>Templates</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <TemplateManager
              samples={sampleMinutes}
              setSamples={setSampleMinutes}
              templateProfiles={templateProfiles}
              setTemplateProfiles={setTemplateProfiles}
              selectedTemplateProfile={selectedTemplateProfile}
              setSelectedTemplateProfile={setSelectedTemplateProfile}
              aiService={aiService}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}