import * as vscode from 'vscode';

export class ConfigurationManager {
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = vscode.workspace.getConfiguration('terminai');
    }

    /**
     * Get API key from configuration
     */
    public getApiKey(): string {
        return this.config.get<string>('apiKey', '');
    }

    /**
     * Get AI model from configuration
     */
    public getModel(): string {
        return this.config.get<string>('model', 'gpt-4');
    }

    /**
     * Get maximum tokens from configuration
     */
    public getMaxTokens(): number {
        return this.config.get<number>('maxTokens', 1000);
    }

    /**
     * Update API key in configuration
     */
    public async updateApiKey(apiKey: string): Promise<void> {
        await this.config.update('apiKey', apiKey, vscode.ConfigurationTarget.Global);
    }

    /**
     * Update AI model in configuration
     */
    public async updateModel(model: string): Promise<void> {
        await this.config.update('model', model, vscode.ConfigurationTarget.Global);
    }

    /**
     * Update maximum tokens in configuration
     */
    public async updateMaxTokens(maxTokens: number): Promise<void> {
        await this.config.update('maxTokens', maxTokens, vscode.ConfigurationTarget.Global);
    }

    /**
     * Check if configuration is valid
     */
    public isValidConfiguration(): boolean {
        const apiKey = this.getApiKey();
        return apiKey.length > 0;
    }

    /**
     * Get configuration summary
     */
    public getConfigurationSummary(): string {
        const apiKey = this.getApiKey();
        const model = this.getModel();
        const maxTokens = this.getMaxTokens();

        return `Configuration Summary:
• API Key: ${apiKey ? 'Configured' : 'Not configured'}
• Model: ${model}
• Max Tokens: ${maxTokens}
• Status: ${this.isValidConfiguration() ? '✅ Ready' : '❌ Needs configuration'}`;
    }

    /**
     * Open settings for configuration
     */
    public async openSettings(): Promise<void> {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'terminai');
    }

    /**
     * Validate API key format (basic validation)
     */
    public validateApiKeyFormat(apiKey: string): boolean {
        // Basic validation - in real implementation, this would be more specific
        // based on the AI service being used
        return apiKey.length >= 20 && apiKey.includes('_');
    }

    /**
     * Get available AI models
     */
    public getAvailableModels(): string[] {
        return [
            'gpt-4',
            'gpt-4-turbo',
            'gpt-3.5-turbo',
            'claude-3-opus',
            'claude-3-sonnet',
            'claude-3-haiku',
            'gemini-pro'
        ];
    }

    /**
     * Check if model is supported
     */
    public isModelSupported(model: string): boolean {
        return this.getAvailableModels().includes(model);
    }
}