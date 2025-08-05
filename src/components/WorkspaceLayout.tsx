import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Menu,
  Settings,
  Sparkles,
  FileText,
  BookOpen,
  User,
  Download,
  Play,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  DollarSign
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface WorkspaceLayoutProps {
  transcript: string
  setTranscript: (value: string) => void
  generatedMinutes: any
  onGenerate: () => void
  isGenerating: boolean
  dictionary: any[]
  userInstructions: any[]
  onExport: () => void
}

const WorkspaceLayout = ({
  transcript,
  setTranscript,
  generatedMinutes,
  onGenerate,
  isGenerating,
  dictionary,
  userInstructions,
  onExport
}: WorkspaceLayoutProps) => {
  const [activeCustomizationTab, setActiveCustomizationTab] = useState('dictionary')

  const speakers = [
    { name: "Jane Doe", time: "00:02", role: "Chair" },
    { name: "John Smith", time: "00:15", role: "Product Lead" },
    { name: "Sarah Lee", time: "00:35", role: "Marketing Lead" },
    { name: "Jane Doe", time: "00:55", role: "Chair" }
  ]

  const transcriptSections = [
    {
      speaker: "Jane Doe",
      time: "00:02",
      content: "Alright team, let's kick off the Q3 planning. First on the agenda is the product roadmap. John, can you give us an update?"
    },
    {
      speaker: "John Smith", 
      time: "00:15",
      content: "Thanks, Jane. We've finalized the specs for Project Phoenix. The key challenge is the integration with the new API. We'll need to allocate more resources to backend development. I've updated the JIRA ticket."
    },
    {
      speaker: "Sarah Lee",
      time: "00:35", 
      content: "On the marketing side, we're preparing a campaign for the v2.1 launch. We need to define the target ICP and messaging. I suggest we form a small task force."
    },
    {
      speaker: "Jane Doe",
      time: "00:55",
      content: "Good point, Sarah. Let's make that an action item. John, Sarah, please sync up and propose a plan by EOD Friday."
    }
  ]

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Q3 Planning Meeting</h1>
              <div className="text-xs text-muted-foreground">Generated on {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>45 min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>3 attendees</span>
            </div>
          </div>
          <Button 
            onClick={onExport}
            disabled={!generatedMinutes}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 border-border bg-border overflow-hidden">
        
        {/* Left Panel - Transcript */}
        <div className="bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
                Transcript
              </h2>
              <Badge variant="secondary" className="text-xs">
                {transcript.length} chars
              </Badge>
            </div>
            <Textarea
              placeholder="Paste your meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="min-h-24 resize-none font-mono text-sm"
            />
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {transcriptSections.map((section, index) => (
                <div key={index} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-primary font-mono text-sm">
                      {section.speaker}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({section.time})
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-2 border-l-2 border-border group-hover:border-primary/30 transition-colors">
                    "{section.content}"
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Generated Minutes */}
        <div className="bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border shrink-0">
            <h2 className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
              Generated Minutes
            </h2>
          </div>
          
          <ScrollArea className="flex-1 p-6">
            {generatedMinutes ? (
              <div className="prose prose-sm max-w-none">
                <div className="mb-6">
                  <h1 className="text-xl font-semibold mb-2">{generatedMinutes.title}</h1>
                  <div className="text-sm text-muted-foreground mb-4">
                    <strong>Date:</strong> {generatedMinutes.date}
                  </div>
                </div>

                <section className="mb-6">
                  <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Attendees
                  </h2>
                  <ul className="space-y-1">
                    {generatedMinutes.attendees?.map((attendee: string, index: number) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {attendee}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-6">
                  <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Key Decisions
                  </h2>
                  <ul className="space-y-2">
                    {generatedMinutes.keyDecisions?.map((decision: string, index: number) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0"></span>
                        {decision}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-6">
                  <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Action Items
                  </h2>
                  <div className="space-y-3">
                    {generatedMinutes.actionItems?.map((item: any, index: number) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="font-medium text-sm mb-1">{item.task}</div>
                        <div className="text-xs text-muted-foreground">
                          <strong>Assigned to:</strong> {item.assignee} • 
                          <strong> Due:</strong> {item.dueDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Minutes Generated</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add a transcript and generate minutes to see results here.
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Panel - Customization */}
        <div className="bg-card flex flex-col">
          <div className="p-4 border-b border-border shrink-0">
            <Tabs value={activeCustomizationTab} onValueChange={setActiveCustomizationTab}>
              <TabsList className="grid w-full grid-cols-2 p-1 bg-muted">
                <TabsTrigger 
                  value="dictionary" 
                  className="text-xs data-[state=active]:bg-background"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Dictionary
                </TabsTrigger>
                <TabsTrigger 
                  value="instructions" 
                  className="text-xs data-[state=active]:bg-background"
                >
                  <User className="h-3 w-3 mr-1" />
                  Instructions
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1 p-4">
            <Tabs value={activeCustomizationTab} onValueChange={setActiveCustomizationTab}>
              <TabsContent value="dictionary" className="mt-0">
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                  >
                    Add New Term
                  </Button>
                  
                  <div className="space-y-3">
                    {[
                      { term: "Project Phoenix", definition: "Internal codename for the new flagship product." },
                      { term: "ICP", definition: "Ideal Customer Profile." },
                      { term: "EOD", definition: "End of Day." }
                    ].map((entry, index) => (
                      <Card key={index} className="p-4 bg-secondary/30 border border-border">
                        <div className="font-semibold text-sm mb-1">{entry.term}</div>
                        <div className="text-xs text-muted-foreground">{entry.definition}</div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="mt-0">
                <Textarea
                  className="w-full min-h-48 text-sm font-mono"
                  placeholder="Enter your organization's style guidelines and preferences..."
                  defaultValue={`Always use a formal and professional tone.
Summarize decisions at the top of the document.
Format action items with the responsible person's name in bold.
Include time estimates for action items when mentioned.
Use bullet points for lists and clear section headers.`}
                />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-12 bg-card border-t border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Status: Ready</span>
          </div>
          <div>AI Model: OpenRouter/GPT-4o</div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>Cost: $0.018</span>
          </div>
        </div>
        
        <Button 
          onClick={onGenerate}
          disabled={isGenerating || !transcript.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </footer>
    </div>
  )
}

export default WorkspaceLayout