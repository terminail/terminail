"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const extension = __importStar(require("../../src/extension"));
// Mock the VS Code API
jest.mock('vscode', () => {
    const originalModule = jest.requireActual('vscode');
    return {
        ...originalModule,
        window: {
            showErrorMessage: jest.fn(),
            showInformationMessage: jest.fn()
        },
        commands: {
            registerCommand: jest.fn().mockImplementation((_commandName, _callback) => {
                // Return a disposable object
                return {
                    dispose: jest.fn()
                };
            })
        },
        workspace: {
            getConfiguration: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        }
    };
});
describe('Extension Commands', () => {
    let mockContext;
    beforeEach(() => {
        // Create a mock context
        mockContext = {
            subscriptions: [],
            globalState: {
                get: jest.fn().mockReturnValue([]),
                update: jest.fn().mockResolvedValue(undefined)
            },
            extensionPath: '/test/path',
            extensionUri: {}
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should register the terminai.openTerminal command', async () => {
        // Activate the extension
        await extension.activate(mockContext);
        // Check that the command was registered
        const registerCommandMock = vscode.commands.registerCommand;
        const commandRegistered = registerCommandMock.mock.calls.some(call => call[0] === 'terminai.openTerminal');
        expect(commandRegistered).toBe(true);
    });
    it('should register all required commands', async () => {
        // Activate the extension
        await extension.activate(mockContext);
        // Check that commands were registered
        const registerCommandMock = vscode.commands.registerCommand;
        // These are the commands that should be registered based on package.json
        const requiredCommands = [
            'terminai.openTerminal'
        ];
        requiredCommands.forEach(command => {
            const commandRegistered = registerCommandMock.mock.calls.some(call => call[0] === command);
            expect(commandRegistered).toBe(true);
        });
    });
});
//# sourceMappingURL=extensionCommands.test.js.map