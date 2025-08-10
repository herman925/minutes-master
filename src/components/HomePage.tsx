import { Sparkles, FileText, Settings, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HomePageProps {
  onStartWizard: () => void
  onGoToWorkspace: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function HomePage({ 
  onStartWizard, 
  onGoToWorkspace, 
  darkMode, 
  onToggleDarkMode 
}: HomePageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with theme toggle */}
      <header className="flex justify-end p-6 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className="p-2 rounded-full cursor-pointer text-muted-foreground hover:text-primary bg-secondary/60 hover:bg-primary/20 dark:hover:bg-primary/30 ring-1 ring-border hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors transition-transform active:scale-95"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* AI Brain Icon */}
              <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                <Sparkles size={40} className="text-primary-foreground" />
              </div>
              {/* Floating accent */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <FileText size={16} className="text-accent-foreground" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold gradient-text mb-4">
            MinutesMaster AI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Transform meeting transcripts into professional minutes with AI-powered intelligence. 
            Customize terminology, follow your organization's style, and generate perfect documentation every time.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <Button
            onClick={onStartWizard}
            className="flex-1 h-16 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover-lift transition-smooth"
          >
            <div className="flex flex-col items-center gap-1">
              <Settings size={24} />
              <span>Setup Wizard</span>
            </div>
          </Button>

          <Button
            onClick={onGoToWorkspace}
            variant="outline"
            className="flex-1 h-16 text-lg font-semibold border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent shadow-lg hover-lift transition-smooth"
          >
            <div className="flex flex-col items-center gap-1">
              <Sparkles size={24} />
              <span>Quick Start</span>
            </div>
          </Button>
        </div>

        {/* Feature hints */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Smart Processing</h3>
            <p className="text-sm text-muted-foreground">
              Upload transcripts, audio files, or sample minutes for AI-powered analysis
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Settings size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Custom Dictionary</h3>
            <p className="text-sm text-muted-foreground">
              Define terminology and jargon specific to your organization
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles size={24} className="text-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Professional Output</h3>
            <p className="text-sm text-muted-foreground">
              Generate structured, formatted minutes matching your style preferences
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        <p>Powered by AI • Built for professionals • Privacy-focused</p>
      </footer>
    </div>
  )
}