const { expect } = require('chai');
const TerminailTestRunner = require('../helpers/testRunner');

describe('Complete Terminail Extension E2E Tests', function() {
    this.timeout(30000); // 30 seconds timeout
    
    let testRunner;
    let extension;

    before(async function() {
        testRunner = new TerminailTestRunner();
        extension = await testRunner.activateExtension();
    });

    beforeEach(async function() {
        await testRunner.openTerminailTerminal();
    });

    afterEach(async function() {
        await testRunner.cleanup();
    });

    after(async function() {
        await testRunner.cleanup();
    });

    describe('Extension Activation', function() {
        it('should activate the extension successfully', async function() {
            expect(extension).to.not.be.undefined;
            expect(extension.isActive).to.be.true;
        });

        it('should be able to open the terminal', async function() {
            // This test verifies that the terminal can be opened
            // The actual command execution will be tested in terminailCommands.test.js
            expect(testRunner).to.not.be.undefined;
            expect(testRunner.isActive).to.be.true;
        });
    });

    describe('Complete Workflow', function() {
        it('should execute complete AI interaction workflow', async function() {
            // List available AIs
            const listResult = await testRunner.executeCommand('ls');
            expect(listResult).to.not.be.undefined;
            
            // Switch to deepseek AI
            const switchResult = await testRunner.executeCommand('cd deepseek');
            expect(switchResult).to.not.be.undefined;
            expect(switchResult).to.include('deepseek>');
            
            // Ask a question
            const questionResult = await testRunner.executeCommand('qi Hello, who are you?', 10000);
            expect(questionResult).to.not.be.undefined;
            
            // Switch to another AI
            const secondSwitch = await testRunner.executeCommand('cd qwen');
            expect(secondSwitch).to.not.be.undefined;
            expect(secondSwitch).to.include('qwen>');
            
            // Ask another question
            const secondQuestion = await testRunner.executeCommand('qi Introduce yourself', 10000);
            expect(secondQuestion).to.not.be.undefined;
        });

        it('should handle rapid command sequences', async function() {
            // Test rapid switching and questioning
            await testRunner.executeCommand('cd deepseek');
            await testRunner.executeCommand('qi Quick question 1');
            await testRunner.executeCommand('cd qwen');
            await testRunner.executeCommand('qi Quick question 2');
            await testRunner.executeCommand('cd doubao');
            const result = await testRunner.executeCommand('qi Quick question 3');
            expect(result).to.not.be.undefined;
        });
    });
});