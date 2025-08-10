import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Settings, 
  BookOpen, 
  Download, 
  Sparkles, 
  User,
  FolderOpen,
  TrendUp,
  Zap,
  Shield
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import DictionaryManager from '@/components/DictionaryManager'
import MinutesPreview from '@/components/MinutesPreview'
import UserInstructions from '@/components/UserInstructions'
import ApiManager from '@/components/ApiManager'
import TranscriptInput from '@/components/TranscriptInput'
import SamplePool from '@/components/SamplePool'

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
  const [transcript, setTranscript] = useState('')
  const [generatedMinutes, setGeneratedMinutes] = useState<GeneratedMinutes | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('samples')

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

      // Build sample context from pool
      const sampleContext = sampleMinutes.length > 0
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
    setTranscript('')
    setGeneratedMinutes(null)
    toast.success('Session data cleared')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div 
              className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight gradient-text mb-2">
                MinutesMaster AI
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure</span>
                <span>•</span>
                <Zap className="h-4 w-4" />
                <span>Intelligent</span>
                <span>•</span>
                <TrendUp className="h-4 w-4" />
                <span>Professional</span>
              </div>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform meeting transcripts into professional minutes with AI-powered intelligence, 
            custom terminology, and organizational style guidance
          </p>
        </motion.div>

        {/* Enhanced Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        >
          <Card className="card-shadow hover-lift transition-smooth">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{sampleMinutes.length}</div>
              <div className="text-xs text-muted-foreground">Sample Minutes</div>
            </CardContent>
          </Card>
          <Card className="card-shadow hover-lift transition-smooth">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{dictionary.length}</div>
              <div className="text-xs text-muted-foreground">Custom Terms</div>
            </CardContent>
          </Card>
          <Card className="card-shadow hover-lift transition-smooth">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{userInstructions.length}</div>
              <div className="text-xs text-muted-foreground">User Rules</div>
            </CardContent>
          </Card>
          <Card className="card-shadow hover-lift transition-smooth">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{transcript.length}</div>
              <div className="text-xs text-muted-foreground">Transcript Chars</div>
            </CardContent>
          </Card>
          <Card className="card-shadow hover-lift transition-smooth">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{generatedMinutes ? '1' : '0'}</div>
              <div className="text-xs text-muted-foreground">Generated</div>
            </CardContent>
          </Card>
          <Card className="card-shadow hover-lift transition-smooth">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {dictionary.length + userInstructions.length + sampleMinutes.length > 0 ? '100' : '0'}%
              </div>
              <div className="text-xs text-muted-foreground">Setup Complete</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Bar */}
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="font-medium">Generating professional meeting minutes...</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-sm text-muted-foreground mt-2">
                  Processing with {dictionary.length} custom terms, {userInstructions.length} rules, and {sampleMinutes.length} style samples
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 p-1 h-12 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="samples" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-smooth">
                <FolderOpen className="h-4 w-4" />
                Sample Pool
              </TabsTrigger>
              <TabsTrigger value="transcript" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-smooth">
                <FileText className="h-4 w-4" />
                Transcript
              </TabsTrigger>
              <TabsTrigger value="dictionary" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-smooth">
                <BookOpen className="h-4 w-4" />
                Dictionary
              </TabsTrigger>
              <TabsTrigger value="instructions" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-smooth">
                <User className="h-4 w-4" />
                Instructions
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-smooth">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-smooth" disabled={!generatedMinutes}>
                <Download className="h-4 w-4" />
                Preview
                {generatedMinutes && <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">!</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="samples">
              <SamplePool samples={sampleMinutes} setSamples={setSampleMinutes} />
            </TabsContent>

            <TabsContent value="transcript">
              <TranscriptInput 
                transcript={transcript}
                setTranscript={setTranscript}
                onGenerate={generateMinutes}
                isGenerating={isGenerating}
              />
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
              <ApiManager />
              
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <Settings className="h-5 w-5 text-destructive" />
                    </div>
                    Session Management
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Manage your current session data and preferences
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Clear Session Data</div>
                      <div className="text-sm text-muted-foreground">
                        Clear transcript and generated minutes (keeps samples, dictionary, and instructions)
                      </div>
                    </div>
                    <Button onClick={clearAllData} variant="outline">
                      Clear Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              {generatedMinutes ? (
                <MinutesPreview 
                  minutes={generatedMinutes} 
                  onExport={exportMinutes}
                />
              ) : (
                <Card className="card-shadow">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Minutes Generated Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add a transcript and click "Generate Minutes" to see your results here.
                    </p>
                    <Button onClick={() => setActiveTab('transcript')} className="bg-accent hover:bg-accent/90">
                      <FileText className="h-4 w-4 mr-2" />
                      Go to Transcript
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default App