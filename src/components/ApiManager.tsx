import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff as EyeSlash, KeyRound as Key, AlertTriangle as WarningCircle, CheckCircle, Activity as Pulse, Search } from 'lucide-react'
import { toast } from 'sonner'
import { useKV } from '@/lib/useKV'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'

interface ApiConfig {
  provider: 'openrouter' | 'poe' | 'custom'
  apiKey: string
  baseUrl?: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
}

interface UsageStats {
  totalRequests: number
  totalTokens: number
  estimatedCost: number
  lastUsed: string
}

type ProviderId = 'openrouter' | 'poe' | 'custom'

type ProviderMeta = {
  id: ProviderId
  name: string
  description: string
  baseUrl: string
  models: string[]
}

type OpenRouterModel = {
  id: string
  name?: string
  context_length?: number
  context_length_max?: number
  max_input_tokens?: number
  tokens?: number
  max_context?: number
}

export default function ApiManager() {
  const [apiConfig, setApiConfig] = useKV<ApiConfig>('api-config', {
    provider: 'openrouter',
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 4000,
    topP: 0.9,
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

  const PROVIDERS: ProviderMeta[] = [
    {
      id: 'openrouter',
      name: 'OpenRouter',
      description: 'Access to multiple AI models through one API',
      baseUrl: 'https://openrouter.ai/api/v1',
      models: ['openai/gpt-4o', 'openai/gpt-4o-mini', 'anthropic/claude-3-sonnet', 'anthropic/claude-3-haiku']
    },
    {
      id: 'poe',
      name: 'Poe API',
      description: 'OpenAI-compatible endpoint for hundreds of Poe bots/models',
      baseUrl: 'https://api.poe.com/v1',
      models: [
        'Claude-Opus-4.1',
        'Claude-Sonnet-4',
        'Gemini-2.5-Pro',
        'GPT-5',
        'Grok-4',
        'gpt-4.1'
      ]
    },
    {
      id: 'custom',
      name: 'Custom OpenAI',
      description: 'Direct OpenAI API or compatible endpoint',
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']
    }
  ]

  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [openRouterModels, setOpenRouterModels] = useState<Array<{ id: string; label: string; contextWindow?: number }>>([])

  const updateConfig = (updates: Partial<ApiConfig>) => {
    setApiConfig(current => ({ ...current, ...updates }))
  }

  const currentProvider = useMemo(() => PROVIDERS.find(p => p.id === apiConfig.provider) || PROVIDERS[0], [apiConfig.provider])

  const recommendedModelIds = useMemo(() => [
    'openai/gpt-4o',
    'openai/gpt-4o-mini',
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3-sonnet',
    'google/gemini-2.0-pro-exp',
  ], [])

  const findSelectedOpenRouterModel = useMemo(() => {
    if (apiConfig.provider !== 'openrouter') return undefined
    return openRouterModels.find(m => m.id === apiConfig.model)
  }, [apiConfig.provider, apiConfig.model, openRouterModels])

  // Compute a dynamic max token cap based on model/provider metadata
  const maxTokenCap = useMemo(() => {
    if (apiConfig.provider === 'openrouter') {
      const ctx = findSelectedOpenRouterModel?.contextWindow
      if (typeof ctx === 'number' && ctx > 0) return ctx
      return 32000
    }
    if (apiConfig.provider === 'poe') {
      return 128000
    }
    return 8192
  }, [apiConfig.provider, findSelectedOpenRouterModel])

  // Clamp maxTokens if needed when cap changes
  useEffect(() => {
    if (apiConfig.maxTokens > maxTokenCap) {
      updateConfig({ maxTokens: maxTokenCap })
    }
  }, [maxTokenCap])

  // Fetch OpenRouter model catalog
  useEffect(() => {
    const shouldFetch = apiConfig.provider === 'openrouter'
    if (!shouldFetch) return

    let isCancelled = false
    async function fetchModels() {
      try {
        setIsLoadingModels(true)
        const base = (apiConfig.baseUrl || 'https://openrouter.ai/api/v1').replace(/\/+$/, '')
        const url = `${base}/models`
        const headers: Record<string, string> = {}
        if (apiConfig.apiKey) headers['Authorization'] = `Bearer ${apiConfig.apiKey}`
        const res = await fetch(url, { headers })
        if (!res.ok) throw new Error(`Failed to load models (${res.status})`)
        const json = await res.json()
        const list: OpenRouterModel[] = Array.isArray(json?.data) ? json.data : Array.isArray(json?.models) ? json.models : []
        const mapped = list
          .map((m) => {
            const label = m.name || m.id || ''
            const contextWindow = m.context_length || m.context_length_max || m.max_input_tokens || m.tokens || m.max_context
            return m.id ? { id: m.id, label, contextWindow: typeof contextWindow === 'number' ? contextWindow : undefined } : null
          })
          .filter(Boolean) as Array<{ id: string; label: string; contextWindow?: number }>
        // Deduplicate and sort: recommended first, then alphabetical
        const unique = Array.from(new Map(mapped.map(m => [m.id, m])).values())
        unique.sort((a, b) => a.label.localeCompare(b.label))
        if (!isCancelled) setOpenRouterModels(unique)
      } catch (err) {
        console.error('OpenRouter models load failed:', err)
        toast.error('Failed to load models from OpenRouter')
      } finally {
        if (!isCancelled) setIsLoadingModels(false)
      }
    }

    fetchModels()
    return () => { isCancelled = true }
  }, [apiConfig.provider, apiConfig.baseUrl, apiConfig.apiKey])

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
    return currentProvider
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

  const formatTokens = (n: number) => {
    if (n >= 1_000_000) return `${Math.round(n / 1000) / 1000}M`
    if (n >= 1000) return `${Math.round(n / 100) / 10}K`
    return String(n)
  }

  const applyRecommended = () => {
    const cap = maxTokenCap
    const recommendedTokens = Math.min(8192, cap)
    updateConfig({ temperature: 0.4, topP: 0.9, maxTokens: recommendedTokens })
    toast.success('Applied recommended settings')
  }

  const openModelPicker = () => {
    if (apiConfig.provider === 'openrouter' && openRouterModels.length === 0 && !isLoadingModels) {
      // trigger fetch via changing dependency if needed; effect handles auto
    }
    setIsModelPickerOpen(true)
  }

  const onSelectModel = (modelId: string) => {
    updateConfig({ model: modelId })
    setIsModelPickerOpen(false)
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
                <WarningCircle className="h-4 w-4 text-red-600" />
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
          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium mb-1 block">Model</label>
            {apiConfig.provider === 'openrouter' ? (
              <div className="flex gap-2">
                <Input
                  id="model"
                  aria-label="Model"
                  value={apiConfig.model}
                  onChange={(e) => updateConfig({ model: e.target.value })}
                  placeholder="Search or pick a model"
                />
                <Button onClick={openModelPicker} variant="outline">
                  <Search className="h-4 w-4 mr-2" /> Browse
                </Button>
              </div>
            ) : (
              <Input
                id="model"
                aria-label="Model"
                value={apiConfig.model}
                onChange={(e) => updateConfig({ model: e.target.value })}
                placeholder="Enter model/bot name"
              />
            )}
            {apiConfig.provider === 'openrouter' && (
              <p className="text-xs text-muted-foreground">
                {isLoadingModels ? 'Loading models…' : openRouterModels.length > 0 ? `${openRouterModels.length} models loaded` : 'Click Browse to load model catalog'}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="temperature" className="text-sm font-medium mb-2 block">Temperature ({apiConfig.temperature})</label>
              <Button size="sm" variant="secondary" onClick={applyRecommended}>Recommended</Button>
            </div>
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
            <label htmlFor="topP" className="text-sm font-medium mb-2 block">Top P ({Number.isFinite(apiConfig.topP) ? apiConfig.topP.toFixed(2) : '0.90'})</label>
            <input
              id="topP"
              aria-label="Top P"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={Number.isFinite(apiConfig.topP) ? apiConfig.topP : 0.9}
              onChange={(e) => updateConfig({ topP: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Deterministic</span>
              <span>Diverse</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="maxTokens" className="text-sm font-medium mb-2 block">Max Tokens ({apiConfig.maxTokens})</label>
              {apiConfig.provider === 'openrouter' && findSelectedOpenRouterModel?.contextWindow && (
                <span className="text-xs text-muted-foreground">Context window: {formatTokens(findSelectedOpenRouterModel.contextWindow)}</span>
              )}
            </div>
            <input
              id="maxTokens"
              aria-label="Max Tokens"
              type="range"
              min={512}
              max={Math.max(1024, maxTokenCap)}
              step={256}
              value={apiConfig.maxTokens}
              onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTokens(512)}</span>
              <span>{formatTokens(Math.max(1024, maxTokenCap))}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card className="py-4 sm:col-span-2 xl:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Pulse className="h-5 w-5" />
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
        <WarningCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> Your API keys are stored locally in your browser and never sent to external servers. Keep them safe and do not share.
        </AlertDescription>
      </Alert>

      {/* OpenRouter Model Picker */}
      <CommandDialog open={isModelPickerOpen} onOpenChange={setIsModelPickerOpen} title="Select a model" description="Search OpenRouter catalog">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No models found.</CommandEmpty>
            <CommandGroup heading="Recommended">
              {openRouterModels
                .filter(m => recommendedModelIds.some(id => m.id === id || m.label === id))
                .map(m => (
                  <CommandItem key={m.id} value={`${m.label} ${m.id}`} onSelect={() => onSelectModel(m.id)}>
                    <div className="flex flex-col">
                      <span className="font-medium">{m.label}</span>
                      <span className="text-xs text-muted-foreground">{m.id}{m.contextWindow ? ` • ctx ${formatTokens(m.contextWindow)}` : ''}</span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="All Models">
              {openRouterModels.map(m => (
                <CommandItem key={m.id} value={`${m.label} ${m.id}`} onSelect={() => onSelectModel(m.id)}>
                  <div className="flex flex-col">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.id}{m.contextWindow ? ` • ctx ${formatTokens(m.contextWindow)}` : ''}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}