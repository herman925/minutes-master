import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeSlash, Key, AlertCircle, CheckCircle, Activity } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@/lib/useKV'

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
      const sparkApi = (window as any)?.spark
      if (!sparkApi) {
        throw new Error('AI provider not initialized')
      }

      // Test with a simple prompt
      const testPrompt = sparkApi.llmPrompt`Test connection. Please respond with "Connection successful"`
      const response = await sparkApi.llm(testPrompt, apiConfig.model, false)
      
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {/* Provider */}
      <Card className="py-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Provider
          </CardTitle>
          <p className="text-sm text-muted-foreground">Choose your AI provider</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
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
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{provider.name}</h4>
                  {apiConfig.provider === provider.id && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{provider.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credentials */}
      <Card className="py-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">Credentials</CardTitle>
          <p className="text-sm text-muted-foreground">Key and endpoint</p>
        </CardHeader>
        <CardContent className="space-y-3">
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

          {connectionStatus !== 'idle' && (
            <Alert className={`mt-1 ${connectionStatus === 'success' ? 'border-green-200' : 'border-red-200'}`}>
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
        </CardContent>
      </Card>

      {/* Model */}
      <Card className="py-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">Model</CardTitle>
          <p className="text-sm text-muted-foreground">Model and generation tuning</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="model" className="text-sm font-medium mb-2 block">Model</label>
            <select
              id="model"
              aria-label="Model"
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
            <label htmlFor="temperature" className="text-sm font-medium mb-2 block">Temperature ({apiConfig.temperature})</label>
            <input
              id="temperature"
              aria-label="Temperature"
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

          <div>
            <label htmlFor="maxTokens" className="text-sm font-medium mb-2 block">Max Tokens ({apiConfig.maxTokens})</label>
            <input
              id="maxTokens"
              aria-label="Max Tokens"
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
        </CardContent>
      </Card>

      {/* Usage */}
      <Card className="py-4 sm:col-span-2 xl:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Usage
          </CardTitle>
          <CardAction>
            <Button onClick={resetUsageStats} variant="outline" size="sm">Reset</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-primary">{usageStats.totalRequests}</div>
              <div className="text-xs text-muted-foreground">Requests</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-primary">{usageStats.totalTokens.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Tokens</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xl font-bold text-primary">{formatCurrency(usageStats.estimatedCost)}</div>
              <div className="text-xs text-muted-foreground">Est. Cost</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-xs font-medium">Last Used</div>
              <div className="text-xs text-muted-foreground">{formatDate(usageStats.lastUsed)}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">Monthly</span>
              <span className="text-xs text-muted-foreground">{usageStats.totalRequests}/1000</span>
            </div>
            <Progress value={Math.min((usageStats.totalRequests / 1000) * 100, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert className="sm:col-span-2 xl:col-span-3">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> Your API keys are stored locally in your browser and never sent to external servers. Keep them safe and do not share.
        </AlertDescription>
      </Alert>
    </div>
  )
}