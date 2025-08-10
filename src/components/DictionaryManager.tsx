import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2 as Trash, Pencil as PencilSimple, Save as FloppyDisk, X, BookOpen, History as ClockCounterClockwise, Upload as UploadSimple } from 'lucide-react'
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
  transcript?: string
}

type DictionaryVersion = {
  id: string
  name: string
  timestamp: number
  entries: DictionaryEntry[]
}

const LOCAL_STORAGE_VERSIONS_KEY = 'dictionary_versions'

const INDUSTRY_TEMPLATES: Record<string, Array<Pick<DictionaryEntry, 'term' | 'definition' | 'context'>>> = {
  Tech: [
    { term: 'API', definition: 'Application Programming Interface', context: 'Technical discussions' },
    { term: 'SLA', definition: 'Service Level Agreement', context: 'Operations and support' },
    { term: 'CI/CD', definition: 'Continuous Integration and Continuous Delivery/Deployment', context: 'Engineering' },
    { term: 'OKR', definition: 'Objectives and Key Results', context: 'Planning' },
  ],
  Legal: [
    { term: 'NDA', definition: 'Non-Disclosure Agreement', context: 'Legal' },
    { term: 'MSA', definition: 'Master Services Agreement', context: 'Legal' },
    { term: 'SOW', definition: 'Statement of Work', context: 'Legal' },
  ],
  Healthcare: [
    { term: 'HIPAA', definition: 'Health Insurance Portability and Accountability Act', context: 'Compliance' },
    { term: 'PHI', definition: 'Protected Health Information', context: 'Compliance' },
  ],
  Finance: [
    { term: 'ARR', definition: 'Annual Recurring Revenue', context: 'SaaS finance' },
    { term: 'MRR', definition: 'Monthly Recurring Revenue', context: 'SaaS finance' },
    { term: 'EBITDA', definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization', context: 'Finance' },
  ],
}

const ACRONYM_KNOWN_MAP: Record<string, string> = {
  API: 'Application Programming Interface',
  ROI: 'Return on Investment',
  KPI: 'Key Performance Indicator',
  MVP: 'Minimum Viable Product',
  SLA: 'Service Level Agreement',
  OKR: 'Objectives and Key Results',
  GDPR: 'General Data Protection Regulation',
  HIPAA: 'Health Insurance Portability and Accountability Act',
  SOC2: 'System and Organization Controls 2',
  PCI: 'Payment Card Industry Data Security Standard',
  NPS: 'Net Promoter Score',
  ARR: 'Annual Recurring Revenue',
  MRR: 'Monthly Recurring Revenue',
  LTV: 'Customer Lifetime Value',
  CAC: 'Customer Acquisition Cost',
  ETA: 'Estimated Time of Arrival',
  ASAP: 'As Soon As Possible',
}

export default function DictionaryManager({ dictionary, setDictionary, transcript }: DictionaryManagerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEntry, setNewEntry] = useState({ term: '', definition: '', context: '' })
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Tech')
  const [versions, setVersions] = useState<DictionaryVersion[]>([])
  const [customAcronymDefs, setCustomAcronymDefs] = useState<Record<string, string>>({})

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

    setDictionary(Array.isArray(dictionary) ? [...dictionary, entry] : [entry])
    setNewEntry({ term: '', definition: '', context: '' })
    setIsAddingNew(false)
    toast.success('Term added to dictionary')
  }

  const deleteEntry = (id: string) => {
    setDictionary(Array.isArray(dictionary) ? dictionary.filter(entry => entry.id !== id) : [])
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

    setDictionary(Array.isArray(dictionary) ? dictionary.map(entry => 
      entry.id === editingId 
        ? {
            ...entry,
            term: newEntry.term.trim(),
            definition: newEntry.definition.trim(),
            context: newEntry.context.trim() || undefined
          }
        : entry
    ) : [])
    
    setEditingId(null)
    setNewEntry({ term: '', definition: '', context: '' })
    toast.success('Term updated')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAddingNew(false)
    setNewEntry({ term: '', definition: '', context: '' })
  }

  // Load and persist versions to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_VERSIONS_KEY)
      if (raw) {
        setVersions(JSON.parse(raw))
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_VERSIONS_KEY, JSON.stringify(versions))
    } catch {}
  }, [versions])

  const saveSnapshot = () => {
    const name = `Snapshot ${new Date().toLocaleString()}`
    const snapshot: DictionaryVersion = {
      id: Date.now().toString(),
      name,
      timestamp: Date.now(),
      entries: Array.isArray(dictionary) ? [...dictionary] : [],
    }
    setVersions((prev) => [snapshot, ...prev])
    toast.success('Dictionary snapshot saved')
  }

  const restoreSnapshot = (version: DictionaryVersion) => {
    setDictionary(version.entries)
    toast.success(`Restored: ${version.name}`)
  }

  const deleteSnapshot = (id: string) => {
    setVersions((prev) => prev.filter((v) => v.id !== id))
    toast.success('Snapshot deleted')
  }

  // Contextual acronym detection from transcript
  const transcriptAcronyms = useMemo(() => {
    if (!transcript) return [] as string[]
    const found = new Set<string>()
    const regex = /\b[A-Z]{2,5}\b/g
    for (const match of transcript.match(regex) || []) {
      // Skip if already in dictionary
      if (Array.isArray(dictionary) && dictionary.some((e) => e.term.toLowerCase() === match.toLowerCase())) continue
      found.add(match)
    }
    return Array.from(found).sort()
  }, [transcript, dictionary])

  const addAcronym = (acronym: string) => {
    const def = ACRONYM_KNOWN_MAP[acronym] || customAcronymDefs[acronym]
    if (!def) {
      toast.error('Provide a definition first')
      return
    }
    const entry: DictionaryEntry = {
      id: Date.now().toString(),
      term: acronym,
      definition: def,
      context: 'Acronym',
    }
    setDictionary(Array.isArray(dictionary) ? [...dictionary, entry] : [entry])
    setCustomAcronymDefs((prev) => {
      const next = { ...prev }
      delete next[acronym]
      return next
    })
    toast.success(`Added ${acronym}`)
  }

  const importTemplate = (templateName: string) => {
    const terms = INDUSTRY_TEMPLATES[templateName] || []
    const toAdd = terms.filter(
      (t) => !Array.isArray(dictionary) || !dictionary.some((e) => e.term.toLowerCase() === t.term.toLowerCase())
    )
    if (toAdd.length === 0) {
      toast.info('All template terms already exist')
      return
    }
    const entries: DictionaryEntry[] = toAdd.map((t) => ({ id: `${templateName}-${t.term}-${Date.now()}`, ...t }))
    setDictionary(Array.isArray(dictionary) ? [...dictionary, ...entries] : entries)
    toast.success(`Imported ${toAdd.length} terms from ${templateName}`)
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
    if (Array.isArray(dictionary) && dictionary.some(entry => entry.term.toLowerCase() === suggested.term.toLowerCase())) {
      toast.error('Term already exists in dictionary')
      return
    }

    const entry: DictionaryEntry = {
      id: Date.now().toString(),
      ...suggested
    }

    setDictionary(Array.isArray(dictionary) ? [...dictionary, entry] : [entry])
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
          {/* Industry Templates */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <label className="text-sm font-medium">Industry template</label>
            <div className="flex items-center gap-2">
              <select
                className="border border-border bg-background rounded px-2 py-1 text-sm"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                aria-label="Industry template"
              >
                {Object.keys(INDUSTRY_TEMPLATES).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={() => importTemplate(selectedTemplate)}>
                <UploadSimple className="h-4 w-4 mr-2" /> Import
              </Button>
            </div>
          </div>

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
                  <FloppyDisk className="h-4 w-4 mr-2" />
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
            {(!Array.isArray(dictionary) || dictionary.length === 0) && !isAddingNew ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No terms in your dictionary yet</p>
                <p className="text-sm">Add terms to help the AI understand your organization's language</p>
              </div>
            ) : (
              (Array.isArray(dictionary) ? dictionary : []).map((entry) => (
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
                          <FloppyDisk className="h-4 w-4 mr-2" />
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
                          <PencilSimple className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => deleteEntry(entry.id)} 
                          variant="outline" 
                          size="sm"
                          disabled={editingId !== null || isAddingNew}
                        >
                          <Trash className="h-4 w-4" />
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

      {/* Contextual Suggestions and Acronym Expansion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Smart Suggestions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detected acronyms from transcript and common business terms
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Acronym suggestions from transcript */}
          {transcriptAcronyms.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Detected acronyms</p>
              <div className="space-y-2">
                {transcriptAcronyms.map((acr) => (
                  <div key={acr} className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">{acr}</Badge>
                    <span className="text-xs text-muted-foreground flex-1">
                      {ACRONYM_KNOWN_MAP[acr] || 'Provide a definition'}
                    </span>
                    {!ACRONYM_KNOWN_MAP[acr] && (
                      <Input
                        placeholder={`Define ${acr}`}
                        value={customAcronymDefs[acr] || ''}
                        onChange={(e) => setCustomAcronymDefs((prev) => ({ ...prev, [acr]: e.target.value }))}
                        className="h-8 w-56"
                      />
                    )}
                    <Button size="sm" onClick={() => addAcronym(acr)}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generic suggested business terms when dictionary small */}
          {(!Array.isArray(dictionary) || dictionary.length < 10) && (
            <div>
              <p className="text-sm font-medium mb-2">Suggested business terms</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedTerms
                  .filter(suggested => !Array.isArray(dictionary) || !dictionary.some(entry => 
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Version Control</CardTitle>
            <Button size="sm" onClick={saveSnapshot}>
              <ClockCounterClockwise className="h-4 w-4 mr-2" /> Save Snapshot
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Track changes, restore previous dictionary states</p>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No snapshots yet</p>
          ) : (
            <div className="space-y-2">
              {versions.map((v) => (
                <div key={v.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <p className="text-sm font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(v.timestamp).toLocaleString()} • {v.entries.length} terms</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => restoreSnapshot(v)}>Restore</Button>
                    <Button size="sm" variant="outline" onClick={() => deleteSnapshot(v.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}