import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Edit2, Save, X, Settings, TestTube } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface UserInstruction {
  id: string
  title: string
  category: string
  instruction: string
  priority: 'low' | 'medium' | 'high'
}

interface UserInstructionsProps {
  instructions: UserInstruction[]
  setInstructions: (instructions: UserInstruction[]) => void
}

const INSTRUCTION_CATEGORIES = [
  'Tone & Style',
  'Format & Structure',
  'Content Requirements',
  'Language & Terminology',
  'Business Rules',
  'Quality Standards'
]

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
  high: 'bg-red-100 text-red-800 border-red-200'
}

export default function UserInstructions({ instructions, setInstructions }: UserInstructionsProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newInstruction, setNewInstruction] = useState({
    title: '',
    category: '',
    instruction: '',
    priority: 'medium' as const
  })
  const [testMode, setTestMode] = useState(false)
  const [testPrompt, setTestPrompt] = useState('')
  const [testResult, setTestResult] = useState('')

  const addInstruction = () => {
    if (!newInstruction.title.trim() || !newInstruction.instruction.trim() || !newInstruction.category) {
      toast.error('Title, category, and instruction are required')
      return
    }

    const instruction: UserInstruction = {
      id: Date.now().toString(),
      title: newInstruction.title.trim(),
      category: newInstruction.category,
      instruction: newInstruction.instruction.trim(),
      priority: newInstruction.priority
    }

    setInstructions(Array.isArray(instructions) ? [...instructions, instruction] : [instruction])
    setNewInstruction({ title: '', category: '', instruction: '', priority: 'medium' })
    setIsAddingNew(false)
    toast.success('Instruction added')
  }

  const deleteInstruction = (id: string) => {
    setInstructions(Array.isArray(instructions) ? instructions.filter(inst => inst.id !== id) : [])
    toast.success('Instruction removed')
  }

  const startEdit = (instruction: UserInstruction) => {
    setEditingId(instruction.id)
    setNewInstruction({
      title: instruction.title,
      category: instruction.category,
      instruction: instruction.instruction,
      priority: instruction.priority
    })
  }

  const saveEdit = () => {
    if (!newInstruction.title.trim() || !newInstruction.instruction.trim() || !newInstruction.category) {
      toast.error('Title, category, and instruction are required')
      return
    }

    setInstructions(Array.isArray(instructions) ? instructions.map(inst => 
      inst.id === editingId 
        ? {
            ...inst,
            title: newInstruction.title.trim(),
            category: newInstruction.category,
            instruction: newInstruction.instruction.trim(),
            priority: newInstruction.priority
          }
        : inst
    ) : [])
    
    setEditingId(null)
    setNewInstruction({ title: '', category: '', instruction: '', priority: 'medium' })
    toast.success('Instruction updated')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAddingNew(false)
    setNewInstruction({ title: '', category: '', instruction: '', priority: 'medium' })
  }

  const testInstructions = async () => {
    if (!testPrompt.trim()) {
      toast.error('Please enter a test prompt')
      return
    }

    if (!Array.isArray(instructions) || instructions.length === 0) {
      toast.error('No instructions to test')
      return
    }

    try {
      // Build instruction context
      const instructionContext = instructions
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        })
        .map(inst => `[${inst.category}] ${inst.title}: ${inst.instruction}`)
        .join('\n')

      const prompt = spark.llmPrompt`You are testing user instructions for meeting minutes generation. 

User Instructions:
${instructionContext}

Test Scenario: ${testPrompt}

Please demonstrate how these instructions would affect the output by providing a brief example or explanation of how you would apply these rules.`

      const result = await spark.llm(prompt, 'gpt-4o', false)
      setTestResult(result)
      toast.success('Test completed')
    } catch (error) {
      console.error('Test error:', error)
      toast.error('Failed to test instructions')
    }
  }

  const predefinedInstructions = [
    {
      title: 'Formal Business Tone',
      category: 'Tone & Style',
      instruction: 'Use formal, professional language appropriate for executive meetings. Avoid casual expressions and maintain a serious, business-appropriate tone.',
      priority: 'medium' as const
    },
    {
      title: 'Action Items Format',
      category: 'Format & Structure',
      instruction: 'Format action items as: "Action: [Description] | Owner: [Name] | Due: [Date] | Status: [New/In Progress/Completed]"',
      priority: 'high' as const
    },
    {
      title: 'Decision Tracking',
      category: 'Content Requirements',
      instruction: 'Clearly identify and highlight all decisions made during the meeting. Mark them as "DECISION:" and include the rationale when provided.',
      priority: 'high' as const
    },
    {
      title: 'Executive Summary',
      category: 'Format & Structure',
      instruction: 'Include a brief executive summary at the beginning highlighting key decisions, critical action items, and major outcomes.',
      priority: 'medium' as const
    }
  ]

  const addPredefinedInstruction = (predefined: typeof predefinedInstructions[0]) => {
    if (Array.isArray(instructions) && instructions.some(inst => inst.title.toLowerCase() === predefined.title.toLowerCase())) {
      toast.error('Similar instruction already exists')
      return
    }

    const instruction: UserInstruction = {
      id: Date.now().toString(),
      ...predefined
    }

    setInstructions(Array.isArray(instructions) ? [...instructions, instruction] : [instruction])
    toast.success(`Added "${predefined.title}" instruction`)
  }

  const groupedInstructions = Array.isArray(instructions) ? instructions.reduce((groups, instruction) => {
    const category = instruction.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(instruction)
    return groups
  }, {} as Record<string, UserInstruction[]>) : {}

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Instructions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Define persistent rules and preferences that will be applied to all generated minutes
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setTestMode(!testMode)} 
                variant="outline"
                disabled={!Array.isArray(instructions) || instructions.length === 0}
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Mode
              </Button>
              <Button 
                onClick={() => setIsAddingNew(true)} 
                disabled={isAddingNew || editingId !== null}
                className="bg-accent hover:bg-accent/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Mode */}
          {testMode && (
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Test Instructions
              </h4>
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter a test scenario (e.g., 'Generate minutes for a quarterly review meeting with budget decisions')"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={testInstructions} disabled={!testPrompt.trim()}>
                  Run Test
                </Button>
                {testResult && (
                  <div className="bg-background border rounded p-3">
                    <h5 className="font-medium mb-2">Test Result:</h5>
                    <div className="text-sm whitespace-pre-wrap">{testResult}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add New Instruction Form */}
          {isAddingNew && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title *</label>
                  <Input
                    placeholder="e.g., Formal Business Tone"
                    value={newInstruction.title}
                    onChange={(e) => setNewInstruction({ ...newInstruction, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <Select 
                    value={newInstruction.category} 
                    onValueChange={(value) => setNewInstruction({ ...newInstruction, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTRUCTION_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select 
                    value={newInstruction.priority} 
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setNewInstruction({ ...newInstruction, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Instruction *</label>
                <Textarea
                  placeholder="Detailed instruction on how this rule should be applied..."
                  value={newInstruction.instruction}
                  onChange={(e) => setNewInstruction({ ...newInstruction, instruction: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addInstruction} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={cancelEdit} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Instructions by Category */}
          <div className="space-y-4">
            {Object.keys(groupedInstructions).length === 0 && !isAddingNew ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No instructions defined yet</p>
                <p className="text-sm">Add rules to customize how your minutes are generated</p>
              </div>
            ) : (
              Object.entries(groupedInstructions).map(([category, categoryInstructions]) => (
                <div key={category}>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="space-y-3 ml-4">
                    {categoryInstructions.map((instruction) => (
                      <div key={instruction.id} className="border rounded-lg p-4">
                        {editingId === instruction.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Title *</label>
                                <Input
                                  value={newInstruction.title}
                                  onChange={(e) => setNewInstruction({ ...newInstruction, title: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Category *</label>
                                <Select 
                                  value={newInstruction.category} 
                                  onValueChange={(value) => setNewInstruction({ ...newInstruction, category: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {INSTRUCTION_CATEGORIES.map(cat => (
                                      <SelectItem key={cat} value={cat}>
                                        {cat}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Priority</label>
                                <Select 
                                  value={newInstruction.priority} 
                                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                                    setNewInstruction({ ...newInstruction, priority: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Instruction *</label>
                              <Textarea
                                value={newInstruction.instruction}
                                onChange={(e) => setNewInstruction({ ...newInstruction, instruction: e.target.value })}
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={saveEdit} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                              <Button onClick={cancelEdit} variant="outline" size="sm">
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h5 className="font-medium">{instruction.title}</h5>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${PRIORITY_COLORS[instruction.priority]}`}
                                >
                                  {instruction.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{instruction.instruction}</p>
                            </div>
                            <div className="flex gap-1 ml-4">
                              <Button 
                                onClick={() => startEdit(instruction)} 
                                variant="outline" 
                                size="sm"
                                disabled={editingId !== null || isAddingNew}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                onClick={() => deleteInstruction(instruction.id)} 
                                variant="outline" 
                                size="sm"
                                disabled={editingId !== null || isAddingNew}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Predefined Instructions */}
      {(!Array.isArray(instructions) || instructions.length < 8) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggested Instructions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Common rules you might want to add to your instruction set
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predefinedInstructions
                .filter(predefined => !Array.isArray(instructions) || !instructions.some(inst => 
                  inst.title.toLowerCase() === predefined.title.toLowerCase()
                ))
                .map((predefined, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h6 className="font-medium text-sm">{predefined.title}</h6>
                          <Badge variant="outline" className="text-xs">
                            {predefined.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{predefined.instruction}</p>
                      </div>
                      <Button 
                        onClick={() => addPredefinedInstruction(predefined)}
                        variant="ghost" 
                        size="sm"
                        disabled={editingId !== null || isAddingNew}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}