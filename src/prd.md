# Product Requirements Document (PRD): MinutesMaster AI

## Overview

### Product Name
**MinutesMaster AI**

### Product Description
**MinutesMaster AI** is a sophisticated web application designed to automate the creation of professional meeting minutes with advanced customization capabilities. Users build a curated sample pool from their organization's meeting minutes, upload or paste transcripts in multiple formats (TXT, MD, DOCX, PDF), define custom dictionaries, and set personalized instructions. The AI then generates structured, professional minutes that authentically match their organization's style and terminology.

The application emphasizes visual sophistication, intuitive workflows, and powerful customization to deliver minutes that feel authentically human-written while maintaining consistency and professionalism across all organizational documentation.

### Version
**1.0 (MVP)** – Initial release focusing on the core generation workflow.

---

## Core Purpose & Success

### Mission Statement
Transform meeting transcripts into professional, customized meeting minutes using AI technology that adapts to organizational styles and terminology.

### Success Indicators
- User satisfaction rating of 4+ stars
- 80% reduction in time spent on meeting documentation
- 90%+ accuracy in matching organizational styles and terminology
- 100+ active users in first 6 months

### Experience Qualities
- **Intelligent**: AI understands context, terminology, and organizational preferences
- **Professional**: Outputs match business standards and formatting requirements
- **Efficient**: Streamlined workflow from transcript to polished minutes

---

## Project Classification & Approach

### Complexity Level
**Complex Application** - Advanced functionality with AI integration, customizations, file processing, and multi-format outputs

### Primary User Activity
**Creating** - Users actively generate professional documents from raw transcripts

---

## Target Audience

- **Primary**: Business professionals (admins, managers, executives) who regularly document meetings
- **Secondary**: Legal professionals, consultants, and team leads requiring accurate meeting records
- **Pain Points Addressed**: Time-consuming manual transcription, inconsistent formatting, missed details, organizational style compliance

---

## Essential Features

### Core Workflow Features

#### Sample Pool Management
- **Curated sample library**: Build and manage a collection of organizational meeting minutes templates
- **Multi-format sample upload**: Support for TXT, MD, PDF, DOCX sample minutes
- **Sample categorization**: Tag samples by meeting type (board meetings, project reviews, team standups)
- **Style analysis**: AI analyzes sample pool to understand organizational tone, structure, and formatting preferences
- **Sample preview**: Visual preview of uploaded samples with metadata display
- **Template suggestions**: AI-generated recommendations based on sample pool analysis

#### Transcript Input and Processing
- **Multi-input support**: 
  - Direct text paste with rich text formatting
  - File upload for TXT, MD, DOCX, PDF transcript files
  - Audio/video upload (MP3, MP4, WAV, M4A) with AI transcription
- **Speaker diarization**: Automatic identification and labeling of meeting participants
- **Transcript enhancement**: AI cleanup of transcription errors and formatting inconsistencies
- **Batch processing**: Handle multiple transcript files simultaneously
- **Smart segmentation**: Automatic detection of agenda items, discussions, and decision points

#### AI Generation Engine
- **Contextual intelligence**: Deep understanding of meeting dynamics, roles, and organizational context
- **Multi-source synthesis**: Combines transcript content with sample pool patterns, dictionary terms, and user instructions
- **Structured extraction**: Automatically identifies and categorizes:
  - Meeting metadata (title, date, attendees, duration)
  - Agenda items and discussion topics
  - Key decisions and resolutions
  - Action items with assignees and deadlines
  - Follow-up items and next steps
  - Important quotes and highlights
- **Style consistency**: Maintains organizational voice, tone, and formatting standards
- **Content validation**: Cross-references extracted information for accuracy and completeness

#### Enhanced Dictionary System
- **Smart terminology management**: AI-powered suggestions for organization-specific terms
- **Contextual awareness**: Terms applied based on meeting context and participant roles
- **Acronym expansion**: Automatic detection and expansion of common business acronyms
- **Industry templates**: Pre-loaded dictionaries for specific sectors (legal, tech, healthcare, finance)
- **Collaborative building**: Learn from user corrections and feedback to improve term suggestions
- **Version control**: Track dictionary changes and maintain historical versions

#### Advanced User Instructions
- **Multi-layered customization**:
  - Organizational standards (formal vs casual tone, specific formatting requirements)
  - Content preferences (level of detail, summary style, inclusion criteria)
  - Business rules (confidentiality handling, approval workflows, distribution lists)
  - Cultural considerations (regional business norms, company-specific practices)
- **Conditional logic**: Instructions that apply based on meeting type, participants, or content
- **Template inheritance**: Instructions that cascade from organizational to team to individual levels
- **Effectiveness tracking**: Monitor which instructions improve output quality
- **Smart suggestions**: AI recommendations for instruction optimization

#### Professional Export and Distribution
- **Rich format support**: 
  - Markdown (immediate)
  - DOCX with proper formatting (planned)
  - PDF with professional styling (planned)
  - HTML with embedded styles (planned)
- **Customizable templates**: Apply organizational branding and formatting standards
- **Distribution workflows**: Direct integration with email, document management systems
- **Version management**: Track revisions and maintain approval workflows
- **Accessibility compliance**: WCAG-compliant outputs for inclusive documentation

#### Setup Wizard and User Experience
- **Guided Setup Wizard**: Step-by-step onboarding for new users and projects
  - Step 1: Transcript upload with drag-and-drop interface and format validation
  - Step 2: Sample pool creation with batch upload and automatic tagging
  - Step 3: Configuration with meeting title and custom instructions
- **Dual Interface Modes**:
  - **Dashboard View**: Tabbed interface for comprehensive feature access
  - **Workspace View**: Professional three-panel layout for advanced editing
- **Progressive Enhancement**: Interface adapts based on user expertise and needs
- **Theme System**: Light and dark modes with professional color palettes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

#### Enhanced UI Components
- **File Upload Zones**: Sophisticated drag-and-drop with progress indicators
- **Rich Text Editing**: In-place editing of generated minutes with real-time preview
- **Smart Tabs**: Dynamic tab system with badges and state indicators
- **Progress Tracking**: Visual feedback during AI processing and file operations
- **Status Dashboard**: Real-time overview of setup completion and system status
- **Interactive Previews**: Side-by-side comparison of transcript and generated minutes

#### API Management and Security
- **Multi-provider architecture**: Support for OpenRouter, OpenAI, Anthropic, and local models
- **Intelligent routing**: Automatic selection of optimal model based on task complexity
- **Cost optimization**: Smart batching and caching to minimize API usage
- **Fallback systems**: Graceful degradation when primary AI services are unavailable
- **Rate limiting**: Intelligent request management to prevent API quota exhaustion
- **Usage analytics**: Detailed tracking of costs, performance, and accuracy metrics

#### Data Privacy and Security
- **Local-first architecture**: All processing happens on user's device when possible
- **Encrypted storage**: Secure storage of API keys, sensitive documents, and user data
- **Data retention policies**: Configurable automatic deletion of processed content
- **Audit trails**: Complete logging of document processing and AI interactions
- **Compliance support**: Features to support GDPR, HIPAA, and other regulatory requirements

### User Experience Features

#### Visual Design and Interface
- **Modern, sophisticated design**: Professional aesthetic with carefully crafted visual hierarchy
- **Contextual animations**: Subtle motion design that enhances usability without distraction
- **Adaptive layouts**: Responsive design that works seamlessly across all device sizes
- **Accessibility focus**: High contrast options, screen reader support, keyboard navigation
- **Dark/light themes**: User preference-based theming with automatic system detection
- **Customizable workspace**: Rearrangeable panels and personalized dashboard views

#### Workflow Intelligence
- **Smart guidance**: Contextual tips and suggestions based on user behavior and best practices
- **Progress tracking**: Visual indicators showing completion status across all workflow steps
- **Error prevention**: Proactive validation and helpful warnings before processing
- **Undo/redo capabilities**: Full history tracking with granular rollback options
- **Auto-save**: Continuous preservation of work with crash recovery
- **Collaboration features**: Share samples, dictionaries, and instructions across team members

---

## Design Direction

### Visual Tone & Identity
- **Professional sophistication**: Clean, modern interface appropriate for business environments
- **Trustworthy reliability**: Visual elements convey accuracy and dependability
- **Efficient productivity**: Interface design emphasizes workflow efficiency and clear information hierarchy

### Color Strategy
- **OKLCH Color System**: Modern color space for consistent, perceptual color relationships
- **Light Mode Palette**:
  - Primary: `oklch(0.65 0.2 150)` - Professional green for primary actions
  - Accent: `oklch(0.7 0.22 155)` - Vibrant green for highlights and attention
  - Background: `oklch(0.98 0.01 110)` - Warm white for comfortable reading
  - Foreground: `oklch(0.15 0.02 110)` - Deep charcoal for optimal contrast
- **Dark Mode Palette**:
  - Primary: `oklch(0.85 0 0)` - High contrast neutral for accessibility
  - Accent: `oklch(0.3 0 0)` - Subdued accent for reduced eye strain
  - Background: `oklch(0.10 0 0)` - Deep black for professional appearance
  - Foreground: `oklch(0.95 0 0)` - Near white for excellent readability
- **Color Psychology**: Green primary conveys growth, success, and reliability
- **Accessibility**: All color combinations meet WCAG AA contrast requirements (4.5:1)

### Typography System
- **Primary Font**: Inter - Modern, readable sans-serif optimized for digital screens
- **Monospace Font**: JetBrains Mono - Technical content, code blocks, and data display
- **Font Loading**: Google Fonts with font-display: swap for optimal performance
- **Typographic Scale**: Mathematical progression for consistent visual rhythm
- **Line Height**: 1.5x for body text, tighter for headings, optimized for readability

### Visual Hierarchy & Layout
- **Grid System**: CSS Grid for complex layouts, Flexbox for component alignment
- **Spacing System**: Consistent 0.25rem base unit with mathematical progression
- **Border Radius**: 0.5rem base with calculated variants for different element sizes
- **Shadow System**: Layered shadows with different opacity levels for depth perception
- **Motion Design**: Subtle animations (200-400ms) that enhance usability without distraction

---

## User Workflow & Interface Design

### Two-Stage Application Flow

#### Stage 1: Setup Wizard (New Projects)
**Purpose**: Guide users through initial setup with progressive disclosure
**Layout**: Centered modal-style interface with step navigation

1. **Step 1: Transcript Upload**
   - Large drag-and-drop zone with visual feedback
   - Support for TXT, MD, DOCX files and audio formats (MP3, MP4, WAV)
   - Real-time file validation and processing indicators
   - Alternative text input area for direct paste

2. **Step 2: Sample Pool Creation**
   - Batch file upload with preview thumbnails
   - Automatic file categorization and tagging
   - Optional step with clear skip functionality
   - Progress tracking for file processing

3. **Step 3: Final Configuration**
   - Meeting title input with smart suggestions
   - Custom instructions text area with templates
   - Setup summary with completion indicators
   - One-click generation to workspace view

#### Stage 2: Main Application Interface

##### Dashboard View (Default)
**Purpose**: Comprehensive feature access with organized workflow
**Layout**: Tabbed interface with full-width content areas

- **Sample Pool Tab**: Manage and organize sample minutes library
- **Transcript Tab**: Input and edit transcript content with generation controls
- **Dictionary Tab**: Define and manage custom terminology
- **Instructions Tab**: Set personalized AI generation rules
- **Settings Tab**: Theme, API management, and data controls
- **Preview Tab**: View and export generated minutes

##### Workspace View (Advanced)
**Purpose**: Professional editing environment for power users
**Layout**: Three-panel grid layout inspired by IDE interfaces

- **Left Panel**: Live transcript view with speaker identification
- **Center Panel**: Generated minutes with rich text editing
- **Right Panel**: Tabbed customization tools (Dictionary/Instructions)
- **Header/Footer**: Project context and generation controls

### Interface Transitions
- **Smooth animations**: 300ms duration with easing for professional feel
- **State preservation**: Maintain user data across interface switches
- **Context awareness**: Interface adapts based on available content and user progress

---

## Technical Implementation

### Architecture
- **Frontend**: React with TypeScript for type safety and maintainability
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: React hooks with persistent storage via useKV
- **AI Integration**: Spark LLM API with OpenRouter/OpenAI compatibility
- **File Processing**: Browser-based file reading and content extraction

### Data Persistence
- **User Dictionary**: Persistent storage of custom terminology and definitions
- **User Instructions**: Saved organizational rules and formatting preferences
- **Sample Minutes**: Template storage for style consistency
- **API Configuration**: Encrypted storage of API keys and settings
- **Usage Statistics**: Tracking for API usage and cost monitoring

### Performance Considerations
- **Async Processing**: Non-blocking AI generation with progress indicators
- **Chunked Processing**: Handle large transcripts efficiently
- **Error Recovery**: Graceful handling of API failures and network issues
- **Local Processing**: Minimize external dependencies where possible

---

## User Experience Flow

1. **Upload**: Users upload sample minutes, transcripts, or audio/video files
2. **Configure**: Set up custom terminology and organizational rules
3. **Process**: AI analyzes content and applies customizations
4. **Generate**: Create structured meeting minutes following organizational standards
5. **Review**: Preview and edit generated content as needed
6. **Export**: Download professional minutes in preferred format

---

## Success Metrics

- **Adoption**: 100+ active users within 6 months
- **Efficiency**: Average generation time under 2 minutes per transcript
- **Accuracy**: 90%+ user satisfaction with generated content quality
- **Engagement**: 60%+ of users actively use customization features
- **Retention**: 70%+ of users return within 30 days of first use

---

## Future Enhancements (v2.0+)

- **Advanced Export Formats**: Native DOCX and PDF generation
- **Team Collaboration**: Shared dictionaries and templates
- **Integration APIs**: Connect with calendar applications and project management tools
- **Offline Mode**: Local AI models for enhanced privacy
- **Advanced Analytics**: Meeting insights and trend analysis
- **Multi-language Support**: International organization support

This PRD serves as the foundation for MinutesMaster AI, ensuring all development aligns with user needs and business objectives while maintaining focus on professional quality and organizational customization.