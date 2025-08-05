import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, Edit2, Save, X, BookOpen } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DictionaryEntry {
  id: string
  term: string
  definition: string
  context?: string
}

interface DictionaryManagerProps {
  dictionary: DictionaryEntry[]
  setDictionary: (dictionary: DictionaryEntry[]) => void
}

export default function DictionaryManager({ dictionary, setDictionary }: DictionaryManagerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEntry, setNewEntry] = useState({ term: '', definition: '', context: '' })

  const addEntry = () => {
    if (!newEntry.term.trim() || !newEntry.definition.trim()) {
      toast.error('Term and definition are required')
      return
    }

    const entry: DictionaryEntry = {
      id: Date.now().toString(),
      term: newEntry.term.trim(),
      definition: newEntry.definition.trim(),
      context: newEntry.context.trim() || undefined
    }

    setDictionary([...dictionary, entry])
    setNewEntry({ term: '', definition: '', context: '' })
    setIsAddingNew(false)
    toast.success('Term added to dictionary')
  }

  const deleteEntry = (id: string) => {
    setDictionary(dictionary.filter(entry => entry.id !== id))
    toast.success('Term removed from dictionary')
  }

  const startEdit = (entry: DictionaryEntry) => {
    setEditingId(entry.id)
    setNewEntry({
      term: entry.term,
      definition: entry.definition,
      context: entry.context || ''
    })
  }

  const saveEdit = () => {
    if (!newEntry.term.trim() || !newEntry.definition.trim()) {
      toast.error('Term and definition are required')
      return
    }

    setDictionary(dictionary.map(entry => 
      entry.id === editingId 
        ? {
            ...entry,
            term: newEntry.term.trim(),
            definition: newEntry.definition.trim(),
            context: newEntry.context.trim() || undefined
          }
        : entry
    ))
    
    setEditingId(null)
    setNewEntry({ term: '', definition: '', context: '' })
    toast.success('Term updated')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAddingNew(false)
    setNewEntry({ term: '', definition: '', context: '' })
  }

  const suggestedTerms = [
    { term: 'AI', definition: 'Artificial Intelligence', context: 'Technology discussions' },
    { term: 'ROI', definition: 'Return on Investment', context: 'Financial metrics' },
    { term: 'KPI', definition: 'Key Performance Indicator', context: 'Business metrics' },
    { term: 'MVP', definition: 'Minimum Viable Product', context: 'Product development' },
    { term: 'API', definition: 'Application Programming Interface', context: 'Technical discussions' },
    { term: 'SLA', definition: 'Service Level Agreement', context: 'Operations and support' }
  ]

  const addSuggestedTerm = (suggested: { term: string; definition: string; context: string }) => {
    if (dictionary.some(entry => entry.term.toLowerCase() === suggested.term.toLowerCase())) {
      toast.error('Term already exists in dictionary')
      return
    }

    const entry: DictionaryEntry = {
      id: Date.now().toString(),
      ...suggested
    }

    setDictionary([...dictionary, entry])
    toast.success(`Added ${suggested.term} to dictionary`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Terminology Dictionary</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Define custom terms and acronyms to help the AI understand your organization's language
              </p>
            </div>
            <Button 
              onClick={() => setIsAddingNew(true)} 
              disabled={isAddingNew || editingId !== null}
              className="bg-accent hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Term
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Entry Form */}
          {isAddingNew && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Term *</label>
                  <Input
                    placeholder="e.g., API, ROI, MVP"
                    value={newEntry.term}
                    onChange={(e) => setNewEntry({ ...newEntry, term: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Context (Optional)</label>
                  <Input
                    placeholder="e.g., Technical discussions"
                    value={newEntry.context}
                    onChange={(e) => setNewEntry({ ...newEntry, context: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Definition *</label>
                <Textarea
                  placeholder="Full definition or expansion of the term"
                  value={newEntry.definition}
                  onChange={(e) => setNewEntry({ ...newEntry, definition: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addEntry} size="sm">
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

          {/* Dictionary Entries */}
          <div className="space-y-3">
            {dictionary.length === 0 && !isAddingNew ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No terms in your dictionary yet</p>
                <p className="text-sm">Add terms to help the AI understand your organization's language</p>
              </div>
            ) : (
              dictionary.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  {editingId === entry.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Term *</label>
                          <Input
                            value={newEntry.term}
                            onChange={(e) => setNewEntry({ ...newEntry, term: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Context (Optional)</label>
                          <Input
                            value={newEntry.context}
                            onChange={(e) => setNewEntry({ ...newEntry, context: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Definition *</label>
                        <Textarea
                          value={newEntry.definition}
                          onChange={(e) => setNewEntry({ ...newEntry, definition: e.target.value })}
                          className="min-h-[80px]"
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
                          <Badge variant="secondary" className="font-mono">
                            {entry.term}
                          </Badge>
                          {entry.context && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {entry.context}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{entry.definition}</p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button 
                          onClick={() => startEdit(entry)} 
                          variant="outline" 
                          size="sm"
                          disabled={editingId !== null || isAddingNew}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => deleteEntry(entry.id)} 
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
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Terms */}
      {dictionary.length < 10 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggested Business Terms</CardTitle>
            <p className="text-sm text-muted-foreground">
              Common terms you might want to add to your dictionary
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedTerms
                .filter(suggested => !dictionary.some(entry => 
                  entry.term.toLowerCase() === suggested.term.toLowerCase()
                ))
                .map((suggested, index) => (
                  <div key={index} className="border rounded-lg p-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {suggested.term}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {suggested.context}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{suggested.definition}</p>
                    </div>
                    <Button 
                      onClick={() => addSuggestedTerm(suggested)}
                      variant="ghost" 
                      size="sm"
                      disabled={editingId !== null || isAddingNew}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
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