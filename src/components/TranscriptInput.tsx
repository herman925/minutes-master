import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Upload,
  FileText,
  Sparkles,
  Check,
  X,
  Loader2,
  Mic,
  Video,
  File
} from 'lucide-react'
import { toast } from 'sonner'

interface TranscriptInputProps {
  transcript: string
  setTranscript: (transcript: string) => void
  onGenerate: () => void
  isGenerating: boolean
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  content: string
  status: 'processing' | 'completed' | 'error'
}

export default function TranscriptInput({ 
  transcript, 
  setTranscript, 
  onGenerate, 
  isGenerating 
}: TranscriptInputProps) {
  const [activeTab, setActiveTab] = useState('paste')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supportedFormats = {
    text: ['.txt', '.md', '.rtf'],
    document: ['.docx', '.pdf'],
    audio: ['.mp3', '.wav', '.m4a', '.ogg'],
    video: ['.mp4', '.mov', '.avi', '.webm']
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop()
    if (['mp3', 'wav', 'm4a', 'ogg'].includes(ext || '')) return <Mic className="h-4 w-4" />
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext || '')) return <Video className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const handleFileUpload = async (files: FileList) => {
    setIsProcessing(true)
    
    const newFiles: UploadedFile[] = []
    let combinedContent = ''

    for (const file of Array.from(files)) {
      const fileId = Math.random().toString(36).substr(2, 9)
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        content: '',
        status: 'processing'
      }
      
      newFiles.push(newFile)
      setUploadedFiles(prev => [...prev, newFile])

      try {
        let content = ''
        const ext = file.name.toLowerCase().split('.').pop()

        if (['txt', 'md', 'rtf'].includes(ext || '')) {
          // Text files - direct read
          content = await file.text()
        } else if (['mp3', 'wav', 'm4a', 'ogg', 'mp4', 'mov', 'avi', 'webm'].includes(ext || '')) {
          // Audio/Video files - simulate transcription (in real app, would use Whisper API)
          await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing
          content = `[Transcribed from ${file.name}]\n\nJohn: Welcome everyone to today's meeting. Thank you all for joining.\n\nSarah: Thanks for organizing this session. I have the quarterly reports ready.\n\nMike: Great, let's start with the review of our key metrics...\n\n[Note: This is a simulated transcription. In production, this would use OpenAI Whisper or similar service]`
        } else if (ext === 'docx' || ext === 'pdf') {
          // Document files - simulate extraction (in real app, would parse documents)
          await new Promise(resolve => setTimeout(resolve, 1500))
          content = `[Extracted from ${file.name}]\n\nMeeting Minutes\nDate: March 15, 2024\nAttendees: John Smith, Sarah Johnson, Mike Davis\n\nDiscussion:\n- Reviewed quarterly performance\n- Discussed upcoming projects\n- Planned next steps\n\n[Note: This is simulated extraction. In production, this would use document parsing libraries]`
        }

        // Update file status
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, content, status: 'completed' as const }
              : f
          )
        )

        combinedContent += content + '\n\n'
        
      } catch (error) {
        console.error('File processing error:', error)
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'error' as const }
              : f
          )
        )
        toast.error(`Failed to process ${file.name}`)
      }
    }

    if (combinedContent.trim()) {
      setTranscript(prev => prev ? `${prev}\n\n${combinedContent}` : combinedContent)
      toast.success(`Successfully processed ${newFiles.length} file(s)`)
    }

    setIsProcessing(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            Meeting Transcript Input
          </CardTitle>
          <p className="text-muted-foreground">
            Add your meeting transcript by pasting text directly or uploading files in various formats
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Paste Text
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-4">
              <Textarea
                placeholder="Paste your meeting transcript here...

Example:
John: Good morning everyone, thanks for joining today's product review meeting.
Sarah: Thanks for organizing this. I've prepared the Q3 metrics report.
Mike: Let's start with the user feedback analysis...

Speaker 1: [00:05] Welcome to the quarterly review session.
Speaker 2: [00:12] Thank you for having me. I'll present the findings first."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[300px] font-mono text-sm custom-scrollbar transition-smooth focus-ring"
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {transcript.length.toLocaleString()} characters • {transcript.split('\n').filter(line => line.trim()).length} lines
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTranscript('')}
                    disabled={!transcript.trim()}
                  >
                    Clear
                  </Button>
                  <Button 
                    onClick={onGenerate} 
                    disabled={!transcript.trim() || isGenerating}
                    className="bg-accent hover:bg-accent/90 transition-smooth"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Minutes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              {/* File Upload Area */}
              <label
                htmlFor="transcript-upload-input"
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-smooth cursor-pointer block"
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Transcript Files</h3>
                <p id="upload-instructions" className="text-muted-foreground mb-4">
                  Drag and drop files here, or click to browse
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    TXT, MD, RTF
                  </div>
                  <div className="flex items-center gap-1">
                    <File className="h-3 w-3" />
                    DOCX, PDF
                  </div>
                  <div className="flex items-center gap-1">
                    <Mic className="h-3 w-3" />
                    MP3, WAV, M4A
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    MP4, MOV, AVI
                  </div>
                </div>
                
                <input
                  id="transcript-upload-input"
                  aria-label="Choose transcript files to upload"
                  aria-describedby="upload-instructions"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.md,.rtf,.docx,.pdf,.mp3,.wav,.m4a,.ogg,.mp4,.mov,.avi,.webm"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>

              {/* Processing Indicator */}
              {isProcessing && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    Processing uploaded files... This may take a moment for audio/video files.
                  </AlertDescription>
                </Alert>
              )}

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Uploaded Files</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className="flex items-center justify-between p-3 border rounded-lg bg-card"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.name)}
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {file.status === 'processing' && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          )}
                          {file.status === 'completed' && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          {file.status === 'error' && (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={onGenerate} 
                      disabled={!transcript.trim() || isGenerating}
                      className="bg-accent hover:bg-accent/90 transition-smooth"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Minutes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}