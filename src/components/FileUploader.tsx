import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, X, AlertCircle, FileAudio, Film } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: 'sample' | 'transcript' | 'audio' | 'video'
  content?: string
}

interface FileUploaderProps {
  onFilesUploaded: (files: UploadedFile[], transcription?: string) => void
  isProcessing: boolean
}

export default function FileUploader({ onFilesUploaded, isProcessing }: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    for (const file of files) {
      const fileType = determineFileType(file)
      
      if (fileType === 'unsupported') {
        toast.error(`Unsupported file type: ${file.name}`)
        continue
      }

      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: fileType
      }

      if (fileType === 'sample' || fileType === 'transcript') {
        // Read text content
        const content = await readTextFile(file)
        uploadedFile.content = content
      } else if (fileType === 'audio' || fileType === 'video') {
        // Handle audio/video transcription
        await transcribeMedia(file, uploadedFile)
      }

      setUploadedFiles(prev => [...prev, uploadedFile])
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    toast.success(`Uploaded ${files.length} file(s)`)
  }

  const determineFileType = (file: File): UploadedFile['type'] | 'unsupported' => {
    const extension = file.name.toLowerCase().split('.').pop()
    const mimeType = file.type.toLowerCase()

    // Audio files
    if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'ogg'].includes(extension!)) {
      return 'audio'
    }

    // Video files
    if (mimeType.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension!)) {
      return 'video'
    }

    // Text files
    if (mimeType.startsWith('text/') || ['txt', 'md'].includes(extension!)) {
      return 'transcript'
    }

    // Document files (treating as samples for now)
    if (['pdf', 'docx', 'doc'].includes(extension!)) {
      return 'sample'
    }

    return 'unsupported'
  }

  const readTextFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  const transcribeMedia = async (file: File, uploadedFile: UploadedFile) => {
    setIsTranscribing(true)
    setTranscriptionProgress(10)

    try {
      // Convert file to base64 for API call
      const base64 = await fileToBase64(file)
      setTranscriptionProgress(30)

      // Create transcription prompt
      const prompt = spark.llmPrompt`Please transcribe this ${uploadedFile.type} file. Extract all spoken content and identify speakers if possible. Format as:

Speaker: Dialogue content

If speakers cannot be identified, use Speaker 1, Speaker 2, etc.

File: ${file.name}
Content: ${base64.substring(0, 1000)}...`

      setTranscriptionProgress(60)

      const transcription = await spark.llm(prompt, 'gpt-4o', false)
      setTranscriptionProgress(90)

      uploadedFile.content = transcription
      setTranscriptionProgress(100)

      toast.success(`Transcribed ${file.name}`)
    } catch (error) {
      console.error('Transcription error:', error)
      toast.error('Failed to transcribe media file')
    } finally {
      setIsTranscribing(false)
      setTranscriptionProgress(0)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
    toast.success('File removed')
  }

  const processFiles = () => {
    // Separate files by type
    const sampleFiles = uploadedFiles.filter(f => f.type === 'sample')
    const transcriptFiles = uploadedFiles.filter(f => f.type === 'transcript' || f.type === 'audio' || f.type === 'video')
    
    // Combine transcript content
    const combinedTranscription = transcriptFiles
      .map(f => `--- ${f.name} ---\n${f.content || ''}`)
      .join('\n\n')

    onFilesUploaded(uploadedFiles, combinedTranscription)
    toast.success('Files processed successfully')
  }

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'audio': return <FileAudio className="h-5 w-5" />
      case 'video': return <Film className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
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
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload sample minutes, transcripts, or audio/video files for transcription
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Files</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: TXT, MD, PDF, DOCX, MP3, MP4, WAV, M4A
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.pdf,.docx,.doc,.mp3,.mp4,.wav,.m4a,.ogg,.mov,.avi,.mkv,.webm"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing || isTranscribing}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing || isTranscribing}
              className="bg-accent hover:bg-accent/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>

          {/* Transcription Progress */}
          {isTranscribing && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Transcribing media file...</span>
                  </div>
                  <Progress value={transcriptionProgress} className="h-2" />
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <div className="font-medium text-sm">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • 
                        <Badge variant="outline" className="ml-1 text-xs">
                          {file.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFile(file.id)}
                    variant="ghost"
                    size="sm"
                    disabled={isProcessing || isTranscribing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button 
                onClick={processFiles}
                disabled={uploadedFiles.length === 0 || isProcessing || isTranscribing}
                className="w-full"
              >
                Process Files
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}