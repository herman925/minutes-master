# MinutesMaster AI

MinutesMaster AI is a sophisticated web application for generating professional meeting minutes using AI technology. Transform meeting transcripts into structured, professional documentation with customizable terminology, organizational style preferences, and multi-provider AI support.

## 🚀 Key Features

### Core Functionality
- **AI Pipeline**: Complete implementation supporting OpenRouter, OpenAI, Anthropic, and custom endpoints
- **Smart Context Building**: Combines user dictionaries, instructions, and sample minutes for consistent output
- **Structured Minutes Generation**: Professional format with attendees, decisions, action items, and next steps
- **Real-time Progress**: Live status updates and progress tracking during generation

### User Experience
- **Setup Wizard**: Guided onboarding for transcript input, sample upload, and configuration
- **Three-Panel Workspace**: Professional layout with transcript, minutes, and customization tools
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Meeting History**: Track and access previous generated minutes

### AI Provider Support
- **OpenRouter**: Access to multiple AI models through unified API
- **OpenAI**: Direct integration with GPT models
- **Anthropic**: Claude model support via compatible endpoints
- **Custom Endpoints**: Support for any OpenAI-compatible API

## 📋 Requirements

- Node.js 16+ 
- Modern browser with ES2020+ support
- AI API key from supported provider (OpenRouter, OpenAI, etc.)

## 🛠️ Development

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Build application
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests (when test framework is configured)
npm test

# Run linting
npm run lint
```

## 🔧 Configuration

### API Setup

1. Click the settings gear icon in the workspace
2. Select your preferred AI provider:
   - **OpenRouter**: Recommended for access to multiple models
   - **OpenAI**: Direct OpenAI API access  
   - **Custom**: Any OpenAI-compatible endpoint
3. Enter your API key
4. Test the connection
5. Adjust model parameters as needed

### Recommended Settings

For professional meeting minutes:
- **Temperature**: 0.4 (focused, consistent output)
- **Top P**: 0.9 (balanced diversity)
- **Max Tokens**: 4000 (adequate for detailed minutes)

## 🏗️ Architecture

### AI Pipeline (`src/lib/aiService.ts`)

The core AI service handles:
- Multi-provider API management
- Context building from user data
- Structured prompt engineering  
- Response validation and parsing
- Error handling and recovery

### Data Flow

```
Transcript Input → Context Building → AI Processing → Response Parsing → Structured Minutes
     ↓                    ↓               ↓              ↓                    ↓
  [User Input]    [Dictionary, Instructions,  [API Call]     [JSON Parsing]    [UI Display]
                   Samples, Meeting Context]
```

### Key Components

- **AIService**: Main service class for AI interactions
- **ApiManager**: UI for provider and model configuration
- **WorkspaceLayout**: Three-panel editing interface
- **SetupWizard**: Guided onboarding flow

## 📚 Documentation

- [Product Requirements Document](ref/PRD.md) - Complete feature specifications
- [AI Pipeline Documentation](docs/AI_PIPELINE.md) - Technical implementation details
- [CSS Design Reference](src/css-reference.md) - Design system guidelines

## 🔒 Security & Privacy

- **Local Storage**: All data stored locally in browser
- **API Key Security**: Keys encrypted and never sent to third parties
- **Data Privacy**: No data sent to external servers except chosen AI provider
- **HTTPS Required**: Secure connections enforced

## 🎯 Usage Examples

### Basic Usage
1. Start the application
2. Click "Setup Wizard" 
3. Paste your meeting transcript
4. Configure AI settings if needed
5. Generate professional minutes

### Advanced Features
- Upload sample minutes to match your organization's style
- Create custom dictionaries for technical terms
- Set specific instructions for formatting preferences
- Export minutes in Markdown format

## 🐛 Troubleshooting

### Common Issues

**"AI service not configured"**
- Ensure API key is entered in Settings
- Test connection to verify key validity

**"CORS error"**
- Use HTTPS or development server
- Check provider's CORS policies

**"Rate limit exceeded"**
- Wait before retrying
- Check provider's rate limits

See [AI Pipeline Documentation](docs/AI_PIPELINE.md) for detailed troubleshooting.

## 🤝 Contributing

This project follows standard development practices:
- TypeScript for type safety
- React with modern hooks
- Tailwind CSS for styling
- Comprehensive error handling

## 📄 License

See LICENSE file for details.

---

**Built with modern web technologies for professional meeting documentation.**

