import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Upload,
  FileText,
  Trash,
  Eye,
  Sparkles,
  FolderOpen,
  Plus,
  Search,
  X,
  BarChart3,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import type { SampleMinute, TemplateProfile } from '@/types'
import type { AIService } from '@/lib/aiService'

interface TemplateManagerProps {
  samples: SampleMinute[]
  setSamples: (samples: SampleMinute[] | ((prev: SampleMinute[]) => SampleMinute[])) => void
  templateProfiles: TemplateProfile[]
  setTemplateProfiles: (profiles: TemplateProfile[] | ((prev: TemplateProfile[]) => TemplateProfile[])) => void
  selectedTemplateProfile: TemplateProfile | null
  setSelectedTemplateProfile: (profile: TemplateProfile | null) => void
  aiService: AIService | null
}

export default function TemplateManager({
  samples,
  setSamples,
  templateProfiles,
  setTemplateProfiles,
  selectedTemplateProfile,
  setSelectedTemplateProfile,
  aiService
}: TemplateManagerProps) {
  const [selectedSample, setSelectedSample] = useState<SampleMinute | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<TemplateProfile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingManually, setIsAddingManually] = useState(false)
  const [isProfileProfiles, setIsProfilingProfiles] = useState(false)
  const [profilingProgress, setProfilingProgress] = useState(0)
  const [profilingStatus, setProfilingStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Manual sample form state
  const [newSample, setNewSample] = useState({
    name: '',
    content: '',
    tags: '',
    meetingType: '',
    organization: ''
  })

  const handleFileUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      try {
        const content = await file.text()
        const sample: SampleMinute = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name.replace(/\.[^/.]+$/, ""),
          content,
          tags: ['uploaded', 'template'],
          dateAdded: new Date().toISOString(),
          fileSize: file.size
        }
        
        setSamples(prev => Array.isArray(prev) ? [...prev, sample] : [sample])
        toast.success(`Added template: ${sample.name}`)
      } catch (error) {
        toast.error(`Failed to process ${file.name}`)
      }
    }
  }

  const handleManualAdd = () => {
    if (!newSample.name.trim() || !newSample.content.trim()) {
      toast.error('Please provide both name and content')
      return
    }

    const sample: SampleMinute = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSample.name,
      content: newSample.content,
      tags: [...newSample.tags.split(',').map(tag => tag.trim()).filter(Boolean), 'template'],
      dateAdded: new Date().toISOString(),
      fileSize: newSample.content.length,
      meetingType: newSample.meetingType || undefined,
      organization: newSample.organization || undefined
    }

    setSamples(prev => Array.isArray(prev) ? [...prev, sample] : [sample])
    setNewSample({ name: '', content: '', tags: '', meetingType: '', organization: '' })
    setIsAddingManually(false)
    toast.success(`Added template: ${sample.name}`)
  }

  const profileSample = async (sample: SampleMinute) => {
    if (!aiService) {
      toast.error('AI service is not configured. Please set up your API connection first.')
      return
    }

    setIsProfilingProfiles(true)
    setProfilingProgress(0)
    setProfilingStatus('Initializing profiling...')

    try {
      const profile = await aiService.profileTemplate(sample, (progress, status) => {
        setProfilingProgress(progress)
        setProfilingStatus(status)
      })

      setTemplateProfiles(prev => Array.isArray(prev) ? [...prev, profile] : [profile])
      toast.success(`Template profiled successfully! Confidence: ${Math.round(profile.confidence * 100)}%`)
    } catch (error) {
      console.error('Template profiling error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to profile template: ${errorMessage}`)
    } finally {
      setIsProfilingProfiles(false)
      setProfilingProgress(0)
      setProfilingStatus('')
    }
  }

  const deleteSample = (id: string) => {
    setSamples(prev => Array.isArray(prev) ? prev.filter(s => s.id !== id) : [])
    if (selectedSample?.id === id) {
      setSelectedSample(null)
    }
    toast.success('Template deleted')
  }

  const deleteProfile = (id: string) => {
    setTemplateProfiles(prev => Array.isArray(prev) ? prev.filter(p => p.id !== id) : [])
    if (selectedTemplateProfile?.id === id) {
      setSelectedTemplateProfile(null)
    }
    if (selectedProfile?.id === id) {
      setSelectedProfile(null)
    }
    toast.success('Template profile deleted')
  }

  const selectProfileForGeneration = (profile: TemplateProfile) => {
    setSelectedTemplateProfile(profile)
    toast.success(`Selected template profile: ${profile.name}`)
  }

  const getAllTags = () => {
    const tags = new Set<string>()
    if (Array.isArray(samples)) {
      samples.forEach(sample => {
        sample.tags.forEach(tag => tags.add(tag))
      })
    }
    return Array.from(tags).sort()
  }

  const filteredSamples = Array.isArray(samples) ? samples.filter(sample => {
    const matchesSearch = sample.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  }) : []

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return CheckCircle
    if (confidence >= 0.6) return AlertTriangle
    return AlertTriangle
  }

  return (
    <div className="space-y-6">
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            Template Manager
            <Badge variant="secondary" className="ml-auto">
              {Array.isArray(samples) ? samples.length : 0} templates • {Array.isArray(templateProfiles) ? templateProfiles.length : 0} profiles
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Manage and profile meeting minute templates to ensure consistent structure and format
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="hover-lift transition-smooth"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Templates
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddingManually(true)}
                className="hover-lift transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>
          </div>

          {/* Active Template Profile */}
          {selectedTemplateProfile && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Active Template:</strong> {selectedTemplateProfile.name} 
                <span className="ml-2 text-sm text-muted-foreground">
                  (Confidence: {Math.round(selectedTemplateProfile.confidence * 100)}%)
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedTemplateProfile(null)}
                  className="ml-2 h-auto p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Profiling Progress */}
          {isProfilingProfiles && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Profiling template structure...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(profilingProgress)}%</span>
                </div>
                <Progress value={profilingProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">{profilingStatus}</p>
              </AlertDescription>
            </Alert>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.md,.rtf,.docx"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="template-file-input"
            aria-label="Upload template files"
            title="Upload template files"
          />
        </CardContent>
      </Card>

      {/* Manual Add Form */}
      <AnimatePresence>
        {isAddingManually && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Add Template Manually
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingManually(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Template Name *</label>
                    <Input
                      placeholder="e.g., Board Meeting Template"
                      value={newSample.name}
                      onChange={(e) => setNewSample(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <Input
                      placeholder="board, formal, quarterly (comma separated)"
                      value={newSample.tags}
                      onChange={(e) => setNewSample(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Meeting Type</label>
                    <Input
                      placeholder="e.g., Board Meeting, Stand-up, Review"
                      value={newSample.meetingType}
                      onChange={(e) => setNewSample(prev => ({ ...prev, meetingType: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Organization</label>
                    <Input
                      placeholder="e.g., Acme Corp, Product Team"
                      value={newSample.organization}
                      onChange={(e) => setNewSample(prev => ({ ...prev, organization: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Template Content *</label>
                  <Textarea
                    placeholder="Paste your template meeting minutes here..."
                    value={newSample.content}
                    onChange={(e) => setNewSample(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingManually(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleManualAdd} className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates and Profiles Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Templates */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Templates ({filteredSamples.length})
          </h3>
          
          {filteredSamples.length === 0 ? (
            <Card className="card-shadow">
              <CardContent className="p-12 text-center">
                <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No Templates Yet</h4>
                <p className="text-muted-foreground mb-4">
                  Add meeting minute templates to improve AI generation consistency
                </p>
                <div className="flex justify-center gap-2">
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Templates
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingManually(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Manually
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredSamples.map((sample, index) => (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="card-shadow hover-lift transition-smooth cursor-pointer group p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                          {sample.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{formatDate(sample.dateAdded)}</span>
                          <span>•</span>
                          <span>{formatFileSize(sample.fileSize)}</span>
                        </div>
                        {sample.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sample.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {sample.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{sample.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            profileSample(sample)
                          }}
                          disabled={!aiService || isProfilingProfiles}
                          title="Profile this template to analyze its structure"
                        >
                          <BarChart3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSample(sample)
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSample(sample.id)
                          }}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Template Profiles */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Template Profiles ({Array.isArray(templateProfiles) ? templateProfiles.length : 0})
          </h3>
          
          {!Array.isArray(templateProfiles) || templateProfiles.length === 0 ? (
            <Card className="card-shadow">
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No Template Profiles</h4>
                <p className="text-muted-foreground mb-4">
                  Profile your templates to analyze their structure and improve generation accuracy
                </p>
                {!aiService && (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      AI service must be configured to profile templates
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {templateProfiles.map((profile, index) => {
                const ConfidenceIcon = getConfidenceIcon(profile.confidence)
                return (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className={`card-shadow hover-lift transition-smooth cursor-pointer group p-4 ${
                      selectedTemplateProfile?.id === profile.id ? 'ring-2 ring-primary' : ''
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {profile.name}
                            </h4>
                            <ConfidenceIcon className={`h-3 w-3 ${getConfidenceColor(profile.confidence)}`} />
                            <span className={`text-xs font-medium ${getConfidenceColor(profile.confidence)}`}>
                              {Math.round(profile.confidence * 100)}%
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {formatDate(profile.createdAt)} • {profile.structure.format} format
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {profile.structure.sections.length} sections • 
                            {profile.structure.customFields.length} custom fields
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {profile.structure.format}
                            </Badge>
                            {profile.structure.hasActionItems && (
                              <Badge variant="outline" className="text-xs">
                                Action Items
                              </Badge>
                            )}
                            {profile.structure.hasAgenda && (
                              <Badge variant="outline" className="text-xs">
                                Agenda
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              selectProfileForGeneration(profile)
                            }}
                            title="Use this profile for generation"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedProfile(profile)
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteProfile(profile.id)
                            }}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedSample && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSample(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-lg border max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedSample.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{formatDate(selectedSample.dateAdded)}</span>
                      <span>{formatFileSize(selectedSample.fileSize)}</span>
                      {selectedSample.meetingType && <span>{selectedSample.meetingType}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => profileSample(selectedSample)}
                      disabled={!aiService || isProfilingProfiles}
                      variant="outline"
                      size="sm"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Profile Template
                    </Button>
                    <Button variant="ghost" onClick={() => setSelectedSample(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {selectedSample.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {selectedSample.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6 overflow-auto max-h-[60vh] custom-scrollbar">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {selectedSample.content}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Analysis Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-lg border max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedProfile.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>Confidence: {Math.round(selectedProfile.confidence * 100)}%</span>
                      <span>•</span>
                      <span>{formatDate(selectedProfile.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => selectProfileForGeneration(selectedProfile)}
                      variant="outline"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Use Profile
                    </Button>
                    <Button variant="ghost" onClick={() => setSelectedProfile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 overflow-auto max-h-[60vh] custom-scrollbar space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Structure Analysis</h4>
                  <div className="bg-muted/50 p-3 rounded-md space-y-2">
                    <div><strong>Format:</strong> {selectedProfile.structure.format}</div>
                    <div><strong>Sections:</strong> {selectedProfile.structure.sections.join(', ')}</div>
                    <div><strong>Features:</strong> 
                      {selectedProfile.structure.hasActionItems && <Badge variant="outline" className="ml-2">Action Items</Badge>}
                      {selectedProfile.structure.hasAttendees && <Badge variant="outline" className="ml-2">Attendees</Badge>}
                      {selectedProfile.structure.hasAgenda && <Badge variant="outline" className="ml-2">Agenda</Badge>}
                    </div>
                    {selectedProfile.structure.customFields.length > 0 && (
                      <div><strong>Custom Fields:</strong> {selectedProfile.structure.customFields.join(', ')}</div>
                    )}
                    {Object.keys(selectedProfile.structure.fieldMappings).length > 0 && (
                      <div>
                        <strong>Field Mappings:</strong>
                        <ul className="mt-1 ml-4">
                          {Object.entries(selectedProfile.structure.fieldMappings).map(([standard, template]) => (
                            <li key={standard} className="text-sm">
                              {standard} → {template}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Analysis Details</h4>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm">{selectedProfile.analysis}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}