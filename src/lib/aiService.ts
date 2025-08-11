/**
 * AI Service for MinutesMaster - Complete pipeline for transcript to minutes generation
 * Supports multiple AI providers: OpenRouter, OpenAI, Anthropic, and custom endpoints
 */

import type { 
  ApiConfig, 
  GeneratedMinutes, 
  DictionaryEntry, 
  UserInstruction, 
  SampleMinute, 
  TemplateStructure, 
  TemplateProfile,
  AIGenerationOptions
} from '../types'

export class AIService {
  private config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  /**
   * Updates the API configuration
   */
  updateConfig(config: ApiConfig) {
    this.config = config
  }

  /**
   * Main method to generate meeting minutes from transcript and context
   */
  async generateMinutes(options: AIGenerationOptions): Promise<GeneratedMinutes> {
    const { transcript, dictionary = [], instructions = [], samples = [], templateProfile, meetingTitle, onProgress } = options

    if (!transcript.trim()) {
      throw new Error('Transcript cannot be empty')
    }

    if (!this.config.apiKey.trim()) {
      throw new Error('API key is required')
    }

    onProgress?.(10, 'Preparing context...')

    // Build comprehensive context for the AI
    const context = this.buildContext(dictionary, instructions, samples, templateProfile)
    
    onProgress?.(30, 'Structuring prompt...')

    // Create the structured prompt
    const prompt = this.buildPrompt(transcript, context, meetingTitle, templateProfile)

    onProgress?.(50, 'Sending to AI...')

    try {
      // Make the API call
      const response = await this.makeAPICall(prompt)
      
      onProgress?.(80, 'Processing response...')

      // Parse and validate the response
      const minutes = this.parseResponse(response, templateProfile)
      
      onProgress?.(100, 'Complete!')

      return minutes
    } catch (error) {
      onProgress?.(0, 'Failed')
      throw error
    }
  }

  /**
   * Analyzes a sample to create a template profile
   */
  async profileTemplate(sample: SampleMinute, onProgress?: (progress: number, status: string) => void): Promise<TemplateProfile> {
    if (!this.config.apiKey.trim()) {
      throw new Error('API key is required for template profiling')
    }

    onProgress?.(20, 'Analyzing template structure...')

    const analysisPrompt = `Analyze the following meeting minutes sample to understand its structure and format. Provide a comprehensive template profile.

## Analysis Requirements
Return a valid JSON object with these exact fields:
- "sections": Array of main section headings found (string[])
- "fieldMappings": Object mapping standard fields to template fields (object)
- "format": Overall format type - "structured", "narrative", or "mixed" (string)
- "hasActionItems": Boolean indicating if action items are present
- "hasAttendees": Boolean indicating if attendee list is present  
- "hasAgenda": Boolean indicating if agenda items are present
- "customFields": Array of unique/custom fields specific to this template (string[])
- "analysis": Detailed text analysis of the template characteristics (string)

## Sample to Analyze:
${sample.content}

Return only the JSON analysis object:`;

    try {
      onProgress?.(50, 'Processing analysis...')
      
      const response = await this.makeAPICall(analysisPrompt)
      
      onProgress?.(80, 'Creating profile...')
      
      const analysisResult = this.parseTemplateAnalysis(response)
      
      const profile: TemplateProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: `Profile for ${sample.name}`,
        structure: analysisResult,
        confidence: this.calculateConfidence(analysisResult, sample.content),
        analysis: analysisResult.analysis,
        createdAt: new Date().toISOString()
      }

      onProgress?.(100, 'Profile complete!')
      
      return profile
    } catch (error) {
      onProgress?.(0, 'Failed to profile template')
      throw new Error(`Template profiling failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Builds context from user's dictionary, instructions, and samples
   */
  private buildContext(dictionary: DictionaryEntry[], instructions: UserInstruction[], samples: SampleMinute[], templateProfile?: TemplateProfile): string {
    let context = ''

    // Add template structure context if available
    if (templateProfile) {
      context += '\n\n## Template Structure Guidelines\n'
      context += `Follow this specific template structure (confidence: ${Math.round(templateProfile.confidence * 100)}%):\n`
      context += `- Format Type: ${templateProfile.structure.format}\n`
      context += `- Required Sections: ${templateProfile.structure.sections.join(', ')}\n`
      
      if (templateProfile.structure.fieldMappings && Object.keys(templateProfile.structure.fieldMappings).length > 0) {
        context += '- Field Mappings:\n'
        Object.entries(templateProfile.structure.fieldMappings).forEach(([standard, template]) => {
          context += `  • ${standard} → ${template}\n`
        })
      }

      if (templateProfile.structure.customFields.length > 0) {
        context += `- Custom Fields: ${templateProfile.structure.customFields.join(', ')}\n`
      }

      context += `\nTemplate Analysis: ${templateProfile.analysis}\n`
    }

    // Add dictionary context
    if (dictionary.length > 0) {
      context += '\n\n## Custom Terminology\n'
      context += 'Use these specific terms and definitions in the minutes:\n'
      context += dictionary
        .map(entry => `- **${entry.term}**: ${entry.definition}${entry.context ? ` (Context: ${entry.context})` : ''}`)
        .join('\n')
    }

    // Add user instructions (sorted by priority)
    if (instructions.length > 0) {
      const sortedInstructions = instructions.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })

      context += '\n\n## User Instructions\n'
      context += 'Follow these specific rules when generating minutes:\n'
      context += sortedInstructions
        .map(inst => `- **[${inst.category}] ${inst.title}**: ${inst.instruction}`)
        .join('\n')
    }

    // Add style samples (use top 3 most relevant)
    if (samples.length > 0) {
      context += '\n\n## Style Guidelines from Sample Library\n'
      context += 'Match the tone, structure, and formatting style of these examples:\n'
      context += samples
        .slice(0, 3) // Use top 3 samples
        .map((sample, index) => {
          const preview = sample.content.substring(0, 800) // Limit length
          return `\n### Sample ${index + 1}: ${sample.name}\n${preview}${sample.content.length > 800 ? '...' : ''}`
        })
        .join('\n')
    }

    return context
  }

  /**
   * Builds the structured prompt for AI generation
   */
  private buildPrompt(transcript: string, context: string, meetingTitle?: string, templateProfile?: TemplateProfile): string {
    let outputFormat = `Return a valid JSON object with these exact fields:
- "title": Meeting title/subject (string)
- "date": Meeting date in YYYY-MM-DD format (string)
- "attendees": Array of participant names extracted from transcript (string[])
- "agenda": Array of main topics discussed (string[])
- "keyDecisions": Array of important decisions made (string[])
- "actionItems": Array of objects with "task", "assignee", and "dueDate" fields
- "nextSteps": Array of follow-up items (string[])
- "summary": Brief 2-3 sentence summary of the meeting (string)
- "duration": Estimated meeting duration if determinable (string)`

    // Modify output format if template profile specifies custom structure
    if (templateProfile) {
      outputFormat += `\n\n## IMPORTANT: Template Structure Requirements
- Follow the template format: ${templateProfile.structure.format}
- Include these sections in order: ${templateProfile.structure.sections.join(', ')}`

      if (templateProfile.structure.customFields.length > 0) {
        outputFormat += `\n- Include custom fields: ${templateProfile.structure.customFields.join(', ')}`
      }

      if (Object.keys(templateProfile.structure.fieldMappings).length > 0) {
        outputFormat += '\n- Use these field names instead of defaults:'
        Object.entries(templateProfile.structure.fieldMappings).forEach(([standard, template]) => {
          outputFormat += `\n  • ${standard} should be named "${template}"`
        })
      }
    }

    return `You are an expert meeting minutes generator. Transform the following transcript into professional, well-structured meeting minutes.

## Output Requirements
${outputFormat}

## Generation Guidelines
1. **Accuracy**: Only include information explicitly mentioned in the transcript
2. **Professional Tone**: Use formal business language appropriate for documentation
3. **Clarity**: Make decisions and action items specific and actionable
4. **Organization**: Group related topics logically
5. **Completeness**: Capture all significant discussions and outcomes
${templateProfile ? `6. **Template Compliance**: Strictly follow the analyzed template structure and format` : ''}

## Meeting Context
${meetingTitle ? `Meeting Title: ${meetingTitle}\n` : ''}

${context}

## Transcript to Process
${transcript}

Generate professional meeting minutes following the above requirements and return only the JSON object:`
  }

  /**
   * Makes the API call to the configured AI provider
   */
  private async makeAPICall(prompt: string): Promise<string> {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}/chat/completions`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    }

    // Add provider-specific headers
    if (this.config.provider === 'openrouter') {
      headers['X-Title'] = 'MinutesMaster AI'
      headers['HTTP-Referer'] = 'https://minutesmaster.ai'
    }

    const requestBody = {
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional meeting minutes generator. Always return valid JSON in the specified format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: this.clampTokens(this.config.maxTokens),
      temperature: this.config.temperature,
      top_p: this.config.topP,
      response_format: { type: 'json_object' }, // Request JSON format when supported
      stream: false,
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      
      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid response format from AI provider')
      }

      return data.choices[0].message.content
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          throw new Error('CORS error - API might not be accessible from your domain')
        }
        if (error.message.includes('401') || error.message.includes('403')) {
          throw new Error('Authentication failed - please check your API key')
        }
        if (error.message.includes('429')) {
          throw new Error('Rate limit exceeded - please wait and try again')
        }
        if (error.message.includes('500')) {
          throw new Error('AI provider server error - please try again later')
        }
      }
      throw error
    }
  }

  /**
   * Parses and validates the AI response
   */
  private parseResponse(response: string, templateProfile?: TemplateProfile): GeneratedMinutes {
    try {
      // Clean response - sometimes AI adds markdown formatting
      let cleanResponse = response.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      const parsed = JSON.parse(cleanResponse)

      // Handle template-specific field mappings if available
      if (templateProfile?.structure.fieldMappings) {
        Object.entries(templateProfile.structure.fieldMappings).forEach(([standard, template]) => {
          if (parsed[template] && !parsed[standard]) {
            parsed[standard] = parsed[template]
            delete parsed[template]
          }
        })
      }

      // Add custom fields from template if present
      if (templateProfile?.structure.customFields) {
        templateProfile.structure.customFields.forEach(field => {
          if (parsed[field]) {
            // Keep custom fields in the result
            // They will be preserved in the GeneratedMinutes object
          }
        })
      }

      // Validate required fields
      const required = ['title', 'date', 'attendees', 'agenda', 'keyDecisions', 'actionItems', 'nextSteps']
      for (const field of required) {
        if (!(field in parsed)) {
          throw new Error(`Missing required field: ${field}`)
        }
      }

      // Ensure arrays are arrays
      const arrayFields = ['attendees', 'agenda', 'keyDecisions', 'nextSteps']
      for (const field of arrayFields) {
        if (!Array.isArray(parsed[field])) {
          parsed[field] = []
        }
      }

      // Validate action items structure
      if (!Array.isArray(parsed.actionItems)) {
        parsed.actionItems = []
      } else {
        parsed.actionItems = parsed.actionItems.map((item: any) => {
          if (typeof item === 'string') {
            return { task: item, assignee: 'Unassigned', dueDate: 'TBD' }
          }
          return {
            task: String(item.task || item.description || item.action || 'Undefined task'),
            assignee: String(item.assignee || item.owner || item.responsible || 'Unassigned'),
            dueDate: String(item.dueDate || item.deadline || item.due || 'TBD')
          }
        })
      }

      // Set default values for optional fields
      if (!parsed.summary) {
        parsed.summary = `Meeting covered ${parsed.agenda.length} topics with ${parsed.keyDecisions.length} key decisions and ${parsed.actionItems.length} action items.`
      }

      if (!parsed.duration && parsed.summary) {
        // Try to infer duration from context if possible
        parsed.duration = 'Not specified'
      }

      return parsed as GeneratedMinutes

    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('AI returned invalid JSON format. Please try again.')
      }
      throw new Error(`Failed to process AI response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Parses template analysis response
   */
  private parseTemplateAnalysis(response: string): TemplateStructure {
    try {
      let cleanResponse = response.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      const parsed = JSON.parse(cleanResponse)

      // Validate required fields for template analysis
      const required = ['sections', 'fieldMappings', 'format', 'hasActionItems', 'hasAttendees', 'hasAgenda', 'customFields', 'analysis']
      for (const field of required) {
        if (!(field in parsed)) {
          throw new Error(`Missing required template analysis field: ${field}`)
        }
      }

      // Ensure correct types
      return {
        sections: Array.isArray(parsed.sections) ? parsed.sections : [],
        fieldMappings: parsed.fieldMappings || {},
        format: ['structured', 'narrative', 'mixed'].includes(parsed.format) ? parsed.format : 'structured',
        hasActionItems: Boolean(parsed.hasActionItems),
        hasAttendees: Boolean(parsed.hasAttendees),
        hasAgenda: Boolean(parsed.hasAgenda),
        customFields: Array.isArray(parsed.customFields) ? parsed.customFields : [],
        analysis: String(parsed.analysis || 'Template analysis completed')
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Template analysis returned invalid JSON format')
      }
      throw new Error(`Failed to parse template analysis: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Calculates confidence score for template analysis
   */
  private calculateConfidence(structure: TemplateStructure, content: string): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence based on found structure elements
    if (structure.sections.length > 0) confidence += 0.2
    if (structure.hasActionItems) confidence += 0.1
    if (structure.hasAttendees) confidence += 0.1
    if (structure.hasAgenda) confidence += 0.1
    if (Object.keys(structure.fieldMappings).length > 0) confidence += 0.15
    if (structure.customFields.length > 0) confidence += 0.1

    // Adjust based on content length (more content = higher confidence)
    const contentLength = content.length
    if (contentLength > 2000) confidence += 0.1
    else if (contentLength < 500) confidence -= 0.2

    return Math.max(0, Math.min(1, confidence))
  }

  /**
   * Gets the appropriate base URL for the configured provider
   */
  private getBaseUrl(): string {
    if (this.config.baseUrl) {
      return this.config.baseUrl.replace(/\/+$/, '') // Remove trailing slashes
    }

    switch (this.config.provider) {
      case 'openrouter':
        return 'https://openrouter.ai/api/v1'
      case 'poe':
        return 'https://api.poe.com/v1'
      case 'custom':
        return 'https://api.openai.com/v1'
      default:
        return 'https://api.openai.com/v1'
    }
  }

  /**
   * Clamps token count to reasonable limits
   */
  private clampTokens(tokens: number): number {
    const minTokens = 256
    const maxTokens = 32000 // Conservative max

    if (!Number.isFinite(tokens)) {
      return 4000 // Default
    }

    return Math.max(minTokens, Math.min(tokens, maxTokens))
  }

  /**
   * Tests connection to the AI provider
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config.apiKey.trim()) {
      return { success: false, message: 'API key is required' }
    }

    try {
      const testPrompt = 'Test connection. Please respond with exactly: "Connection successful"'
      const response = await this.makeAPICall(`Test connection with these instructions: ${testPrompt}`)
      
      if (response.toLowerCase().includes('connection successful')) {
        return { success: true, message: 'API connection successful' }
      } else {
        return { success: false, message: 'Unexpected response from API' }
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection test failed' 
      }
    }
  }
}

// Export the AIService class as the main export