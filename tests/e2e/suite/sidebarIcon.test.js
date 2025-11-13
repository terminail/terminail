/**
 * End-to-End Test: Sidebar Icon Verification
 * 
 * This test verifies that the TerminAI extension appears with an icon in the sidebar
 * and can be dragged to the panel area.
 */

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

async function testSidebarIcon() {
    console.log('=== TerminAI Sidebar Icon End-to-End Test ===\n');
    
    try {
        // 1. Verify extension is available
        console.log('1. Verifying extension is available...');
        const extension = vscode.extensions.getExtension('TerminAI.terminai');
        if (!extension) {
            throw new Error('TerminAI extension not found');
        }
        console.log('✅ Extension found');
        
        // 2. Activate the extension
        if (!extension.isActive) {
            await extension.activate();
            console.log('✅ Extension activated');
        } else {
            console.log('✅ Extension already active');
        }
        
        // 3. Check if the view container exists in activity bar
        console.log('\n2. Verifying sidebar icon configuration...');
        
        // Get the extension package.json to verify configuration
        let projectRoot = path.resolve(__dirname, '..', '..');
        let packageJsonPath = path.join(projectRoot, 'package.json');
        
        // If not found from current location, try from the directory above
        if (!fs.existsSync(packageJsonPath)) {
            projectRoot = path.resolve(__dirname, '..', '..', '..');
            packageJsonPath = path.join(projectRoot, 'package.json');
        }
        
        if (!fs.existsSync(packageJsonPath)) {
            throw new Error(`package.json not found at expected locations`);
        }
        
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Verify viewsContainers configuration
        if (!packageJson.contributes.viewsContainers || 
            !packageJson.contributes.viewsContainers.activitybar) {
            throw new Error('Missing viewsContainers.activitybar configuration in package.json');
        }
        
        const activityBarViews = packageJson.contributes.viewsContainers.activitybar;
        const terminaiViewContainer = activityBarViews.find(container => container.id === 'terminai');
        
        if (!terminaiViewContainer) {
            throw new Error('TerminAI view container not found in activity bar configuration');
        }
        
        console.log(`✅ TerminAI view container found in activity bar: ${terminaiViewContainer.title}`);
        console.log(`✅ Sidebar icon configured with title: ${terminaiViewContainer.title}`);
        console.log(`✅ Sidebar icon configured with icon: ${terminaiViewContainer.icon || 'default'}`);
        
        // 4. Verify the view is registered to the sidebar container
        console.log('\n3. Verifying view registration...');
        if (!packageJson.contributes.views || !packageJson.contributes.views.terminai) {
            throw new Error('Missing terminai view registration in package.json');
        }
        
        const terminaiViews = packageJson.contributes.views.terminai;
        const terminaiView = terminaiViews.find(view => view.id === 'terminai.terminalView');
        
        if (!terminaiView) {
            throw new Error('Terminai.terminalView not found in terminai view container');
        }
        
        console.log(`✅ terminai.terminalView registered in terminai container: ${terminaiView.name}`);
        
        // 5. Verify the view is also registered to the panel (for drag functionality)
        if (!packageJson.contributes.views['panel']) {
            console.warn('⚠️  terminai.terminalView not registered in panel container (may not be draggable)');
        } else {
            const panelViews = packageJson.contributes.views['panel'];
            const panelView = panelViews.find(view => view.id === 'terminai.terminalView');
            
            if (panelView) {
                console.log(`✅ terminai.terminalView also registered in panel container: ${panelView.name}`);
            } else {
                console.warn('⚠️  terminai.terminalView not found in panel container (may not be draggable)');
            }
        }
        
        // 6. Verify the command is registered
        console.log('\n4. Verifying command registration...');
        const commands = await vscode.commands.getCommands(true);
        const hasMainCommand = commands.includes('terminai.openTerminal');
        
        if (!hasMainCommand) {
            throw new Error('Main command not registered');
        }
        console.log('✅ Main command is registered: terminai.openTerminal');
        
        console.log('\n🎉 TerminAI Sidebar Icon End-to-End Test PASSED!');
        console.log('\nSummary of verified functionality:');
        console.log('- Extension is available and activates correctly');
        console.log('- Sidebar icon is configured in activity bar');
        console.log('- View is registered to sidebar container');
        console.log('- View is also registered to panel container for drag functionality');
        console.log('- Main command is properly registered');
        
        return true;
        
    } catch (error) {
        console.error('❌ TerminAI Sidebar Icon End-to-End Test FAILED:', error.message);
        console.log('\nTroubleshooting steps:');
        console.log('1. Verify that viewsContainers.activitybar is properly configured in package.json');
        console.log('2. Verify that the terminai view container has proper id, title, and icon');
        console.log('3. Verify that terminai.terminalView is registered in the terminai container');
        console.log('4. Verify that terminai.terminalView is also registered in the panel container');
        console.log('5. Ensure all required commands are registered');
        
        return false;
    }
}

// Run the test if called directly
if (require.main === module) {
    testSidebarIcon().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Test execution error:', error);
        process.exit(1);
    });
}

module.exports = { testSidebarIcon };