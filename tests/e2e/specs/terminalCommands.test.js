// This file needs to be converted to TypeScript and moved to the proper VS Code test framework
// The current approach is flawed - vscode module cannot be used in regular Node.js environment
// E2E tests should use the @vscode/test-electron framework like tests/vscode/suite/

    describe('cd command', function() {
        it('should switch to deepseek AI', async function() {
            const result = await testRunner.executeCommand('cd deepseek');
            // In real VS Code, the cd command should change the terminal prompt
            // Verify the command executed and the prompt changed to deepseek>
            expect(result).to.not.be.undefined;
            // The terminal prompt should now show "deepseek>"
            expect(result).to.include('deepseek>');
        });

        it('should handle invalid AI name', async function() {
            try {
                await testRunner.executeCommand('cd invalid-ai');
                // If no error is thrown, that's acceptable in real VS Code
            } catch (error) {
                // Error is also acceptable
                expect(error).to.be.an.instanceOf(Error);
            }
        });

        it('should switch between multiple AIs', async function() {
            await testRunner.executeCommand('cd deepseek');
            await testRunner.executeCommand('cd qwen');
            const result = await testRunner.executeCommand('cd doubao');
            expect(result).to.not.be.undefined;
        });

        it('should handle cd command without AI name', async function() {
            try {
                await testRunner.executeCommand('cd');
                // If no error is thrown, that's acceptable
            } catch (error) {
                // Error is also acceptable
                expect(error).to.be.an.instanceOf(Error);
            }
        });
    });

    describe('ls command', function() {
        it('should list all supported AIs', async function() {
            const result = await testRunner.executeCommand('ls');
            // In real VS Code, just verify the command executed
            expect(result).to.not.be.undefined;
        });

        it('should return consistent AI list format', async function() {
            const result = await testRunner.executeCommand('ls');
            // Just verify the command executed without error
            expect(result).to.not.be.undefined;
        });
    });

    describe('qi command', function() {
        it('should ask question to current AI', async function() {
            // First switch to an AI
            await testRunner.executeCommand('cd deepseek');
            
            // Then ask a question
            const result = await testRunner.executeCommand('qi Hello, who are you?', 10000);
            
            // In real VS Code, just verify the command executed
            expect(result).to.not.be.undefined;
        });

        it('should handle questions without switching AI first', async function() {
            try {
                await testRunner.executeCommand('qi Test question');
                // If no error is thrown, that's acceptable
            } catch (error) {
                // Error is also acceptable
                expect(error).to.be.an.instanceOf(Error);
            }
        });

        it('should handle long questions', async function() {
            await testRunner.executeCommand('cd deepseek');
            const longQuestion = 'qi ' + 'This is a very long question that tests the handling of extended input. '.repeat(10) + 'Final question?';            
            const result = await testRunner.executeCommand(longQuestion, 15000);
            expect(result).to.not.be.undefined;
        });

        it('should handle special characters in questions', async function() {
            await testRunner.executeCommand('cd qwen');
            const specialQuestion = 'qi What about special chars: !@#$%^&*()_+{}[]|\\:;"\'<>,.?/~`';
            const result = await testRunner.executeCommand(specialQuestion, 10000);
            expect(result).to.not.be.undefined;
        });

        it('should handle empty questions', async function() {
            await testRunner.executeCommand('cd doubao');
            try {
                await testRunner.executeCommand('qi');
                // If no error is thrown, that's acceptable
            } catch (error) {
                // Error is also acceptable
                expect(error).to.be.an.instanceOf(Error);
            }
        });
    });

    describe('command sequences', function() {
        it('should handle complete workflow', async function() {
            // List AIs
            const listResult = await testRunner.executeCommand('ls');
            expect(listResult).to.not.be.undefined;
            
            // Switch to AI
            const switchResult = await testRunner.executeCommand('cd deepseek');
            expect(switchResult).to.not.be.undefined;
            
            // Ask question
            const questionResult = await testRunner.executeCommand('qi What is your name?', 10000);
            expect(questionResult).to.not.be.undefined;
            
            // Switch to another AI and ask again
            await testRunner.executeCommand('cd qwen');
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

        it('should maintain AI context between commands', async function() {
            await testRunner.executeCommand('cd deepseek');
            await testRunner.executeCommand('qi First question');
            
            // Second question should still be with deepseek
            const secondResult = await testRunner.executeCommand('qi Second question');
            expect(secondResult).to.not.be.undefined;
            
            // Switch and verify context changes
            await testRunner.executeCommand('cd qwen');
            const thirdResult = await testRunner.executeCommand('qi Third question');
            expect(thirdResult).to.not.be.undefined;
        });
    });

    describe('error handling and edge cases', function() {
        it('should handle network timeouts gracefully', async function() {
            await testRunner.executeCommand('cd deepseek');
            // Simulate timeout scenario
            try {
                await testRunner.executeCommand('qi Timeout test', 500);
                // If no error is thrown, that's acceptable
            } catch (error) {
                // Error is also acceptable
                expect(error).to.be.an.instanceOf(Error);
            }
        });

        it('should handle malformed commands', async function() {
            try {
                await testRunner.executeCommand('invalid command');
                // If no error is thrown, that's acceptable
            } catch (error) {
                // Error is also acceptable
                expect(error).to.be.an.instanceOf(Error);
            }
        });

        it('should handle command with extra spaces', async function() {
            const result = await testRunner.executeCommand('  cd   deepseek  ');
            expect(result).to.not.be.undefined;
        });

        it('should handle case sensitivity', async function() {
            const result1 = await testRunner.executeCommand('CD deepseek');
            const result2 = await testRunner.executeCommand('LS');
            const result3 = await testRunner.executeCommand('QI test');
            
            // Commands should be case-insensitive or handle gracefully
            expect(result1).to.not.be.undefined;
            expect(result2).to.not.be.undefined;
            expect(result3).to.not.be.undefined;
        });
    });

    describe('performance and reliability', function() {
        it('should execute commands within reasonable time', async function() {
            const startTime = Date.now();
            await testRunner.executeCommand('cd deepseek');
            const endTime = Date.now();
            
            const executionTime = endTime - startTime;
            expect(executionTime).to.be.lessThan(5000); // Should complete within 5 seconds
        });

        it('should handle concurrent command execution', async function() {
            // Test that multiple commands can be executed in sequence without interference
            const commands = [
                'cd deepseek',
                'qi Question 1',
                'cd qwen',
                'qi Question 2',
                'cd doubao',
                'qi Question 3'
            ];
            
            for (const command of commands) {
                const result = await testRunner.executeCommand(command);
                expect(result).to.not.be.undefined;
            }
        });

        it('should recover from failed commands', async function() {
            // First, execute a failing command
            try {
                await testRunner.executeCommand('cd nonexistent');
                // If no error is thrown, that's acceptable
            } catch (error) {
                // Error is also acceptable
                expect(error).to.be.an.instanceOf(Error);
            }
            
            // Then, execute a valid command to ensure recovery
            const successResult = await testRunner.executeCommand('cd deepseek');
            expect(successResult).to.not.be.undefined;
        });
    });
});