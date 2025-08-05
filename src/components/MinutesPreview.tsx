import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, Edit2, FileText, Users, CheckCircle, Clock } from '@phosphor-icons/react'

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

interface MinutesPreviewProps {
  minutes: GeneratedMinutes
  onExport: () => void
}

export default function MinutesPreview({ minutes, onExport }: MinutesPreviewProps) {
  const [editableContent, setEditableContent] = useState(minutes)

  const updateField = (field: keyof GeneratedMinutes, value: any) => {
    setEditableContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addArrayItem = (field: 'agenda' | 'keyDecisions' | 'nextSteps', item: string) => {
    if (!item.trim()) return
    updateField(field, [...editableContent[field], item.trim()])
  }

  const removeArrayItem = (field: 'agenda' | 'keyDecisions' | 'nextSteps', index: number) => {
    updateField(field, editableContent[field].filter((_, i) => i !== index))
  }

  const addActionItem = () => {
    updateField('actionItems', [...editableContent.actionItems, {
      task: 'New action item',
      assignee: 'Unassigned',
      dueDate: new Date().toISOString().split('T')[0]
    }])
  }

  const updateActionItem = (index: number, field: keyof GeneratedMinutes['actionItems'][0], value: string) => {
    const updated = editableContent.actionItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    updateField('actionItems', updated)
  }

  const removeActionItem = (index: number) => {
    updateField('actionItems', editableContent.actionItems.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{editableContent.title}</CardTitle>
              <p className="text-muted-foreground mt-1">{editableContent.date}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={onExport} className="bg-accent hover:bg-accent/90">
                <Download className="h-4 w-4 mr-2" />
                Export Minutes
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{editableContent.attendees.length}</div>
            <div className="text-xs text-muted-foreground">Attendees</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{editableContent.agenda.length}</div>
            <div className="text-xs text-muted-foreground">Agenda Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{editableContent.keyDecisions.length}</div>
            <div className="text-xs text-muted-foreground">Decisions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{editableContent.actionItems.length}</div>
            <div className="text-xs text-muted-foreground">Action Items</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {editableContent.attendees.map((attendee, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {attendee}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agenda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Agenda Items Discussed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {editableContent.agenda.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm">{item}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Key Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Key Decisions Made
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {editableContent.keyDecisions.map((decision, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm">{decision}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Action Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {editableContent.actionItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{item.task}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Assigned to: <Badge variant="outline" className="text-xs">{item.assignee}</Badge>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {item.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps & Follow-ups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {editableContent.nextSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-sm">{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">Ready to Export</h3>
              <p className="text-sm text-muted-foreground">
                Download your meeting minutes as a formatted Markdown file
              </p>
            </div>
            <Button onClick={onExport} size="lg" className="bg-accent hover:bg-accent/90">
              <Download className="h-5 w-5 mr-2" />
              Export Minutes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}