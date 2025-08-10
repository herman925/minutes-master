# MinutesMaster AI - Web Edition

An intelligent web application that transforms meeting transcripts into professional meeting minutes using AI, with customizable terminology dictionaries and formatting preferences.

## Experience Qualities
1. **Efficient** - Streamlined workflow reduces meeting documentation time by 80%
2. **Intelligent** - AI adapts to organizational terminology and formatting styles
3. **Professional** - Outputs match corporate standards with consistent structure

## Complexity Level
Light Application (multiple features with basic state) - Handles file uploads, AI processing, customizable dictionaries, and document generation while maintaining simplicity for quick adoption.

## Essential Features

### AI Minutes Generation
- **Functionality**: Transform raw transcript text into structured meeting minutes
- **Purpose**: Eliminate manual documentation time and ensure consistent formatting
- **Trigger**: User pastes transcript and clicks "Generate Minutes"  
- **Progression**: Input transcript → AI processing → Generated minutes preview → Edit/export
- **Success criteria**: Generates coherent minutes in under 30 seconds with proper structure

### Custom Terminology Dictionary
- **Functionality**: Define organization-specific terms, acronyms, and their meanings
- **Purpose**: Ensure AI understands specialized jargon and produces accurate outputs
- **Trigger**: User adds terms via dictionary management interface
- **Progression**: Add term → Define meaning → Save → AI uses in future generations
- **Success criteria**: Terms are correctly interpreted and expanded in generated minutes

### Sample Minutes Upload
- **Functionality**: Upload example minutes to guide AI formatting and style
- **Purpose**: Match organizational standards and preferred structures
- **Trigger**: User uploads sample document during setup or settings
- **Progression**: Upload sample → AI analyzes structure → Applies format to new generations
- **Success criteria**: Generated minutes follow uploaded sample's format and tone

### Real-time Preview & Editing
- **Functionality**: Live preview of generated minutes with inline editing capabilities
- **Purpose**: Allow immediate refinement without regenerating entire document
- **Trigger**: After AI generation completes
- **Progression**: View preview → Make edits → See changes instantly → Export final version
- **Success criteria**: Edits save immediately and export reflects all changes

## Edge Case Handling
- **No transcript provided**: Show helpful placeholder text with example format
- **Empty dictionary**: Provide common business terms as starting suggestions  
- **AI service unavailable**: Display clear error with retry option and offline tips
- **Large transcript**: Process in chunks with progress indicator
- **Invalid file upload**: Show specific error message with supported formats

## Design Direction
The interface should feel professional and trustworthy like high-end business software, with clean lines and purposeful interactions that convey efficiency and intelligence without being sterile.

## Color Selection
Complementary (opposite colors) - Deep professional blue paired with warm accent orange to create trust and energy, conveying both reliability and innovation.

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.15 250)) - Communicates trust, competence, and corporate professionalism
- **Secondary Colors**: Light Blue Gray (oklch(0.85 0.05 250)) for backgrounds and Soft White (oklch(0.98 0.02 250)) for cards
- **Accent Color**: Warm Orange (oklch(0.72 0.15 45)) - Energetic highlight for CTAs and progress indicators
- **Foreground/Background Pairings**: 
  - Background (Soft White): Dark Blue text (oklch(0.25 0.1 250)) - Ratio 8.2:1 ✓
  - Card (Light Blue Gray): Dark Blue text (oklch(0.25 0.1 250)) - Ratio 6.8:1 ✓  
  - Primary (Deep Blue): White text (oklch(0.98 0.02 250)) - Ratio 9.1:1 ✓
  - Accent (Warm Orange): White text (oklch(0.98 0.02 250)) - Ratio 4.8:1 ✓

## Font Selection
Typography should be highly legible and professional, conveying clarity and expertise through clean sans-serif fonts that work well for both interface elements and document content.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing  
  - H3 (Subsections): Inter Medium/20px/normal spacing
  - Body (Interface): Inter Regular/16px/relaxed line height
  - Code (Transcripts): JetBrains Mono Regular/14px/monospace spacing

## Animations
Subtle and purposeful animations enhance workflow clarity without distraction, focusing on state transitions and progress feedback that guide users through the AI processing pipeline.

- **Purposeful Meaning**: Smooth transitions communicate AI thinking states and document processing progress
- **Hierarchy of Movement**: Primary focus on generation progress, secondary on form interactions, minimal on decorative elements

## Component Selection
- **Components**: Textarea for transcript input, Card for minutes preview, Button for actions, Tabs for dictionary/settings, Progress for AI processing, Alert for status messages
- **Customizations**: Custom upload zone with drag-drop styling, expandable dictionary table, split-pane layout for transcript/preview
- **States**: Loading states for AI calls, success/error feedback, disabled states during processing
- **Icon Selection**: Upload, Edit, Download, Settings, Plus/Minus for dictionary management
- **Spacing**: Generous 24px section spacing, 16px component padding, 8px tight spacing for related elements
- **Mobile**: Single column stack on mobile, collapsible sections, touch-friendly buttons with 44px minimum targets