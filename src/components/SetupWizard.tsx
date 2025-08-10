import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { 
  UploadCloud, 
  FileText, 
  Sparkle, 
  Sun,
  Moon,
  File,
  Volume2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Gear,
  House
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface FileWithPreview extends File {
  preview?: string
  id?: string
}

interface SetupWizardProps {
  onComplete: (data: {
    transcript: string
    samples: FileWithPreview[]
    meetingTitle: string
    instructions: string
  }) => void
  onCancel: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

const WIZARD_STEPS = [
  {
    id: 1,
    title: 'Upload Your Transcript',
    description: 'Start by providing the meeting transcript or audio file.',
    icon: FileText
  },
  {
    id: 2,
    title: 'Upload Sample Minutes',
    description: 'Provide examples of past minutes for the AI to learn the style.',
    icon: UploadCloud
  },
  {
    id: 3,
    title: 'Final Configuration',
    description: 'Give your meeting a title and add any special instructions.',
    icon: Settings
  }
]

export default function SetupWizard({ onComplete, onCancel, darkMode, onToggleDarkMode }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [transcript, setTranscript] = useState('')
  const [transcriptFile, setTranscriptFile] = useState<FileWithPreview | null>(null)
  const [sampleFiles, setSampleFiles] = useState<FileWithPreview[]>([])
  const [meetingTitle, setMeetingTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const transcriptInputRef = useRef<HTMLInputElement>(null)
  const samplesInputRef = useRef<HTMLInputElement>(null)

  // File handling utilities
  const handleFileUpload = async (files: FileList, type: 'transcript' | 'samples') => {
    setIsProcessing(true)
    setProgress(0)

    try {
      const file = files[0]
      
      if (type === 'transcript') {
        if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          // Text file - read content
          const text = await file.text()
          setTranscript(text)
          setTranscriptFile(Object.assign(file, { 
            preview: text.substring(0, 200) + '...',
            id: Math.random().toString()
          }))
          setProgress(100)
          toast.success('Transcript uploaded successfully')
        } else if (file.type.startsWith('audio/')) {
          // Audio file - simulate transcription
          setTranscriptFile(Object.assign(file, { 
            preview: 'Audio file ready for transcription',
            id: Math.random().toString()
          }))
          
          // Simulate transcription progress
          for (let i = 0; i <= 100; i += 10) {
            setProgress(i)
            await new Promise(resolve => setTimeout(resolve, 100))
          }
          
          // Simulate transcribed content
          setTranscript("Speaker 1 (00:00): Welcome everyone to today's meeting. Let's start with the quarterly review.\n\nSpeaker 2 (00:15): Thank you. I'd like to present our progress on the key initiatives...")
          toast.success('Audio transcribed successfully')
        }
      } else {
        // Sample files
        const processedFiles = Array.from(files).map(file => 
          Object.assign(file, { 
            preview: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
            id: Math.random().toString()
          })
        )
        setSampleFiles(prev => [...prev, ...processedFiles])
        setProgress(100)
        toast.success(`${files.length} sample file(s) uploaded`)
      }
    } catch (error) {
      toast.error('Failed to process file')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent, type: 'transcript' | 'samples') => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files, type)
  }

  // Navigation
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step)
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && !transcript && !transcriptFile) {
      toast.error('Please upload a transcript first')
      return
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (!meetingTitle.trim()) {
      toast.error('Please enter a meeting title')
      return
    }

    onComplete({
      transcript,
      samples: sampleFiles,
      meetingTitle,
      instructions
    })
  }

  const removeSampleFile = (id: string) => {
    setSampleFiles(prev => prev.filter(file => file.id !== id))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-card rounded-lg border border-border shadow-lg"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-sm">
              <Sparkle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MinutesMaster AI</h1>
              <p className="text-sm text-muted-foreground">Setup Wizard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onCancel} variant="ghost" size="sm" aria-label="Go home">
              <House className="h-4 w-4" />
            </Button>
            <Button onClick={onToggleDarkMode} variant="ghost" size="sm">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Progress and Step Indicator */}
        <div className="px-6 py-4 bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Step {currentStep} of {WIZARD_STEPS.length}</span>
            <span>{Math.round((currentStep / WIZARD_STEPS.length) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / WIZARD_STEPS.length) * 100} className="h-1" />
          
          {/* Step Navigation */}
          <div className="flex items-center gap-4 mt-4">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-smooth ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > step.id
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </motion.div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">
                    {step.title}
                  </div>
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className="w-12 h-px bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Upload Transcript */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
                      Step 1 of 3
                    </p>
                    <h2 className="text-2xl font-semibold mt-2">Upload Your Transcript</h2>
                    <p className="text-muted-foreground mt-1">
                      Start by providing the meeting transcript or audio file.
                    </p>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-smooth ${
                      isDragging
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary/50 hover:bg-secondary/70'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'transcript')}
                  >
                    <UploadCloud className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Drag & drop your transcript or audio file
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Supports TXT, MD, DOCX, MP3, MP4, WAV files
                    </p>
                    <Button
                      onClick={() => transcriptInputRef.current?.click()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Browse Files
                    </Button>
                    <input
                      ref={transcriptInputRef}
                      type="file"
                      accept=".txt,.md,.docx,.mp3,.mp4,.wav"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'transcript')}
                      className="hidden"
                      aria-label="Upload transcript file"
                      title="Upload transcript file"
                    />
                  </div>

                  {/* Processing Progress */}
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                          <Sparkles className="h-4 w-4 text-primary" />
                        </motion.div>
                        <span>Processing file...</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </motion.div>
                  )}

                  {/* File Preview */}
                  {transcriptFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-3">
                        {transcriptFile.type.startsWith('audio/') ? (
                          <Volume2 className="h-5 w-5 text-accent" />
                        ) : (
                          <FileText className="h-5 w-5 text-primary" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{transcriptFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(transcriptFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    </motion.div>
                  )}

                  {/* Direct text input alternative */}
                  <div className="space-y-2">
                    <Label htmlFor="transcript-text">Or paste transcript directly:</Label>
                    <Textarea
                      id="transcript-text"
                      placeholder="Paste your meeting transcript here..."
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      rows={4}
                      className="min-h-[100px]"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Upload Samples */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
                      Step 2 of 3
                    </p>
                    <h2 className="text-2xl font-semibold mt-2">Upload Sample Minutes</h2>
                    <p className="text-muted-foreground mt-1">
                      Provide examples of past minutes for the AI to learn your style.
                    </p>
                    <Badge variant="secondary" className="mt-2">Optional</Badge>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-smooth ${
                      isDragging
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-secondary/50 hover:bg-secondary/70'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'samples')}
                  >
                    <File className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Drag & drop sample minutes
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Supports DOCX, PDF, TXT, MD files
                    </p>
                    <Button
                      onClick={() => samplesInputRef.current?.click()}
                      variant="outline"
                    >
                      Browse Files
                    </Button>
                    <input
                      ref={samplesInputRef}
                      type="file"
                      accept=".txt,.md,.docx,.pdf"
                      multiple
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'samples')}
                      className="hidden"
                      aria-label="Upload sample minutes files"
                      title="Upload sample minutes files"
                    />
                  </div>

                  {/* Sample Files List */}
                  {sampleFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <h4 className="font-medium">Uploaded Samples ({sampleFiles.length})</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {sampleFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card"
                          >
                            <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSampleFile(file.id!)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Final Configuration */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
                      Step 3 of 3
                    </p>
                    <h2 className="text-2xl font-semibold mt-2">Final Configuration</h2>
                    <p className="text-muted-foreground mt-1">
                      Give your meeting a title and add any special instructions.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="meeting-title">Meeting Title *</Label>
                      <Input
                        id="meeting-title"
                        placeholder="e.g., Q3 Product Strategy Meeting"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Special Instructions</Label>
                      <Textarea
                        id="instructions"
                        placeholder="e.g., Focus on action items and deadlines. Use a formal tone. Include specific deadlines in YYYY-MM-DD format."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows={4}
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        These instructions will guide the AI in generating your minutes.
                      </p>
                    </div>

                    {/* Summary */}
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Setup Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Transcript:</span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {transcriptFile ? transcriptFile.name : 'Pasted text'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sample Files:</span>
                            <span>{sampleFiles.length} files</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Instructions:</span>
                            <span>{instructions ? 'Provided' : 'None'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="bg-accent hover:bg-accent/90 flex items-center gap-2 px-8"
                >
                  <Sparkles className="h-5 w-5" />
                  Generate Minutes
                </Button>
              )}
            </div>
          </div>
        </motion.div>
    </div>
  )
}