import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeSlash, Key, AlertCircle, CheckCircle, DollarSign, Activity } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

interface ApiConfig {
  provider: 'openrouter' | 'poe' | 'custom'
  apiKey: string
  baseUrl?: string
  model: string
  temperature: number
  maxTokens: number
}

interface UsageStats {
  totalRequests: number
  totalTokens: number
  estimatedCost: number
  lastUsed: string
}

export default function ApiManager() {
  const [apiConfig, setApiConfig] = useKV<ApiConfig>('api-config', {
    provider: 'openrouter',
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4000
  })
  
  const [usageStats, setUsageStats] = useKV<UsageStats>('usage-stats', {
    totalRequests: 0,
    totalTokens: 0,
    estimatedCost: 0,
    lastUsed: ''
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const PROVIDERS = [
    {
      id: 'openrouter' as const,
      name: 'OpenRouter',
      description: 'Access to multiple AI models through one API',
      baseUrl: 'https://openrouter.ai/api/v1',
      models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-sonnet', 'claude-3-haiku']
    },
    {
      id: 'custom' as const,
      name: 'Custom OpenAI',
      description: 'Direct OpenAI API or compatible endpoint',
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']
    }
  ]

  const updateConfig = (updates: Partial<ApiConfig>) => {
    setApiConfig(current => ({ ...current, ...updates }))
  }

  const testConnection = async () => {
    if (!apiConfig.apiKey.trim()) {
      toast.error('Please enter an API key first')
      return
    }

    setIsTestingConnection(true)
    setConnectionStatus('idle')

    try {
      // Test with a simple prompt
      const testPrompt = spark.llmPrompt`Test connection. Please respond with "Connection successful"`
      
      const response = await spark.llm(testPrompt, apiConfig.model, false)
      
      if (response && response.toLowerCase().includes('connection successful')) {
        setConnectionStatus('success')
        toast.success('API connection successful!')
        
        // Update usage stats
        setUsageStats(current => ({
          ...current,
          totalRequests: current.totalRequests + 1,
          lastUsed: new Date().toISOString()
        }))
      } else {
        setConnectionStatus('error')
        toast.error('API connection test failed')
      }
    } catch (error) {
      console.error('Connection test error:', error)
      setConnectionStatus('error')
      toast.error('Failed to connect to API')
    } finally {
      setIsTestingConnection(false)
    }
  }

  const resetUsageStats = () => {
    setUsageStats({
      totalRequests: 0,
      totalTokens: 0,
      estimatedCost: 0,
      lastUsed: ''
    })
    toast.success('Usage statistics reset')
  }

  const clearApiKey = () => {
    updateConfig({ apiKey: '' })
    setConnectionStatus('idle')
    toast.success('API key cleared')
  }

  const getCurrentProvider = () => {
    return PROVIDERS.find(p => p.id === apiConfig.provider) || PROVIDERS[0]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure your AI API settings for meeting minutes generation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">AI Provider</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    apiConfig.provider === provider.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => updateConfig({ 
                    provider: provider.id,
                    baseUrl: provider.baseUrl,
                    model: provider.models[0]
                  })}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{provider.name}</h4>
                    {apiConfig.provider === provider.id && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* API Key */}
          <div>
            <label className="text-sm font-medium mb-2 block">API Key *</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Enter your API key..."
                  value={apiConfig.apiKey}
                  onChange={(e) => updateConfig({ apiKey: e.target.value })}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                onClick={testConnection}
                disabled={!apiConfig.apiKey.trim() || isTestingConnection}
                variant="outline"
              >
                {isTestingConnection ? 'Testing...' : 'Test'}
              </Button>
              {apiConfig.apiKey && (
                <Button onClick={clearApiKey} variant="outline">
                  Clear
                </Button>
              )}
            </div>
            
            {/* Connection Status */}
            {connectionStatus !== 'idle' && (
              <Alert className={`mt-2 ${connectionStatus === 'success' ? 'border-green-200' : 'border-red-200'}`}>
                {connectionStatus === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  {connectionStatus === 'success' 
                    ? 'API connection successful!' 
                    : 'Connection failed. Please check your API key and try again.'}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Model Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Model</label>
              <select
                value={apiConfig.model}
                onChange={(e) => updateConfig({ model: e.target.value })}
                className="w-full p-2 border rounded-md bg-background"
              >
                {getCurrentProvider().models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Temperature ({apiConfig.temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={apiConfig.temperature}
                onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Max Tokens ({apiConfig.maxTokens})
            </label>
            <input
              type="range"
              min="1000"
              max="8000"
              step="500"
              value={apiConfig.maxTokens}
              onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1K</span>
              <span>8K</span>
            </div>
          </div>

          {apiConfig.provider === 'custom' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Base URL</label>
              <Input
                placeholder="https://api.openai.com/v1"
                value={apiConfig.baseUrl || ''}
                onChange={(e) => updateConfig({ baseUrl: e.target.value })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track your API usage and estimated costs
              </p>
            </div>
            <Button onClick={resetUsageStats} variant="outline" size="sm">
              Reset Stats
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{usageStats.totalRequests}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {usageStats.totalTokens.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Tokens Used</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(usageStats.estimatedCost)}
              </div>
              <div className="text-sm text-muted-foreground">Est. Cost</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium">Last Used</div>
              <div className="text-xs text-muted-foreground">
                {formatDate(usageStats.lastUsed)}
              </div>
            </div>
          </div>

          {/* Usage Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Monthly Usage</span>
              <span className="text-sm text-muted-foreground">
                {usageStats.totalRequests}/1000 requests
              </span>
            </div>
            <Progress 
              value={Math.min((usageStats.totalRequests / 1000) * 100, 100)} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> Your API keys are stored locally in your browser and never sent to external servers. 
          Make sure to keep your API keys secure and never share them with others.
        </AlertDescription>
      </Alert>
    </div>
  )
}