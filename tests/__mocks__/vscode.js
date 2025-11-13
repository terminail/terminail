module.exports = {
    window: {
        showErrorMessage: jest.fn(),
        showInformationMessage: jest.fn(),
        showInputBox: jest.fn(),
        createOutputChannel: jest.fn().mockReturnValue({
            appendLine: jest.fn(),
            show: jest.fn()
        }),
        registerWebviewViewProvider: jest.fn()
    },
    commands: {
        registerCommand: jest.fn()
    },
    workspace: {
        getConfiguration: jest.fn().mockImplementation((section) => {
            // 返回一个配置对象，其get方法能够正确处理默认值
            const config = {
                get: jest.fn().mockImplementation((key, defaultValue) => {
                    // 模拟vscode配置的行为：如果配置值不存在，返回默认值
                    // 对于terminail配置的apiKey，如果没有设置，应该返回空字符串
                    if (section === 'terminail' && key === 'apiKey') {
                        return defaultValue !== undefined ? defaultValue : '';
                    }
                    return defaultValue;
                }),
                update: jest.fn().mockResolvedValue(undefined),
                has: jest.fn().mockReturnValue(false),
                inspect: jest.fn().mockReturnValue(undefined)
            };
            
            // 允许测试文件覆盖这个mock配置
            return config;
        })
    },
    ExtensionContext: jest.fn(),
    EventEmitter: class EventEmitter {
        constructor() {
            this.event = jest.fn();
        }
        fire() {}
    },
    Uri: {
        parse: jest.fn(),
        file: jest.fn()
    }
};