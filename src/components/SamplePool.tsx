import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  FileText, 
  Trash, 
  Eye, 
  Tag, 
  Calendar,
  Users,
  Sparkles,
  FolderOpen,
  Plus,
  Search,
  X
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

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

interface SamplePoolProps {
  samples: SampleMinute[]
  setSamples: (samples: SampleMinute[] | ((prev: SampleMinute[]) => SampleMinute[])) => void
}

export default function SamplePool({ samples, setSamples }: SamplePoolProps) {
  const [selectedSample, setSelectedSample] = useState<SampleMinute | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAddingManually, setIsAddingManually] = useState(false)
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
          tags: ['uploaded'],
          dateAdded: new Date().toISOString(),
          fileSize: file.size
        }
        
        setSamples(prev => Array.isArray(prev) ? [...prev, sample] : [sample])
        toast.success(`Added sample: ${sample.name}`)
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
      tags: newSample.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dateAdded: new Date().toISOString(),
      fileSize: newSample.content.length,
      meetingType: newSample.meetingType || undefined,
      organization: newSample.organization || undefined
    }

    setSamples(prev => Array.isArray(prev) ? [...prev, sample] : [sample])
    setNewSample({ name: '', content: '', tags: '', meetingType: '', organization: '' })
    setIsAddingManually(false)
    toast.success(`Added sample: ${sample.name}`)
  }

  const deleteSample = (id: string) => {
    setSamples(prev => Array.isArray(prev) ? prev.filter(s => s.id !== id) : [])
    if (selectedSample?.id === id) {
      setSelectedSample(null)
    }
    toast.success('Sample deleted')
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
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => sample.tags.includes(tag))
    return matchesSearch && matchesTags
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

  return (
    <div className="space-y-6">
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            Sample Minutes Pool
            <Badge variant="secondary" className="ml-auto">
              {Array.isArray(samples) ? samples.length : 0} samples
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Build a library of your organization's meeting minutes to guide AI generation style and format
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search samples..."
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
                Upload Files
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddingManually(true)}
                className="hover-lift transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Manually
              </Button>
            </div>
          </div>

          {/* Tag Filter */}
          {getAllTags().length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filter by tags:</span>
              {getAllTags().map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer transition-smooth hover:scale-105"
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="h-6 px-2"
                >
                  <X className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.md,.rtf,.docx"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
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
                  Add Sample Manually
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
                    <label className="text-sm font-medium mb-2 block">Sample Name *</label>
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
                  <label className="text-sm font-medium mb-2 block">Sample Content *</label>
                  <Textarea
                    placeholder="Paste your sample meeting minutes here..."
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
                    Add Sample
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Samples Grid */}
      {filteredSamples.length === 0 ? (
        <Card className="card-shadow">
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Sample Minutes Yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your organization's meeting minutes to improve AI generation quality
            </p>
            <div className="flex justify-center gap-2">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Samples
              </Button>
              <Button variant="outline" onClick={() => setIsAddingManually(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Manually
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSamples.map((sample, index) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className="card-shadow hover-lift transition-smooth cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {sample.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(sample.dateAdded)}
                        <span>•</span>
                        <span>{formatFileSize(sample.fileSize)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                </CardHeader>
                
                <CardContent className="pt-0">
                  {sample.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
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
                  
                  <div className="text-xs text-muted-foreground line-clamp-3">
                    {sample.content.substring(0, 150)}...
                  </div>
                  
                  {(sample.meetingType || sample.organization) && (
                    <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                      {sample.meetingType && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {sample.meetingType}
                        </div>
                      )}
                      {sample.organization && (
                        <div className="flex items-center gap-1 mt-1">
                          <Tag className="h-3 w-3" />
                          {sample.organization}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Sample Preview Modal */}
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
                  <Button variant="ghost" onClick={() => setSelectedSample(null)}>
                    <X className="h-4 w-4" />
                  </Button>
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
    </div>
  )
}