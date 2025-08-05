import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { FileText, Settings, BookOpen, Download, Sparkles, Upload, Key, User } from '@phosphor-icons/react'
import { toast } from 'sonner'
import DictionaryManager from '@/components/DictionaryManager'
import MinutesPreview from '@/components/MinutesPreview'
import FileUploader from '@/components/FileUploader'
import UserInstructions from '@/components/UserInstructions'
import ApiManager from '@/components/ApiManager'

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

interface UploadedFile {
  id: string
  name: string
  size: number
  type: 'sample' | 'transcript' | 'audio' | 'video'
  content?: string
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
  const [sampleMinutes, setSampleMinutes] = useKV<string>('sample-minutes', '')
  const [uploadedFiles, setUploadedFiles] = useKV<UploadedFile[]>('uploaded-files', [])
  const [transcript, setTranscript] = useState('')
  const [generatedMinutes, setGeneratedMinutes] = useState<GeneratedMinutes | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('upload')

  const handleFilesUploaded = (files: UploadedFile[], combinedTranscription?: string) => {
    setUploadedFiles(current => [...current, ...files])
    
    if (combinedTranscription) {
      setTranscript(combinedTranscription)
      toast.success('Files processed and transcript extracted')
    }
    
    // Extract sample minutes from uploaded files
    const sampleFiles = files.filter(f => f.type === 'sample' && f.content)
    if (sampleFiles.length > 0) {
      const combinedSamples = sampleFiles
        .map(f => `--- ${f.name} ---\n${f.content}`)
        .join('\n\n')
      setSampleMinutes(combinedSamples)
    }
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
      const dictContext = dictionary.length > 0 
        ? `\n\nCustom terminology:\n${dictionary.map(entry => `${entry.term}: ${entry.definition}${entry.context ? ` (${entry.context})` : ''}`).join('\n')}`
        : ''

      // Build instructions context
      const instructionsContext = userInstructions.length > 0
        ? `\n\nUser Instructions (follow these rules):\n${userInstructions
            .sort((a, b) => {
              const priorityOrder = { high: 3, medium: 2, low: 1 }
              return priorityOrder[b.priority] - priorityOrder[a.priority]
            })
            .map(inst => `[${inst.category}] ${inst.title}: ${inst.instruction}`)
            .join('\n')}`
        : ''

      // Build sample context
      const sampleContext = sampleMinutes 
        ? `\n\nPlease follow this format and style:\n${sampleMinutes.substring(0, 1500)}...`
        : ''

      setProgress(30)

      const prompt = spark.llmPrompt`You are an expert meeting minutes generator. Transform the following transcript into professional meeting minutes.

      Structure the output as a JSON object with these fields:
      - title: Meeting title/subject
      - date: Meeting date (if mentioned, otherwise use today's date)
      - attendees: Array of participant names (extract from transcript speakers)
      - agenda: Array of main topics discussed
      - keyDecisions: Array of important decisions made
      - actionItems: Array of objects with task, assignee, and dueDate
      - nextSteps: Array of follow-up items

      Make the minutes professional, concise, and well-organized.${dictContext}${instructionsContext}${sampleContext}

      Transcript:
      ${transcript}`

      setProgress(60)

      const response = await spark.llm(prompt, 'gpt-4o', true)
      setProgress(80)

      const minutes = JSON.parse(response)
      setGeneratedMinutes(minutes)
      setActiveTab('preview')
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

  const clearAllData = () => {
    setUploadedFiles([])
    setTranscript('')
    setGeneratedMinutes(null)
    toast.success('All data cleared')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">MinutesMaster AI</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform meeting transcripts into professional minutes using AI, with custom terminology and formatting
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{uploadedFiles.length}</div>
              <div className="text-sm text-muted-foreground">Files Uploaded</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{dictionary.length}</div>
              <div className="text-sm text-muted-foreground">Custom Terms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{userInstructions.length}</div>
              <div className="text-sm text-muted-foreground">User Rules</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{sampleMinutes ? '1' : '0'}</div>
              <div className="text-sm text-muted-foreground">Sample Format</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{generatedMinutes ? '1' : '0'}</div>
              <div className="text-sm text-muted-foreground">Generated Minutes</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-5 w-5 text-primary animate-spin" />
              <span className="text-sm font-medium">Generating meeting minutes...</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="dictionary" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Dictionary
            </TabsTrigger>
            <TabsTrigger value="instructions" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Instructions
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedMinutes}>
              <Download className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <FileUploader 
              onFilesUploaded={handleFilesUploaded}
              isProcessing={isGenerating}
            />
          </TabsContent>

          <TabsContent value="transcript" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Transcript</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Paste your meeting transcript below. The AI will analyze it to generate structured minutes.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your meeting transcript here... 

Example:
John: Good morning everyone, thanks for joining today's product review meeting.
Sarah: Thanks for organizing this. I've prepared the Q3 metrics report.
Mike: Let's start with the user feedback analysis..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {transcript.length} characters • {transcript.split('\n').filter(line => line.trim()).length} lines
                  </div>
                  <Button 
                    onClick={generateMinutes} 
                    disabled={!transcript.trim() || isGenerating}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Minutes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dictionary">
            <DictionaryManager 
              dictionary={dictionary} 
              setDictionary={setDictionary} 
            />
          </TabsContent>

          <TabsContent value="instructions">
            <UserInstructions 
              instructions={userInstructions}
              setInstructions={setUserInstructions}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sample Minutes Format</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Provide a sample of your organization's meeting minutes format to guide the AI's output style.
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste a sample of your preferred meeting minutes format here...

Example:
QUARTERLY REVIEW MEETING
Date: March 15, 2024
Attendees: John Smith (CEO), Sarah Johnson (CTO), Mike Davis (Product Manager)

AGENDA ITEMS DISCUSSED:
1. Q1 Performance Review
2. Product Roadmap Updates
3. Budget Planning

KEY DECISIONS:
- Approved budget increase for Q2 development
- Decided to prioritize mobile app features

ACTION ITEMS:
- Sarah: Complete security audit by March 30
- Mike: Present UI mockups by April 5"
                  value={sampleMinutes}
                  onChange={(e) => setSampleMinutes(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {sampleMinutes.length} characters
                  </div>
                  <Button onClick={clearAllData} variant="outline">
                    Clear All Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ApiManager />
          </TabsContent>

          <TabsContent value="preview">
            {generatedMinutes ? (
              <MinutesPreview 
                minutes={generatedMinutes} 
                onExport={exportMinutes}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Minutes Generated Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add a transcript and click "Generate Minutes" to see your results here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App