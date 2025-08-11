# AI Pipeline Documentation - MinutesMaster

## Overview

The MinutesMaster AI Pipeline is a comprehensive system for transforming meeting transcripts into professional, structured meeting minutes using multiple AI providers. The pipeline supports OpenRouter, OpenAI, Anthropic, and other OpenAI-compatible endpoints.

## Architecture

```
Transcript Input → Context Building → AI Processing → Response Parsing → Structured Minutes
     ↓                    ↓               ↓              ↓                    ↓
  [User Input]    [Dictionary, Instructions,  [API Call]     [JSON Parsing]    [UI Display]
                   Samples, Meeting Context]
```

## Core Components

### 1. AIService (`src/lib/aiService.ts`)

The main AI service class that handles:
- **Multi-provider support**: OpenRouter, OpenAI, Anthropic, custom endpoints
- **Context building**: Combines user dictionaries, instructions, and style samples
- **Prompt engineering**: Structured prompts for consistent output
- **Error handling**: Comprehensive error handling with user-friendly messages
- **Response validation**: Ensures generated minutes meet required structure

**Key Methods:**
```typescript
// Main generation method
generateMinutes(options: AIGenerationOptions): Promise<GeneratedMinutes>

// Connection testing
testConnection(): Promise<{ success: boolean; message: string }>

// Configuration updates
updateConfig(config: ApiConfig): void
```

### 2. API Configuration (`src/components/ApiManager.tsx`)

Manages AI provider configuration with features:
- **Provider selection**: OpenRouter, Poe API, Custom OpenAI
- **Model selection**: Dynamic model catalog from OpenRouter
- **Parameter tuning**: Temperature, Top-P, Max Tokens
- **Usage tracking**: Request counts, token usage, cost estimation
- **Security**: Local storage of API keys with encryption

### 3. Context Building System

The pipeline intelligently combines multiple sources of context:

#### Dictionary System
- **Custom terminology**: Organization-specific terms and definitions
- **Contextual application**: Terms applied based on meeting context
- **AI suggestions**: Smart recommendations for new terms

#### User Instructions
- **Priority-based**: High/medium/low priority instruction processing
- **Category organization**: Meeting-specific, organizational, formatting rules
- **Conditional logic**: Instructions applied based on context

#### Sample Library
- **Style extraction**: AI analyzes sample minutes for tone and structure
- **Relevance matching**: Selects most appropriate samples for each transcript
- **Hybrid templating**: Combines patterns from multiple samples

## Prompt Engineering

The system uses a structured prompt format:

```
System Role → Output Requirements → Generation Guidelines → Context → Transcript
```

### Output Requirements
```json
{
  "title": "Meeting title/subject",
  "date": "YYYY-MM-DD format",
  "attendees": ["participant names"],
  "agenda": ["main topics"],
  "keyDecisions": ["important decisions"],
  "actionItems": [{"task": "", "assignee": "", "dueDate": ""}],
  "nextSteps": ["follow-up items"],
  "summary": "2-3 sentence summary",
  "duration": "estimated duration"
}
```

### Generation Guidelines
1. **Accuracy**: Only include information from transcript
2. **Professional tone**: Formal business language
3. **Clarity**: Specific, actionable items
4. **Organization**: Logical grouping of topics
5. **Completeness**: Capture all significant discussions

## Error Handling

The pipeline includes comprehensive error handling:

### API Errors
- **Authentication failures**: Invalid API keys
- **Rate limiting**: Automatic retry with backoff
- **Network issues**: CORS and connectivity problems
- **Server errors**: Provider downtime handling

### Response Validation
- **JSON parsing**: Handles malformed responses
- **Field validation**: Ensures required fields exist
- **Type checking**: Validates data types and structures
- **Fallback values**: Provides defaults for missing data

### User Feedback
- **Progress tracking**: Real-time status updates
- **Error messages**: User-friendly error descriptions
- **Recovery suggestions**: Actionable next steps

## Usage Examples

### Basic Usage
```typescript
import { AIService } from '@/lib/aiService'

const service = new AIService({
  provider: 'openrouter',
  apiKey: 'your-api-key',
  model: 'openai/gpt-4o',
  temperature: 0.7,
  maxTokens: 4000,
  topP: 0.9
})

const minutes = await service.generateMinutes({
  transcript: 'Your meeting transcript...',
  onProgress: (progress, status) => {
    console.log(`${progress}%: ${status}`)
  }
})
```

### With Context
```typescript
const minutes = await service.generateMinutes({
  transcript: 'Meeting transcript...',
  dictionary: [
    { term: 'KPI', definition: 'Key Performance Indicator', context: 'Business metrics' }
  ],
  instructions: [
    {
      title: 'Formal tone',
      category: 'Style',
      instruction: 'Use formal business language throughout',
      priority: 'high'
    }
  ],
  samples: [sampleMinute1, sampleMinute2],
  meetingTitle: 'Q3 Planning Meeting'
})
```

## Configuration Options

### Provider Settings
```typescript
interface ApiConfig {
  provider: 'openrouter' | 'poe' | 'custom'
  apiKey: string
  baseUrl?: string
  model: string
  temperature: number    // 0.0-1.0, creativity level
  maxTokens: number     // Response length limit
  topP: number          // Nucleus sampling parameter
}
```

### Recommended Settings

#### For Professional Minutes
```typescript
{
  temperature: 0.4,     // Lower for consistency
  topP: 0.9,           // Standard diversity
  maxTokens: 4000      // Adequate for detailed minutes
}
```

#### For Creative Summaries
```typescript
{
  temperature: 0.7,     // Higher for creativity
  topP: 0.95,          // More diverse responses
  maxTokens: 2000      // Focused output
}
```

## Security Considerations

### Data Privacy
- **Local processing**: No data sent to third parties except chosen AI provider
- **API key storage**: Encrypted local storage only
- **Data retention**: Configurable automatic deletion
- **Audit logging**: Complete processing history

### API Security
- **Key validation**: Connection testing before use
- **Rate limiting**: Prevents quota exhaustion
- **Error isolation**: No sensitive data in error messages
- **HTTPS enforcement**: Secure communications only

## Performance Optimization

### Request Optimization
- **Token management**: Intelligent token allocation
- **Context prioritization**: Most relevant context first
- **Batch processing**: Efficient API usage
- **Caching**: Response caching for similar inputs

### Error Recovery
- **Automatic retry**: Exponential backoff for transient errors
- **Fallback providers**: Switch providers on failure
- **Graceful degradation**: Partial results when possible
- **User guidance**: Clear recovery instructions

## Monitoring and Analytics

### Usage Tracking
- **Request counts**: Total API calls made
- **Token usage**: Input and output token consumption
- **Cost estimation**: Approximate spending tracking
- **Performance metrics**: Response times and success rates

### Quality Metrics
- **Accuracy scoring**: User feedback integration
- **Content analysis**: Completeness checking
- **Style consistency**: Adherence to samples
- **User satisfaction**: Rating system integration

## Future Enhancements

### Planned Features
- **Multi-language support**: International transcript processing
- **Real-time processing**: Live meeting integration
- **Advanced analytics**: Meeting insight generation
- **Collaboration tools**: Shared dictionaries and templates

### Technical Improvements
- **Local AI models**: Offline processing capability
- **Advanced prompting**: Few-shot learning techniques
- **Custom fine-tuning**: Organization-specific model training
- **API optimization**: Advanced routing and load balancing

## Troubleshooting

### Common Issues

#### "API key is required"
- Ensure API key is properly configured in Settings
- Test connection to verify key validity

#### "CORS error"
- Use HTTPS or development server
- Check provider's CORS policies
- Consider using a proxy server

#### "Rate limit exceeded"
- Wait before retrying
- Check provider's rate limits
- Consider upgrading API plan

#### "Invalid response format"
- Check model compatibility
- Verify API endpoint configuration
- Try a different model or provider

### Debug Mode
Enable debug logging by setting `localStorage.debug = 'ai-service'` in browser console.

## Support

For technical support or feature requests:
- Check the API provider documentation
- Review error logs in browser console
- Test with different models or providers
- Contact support with specific error messages

## License

This AI pipeline is part of MinutesMaster and follows the same licensing terms as the main application.