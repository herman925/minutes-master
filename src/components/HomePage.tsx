import { Sparkle, FileText, Gear } from '@phosphor-icons/react'
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
      <header className="flex justify-end p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className="text-muted-foreground hover:text-foreground"
        >
          {darkMode ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Light
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dark
            </span>
          )}
        </Button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* AI Brain Icon */}
              <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
                <Sparkle size={40} className="text-primary-foreground" weight="bold" />
              </div>
              {/* Floating accent */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <FileText size={16} className="text-accent-foreground" weight="bold" />
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
                <Gear size={24} weight="bold" />
              <span>Setup Wizard</span>
            </div>
          </Button>

          <Button
            onClick={onGoToWorkspace}
            variant="outline"
            className="flex-1 h-16 text-lg font-semibold border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent shadow-lg hover-lift transition-smooth"
          >
            <div className="flex flex-col items-center gap-1">
              <Sparkles size={24} weight="bold" />
              <span>Quick Start</span>
            </div>
          </Button>
        </div>

        {/* Feature hints */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-accent" weight="bold" />
            </div>
            <h3 className="font-semibold mb-2">Smart Processing</h3>
            <p className="text-sm text-muted-foreground">
              Upload transcripts, audio files, or sample minutes for AI-powered analysis
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Settings size={24} className="text-primary" weight="bold" />
            </div>
            <h3 className="font-semibold mb-2">Custom Dictionary</h3>
            <p className="text-sm text-muted-foreground">
              Define terminology and jargon specific to your organization
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles size={24} className="text-foreground" weight="bold" />
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