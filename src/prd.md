# Product Requirements Document (PRD): MinutesMaster AI

## Overview

### Product Name
**MinutesMaster AI**

### Product Description
**MinutesMaster AI** is an AI-powered web application designed to automate the creation of professional meeting minutes. Users upload sample minutes, transcripts, or audio/video files, and the app leverages AI APIs to generate structured, professional minutes in various formats.

The goal is to eliminate the tedium of manual minutes-writing by providing an intelligent, adaptable tool that produces accurate, polished outputs tailored to user preferences through customizations like terminology dictionaries and embedded instructions.

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

#### Upload and Processing
- **Multi-format file upload**: Support for TXT, MD, PDF, DOCX, MP3, MP4, WAV, M4A files
- **Sample minutes analysis**: Upload organizational templates for style guidance
- **Audio/video transcription**: Integrated AI transcription with speaker identification
- **Batch file processing**: Handle multiple files simultaneously

#### AI Generation Engine
- **Structured output**: Generate JSON-formatted minutes with consistent fields
- **Custom terminology integration**: Apply user-defined glossaries automatically
- **Style mimicking**: Follow uploaded sample formats and organizational standards
- **Context awareness**: Extract attendees, decisions, action items, and next steps

#### User Dictionary System
- **Editable glossary**: JSON-based storage for custom terms and acronyms
- **Contextual definitions**: Include usage context for accurate interpretation
- **Suggested terms**: Pre-populated business terms with auto-suggest functionality
- **Search and filtering**: Quick access to dictionary entries

#### User Instructions Framework
- **Persistent rules**: Save organizational preferences and style requirements
- **Categorized instructions**: Organize by tone, format, content, and business rules
- **Priority system**: High, medium, low priority for instruction application
- **Test mode**: Sandbox environment to validate instruction effectiveness

#### Export and Output
- **Multiple formats**: Export to Markdown, with future support for DOCX and PDF
- **Rich preview**: Editable preview with section-by-section breakdown
- **Professional formatting**: Clean, business-appropriate output styling

#### API Management
- **Multi-provider support**: OpenRouter, custom OpenAI endpoints
- **Usage tracking**: Monitor API costs and request counts
- **Security**: Encrypted local storage for API keys
- **Connection testing**: Validate API configuration before use

### UI and Usability Features
- **Tabbed workflow**: Organized interface with clear progression
- **Progress indicators**: Visual feedback during AI processing
- **Real-time statistics**: Dashboard showing uploaded files, terms, rules, and outputs
- **Responsive design**: Works across desktop and mobile devices
- **Error handling**: Graceful degradation with helpful error messages

---

## Design Direction

### Visual Tone & Identity
- **Professional sophistication**: Clean, modern interface appropriate for business environments
- **Trustworthy reliability**: Visual elements convey accuracy and dependability
- **Efficient productivity**: Interface design emphasizes workflow efficiency and clear information hierarchy

### Color Strategy
- **Primary**: Deep blue (`oklch(0.45 0.15 250)`) - conveys professionalism and trust
- **Accent**: Warm orange (`oklch(0.72 0.15 45)`) - highlights actions and important elements
- **Background**: Light neutral (`oklch(0.98 0.02 250)`) - provides clean, readable foundation
- **Muted tones**: Subtle blues and grays for supporting elements and secondary information

### Typography System
- **Primary Font**: Inter - Modern, readable sans-serif for UI elements and body text
- **Monospace Font**: JetBrains Mono - For code, transcripts, and technical content
- **Clear hierarchy**: Distinct sizing and weights for headers, body text, and captions
- **Optimal readability**: 1.5x line height for body text with generous spacing

### Component Strategy
- **shadcn/ui components**: Consistent, accessible component library
- **Phosphor Icons**: Clean, modern icon set for actions and navigation
- **Card-based layout**: Organized content sections with clear boundaries
- **Progressive disclosure**: Advanced features revealed as needed

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