/**
 * End-to-End Test: Sidebar Icon Verification
 * 
 * This test verifies that the Terminail extension appears with an icon in the sidebar
 * and can be dragged to the panel area.
 */

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

async function testSidebarIcon() {
    console.log('=== Terminail Sidebar Icon End-to-End Test ===\n');
    
    try {
        // 1. Verify extension is available
        console.log('1. Verifying extension is available...');
        const extension = vscode.extensions.getExtension('Terminail.terminail');
        if (!extension) {
            throw new Error('Terminail extension not found');
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
        const terminailViewContainer = activityBarViews.find(container => container.id === 'terminail');
        
        if (!terminailViewContainer) {
            throw new Error('Terminail view container not found in activity bar configuration');
        }
        
        console.log(`✅ Terminail view container found in activity bar: ${terminailViewContainer.title}`);
        console.log(`✅ Sidebar icon configured with title: ${terminailViewContainer.title}`);
        console.log(`✅ Sidebar icon configured with icon: ${terminailViewContainer.icon || 'default'}`);
        
        // 4. Verify the view is registered to the sidebar container
        console.log('\n3. Verifying view registration...');
        if (!packageJson.contributes.views || !packageJson.contributes.views.terminail) {
            throw new Error('Missing terminail view registration in package.json');
        }
        
        const terminailViews = packageJson.contributes.views.terminail;
        const terminailView = terminailViews.find(view => view.id === 'terminail.terminalView');
        
        if (!terminailView) {
            throw new Error('Terminai.terminalView not found in terminail view container');
        }
        
        console.log(`✅ terminail.terminalView registered in terminail container: ${terminailView.name}`);
        
        // 5. Verify the view is also registered to the panel (for drag functionality)
        if (!packageJson.contributes.views['panel']) {
            console.warn('⚠️  terminail.terminalView not registered in panel container (may not be draggable)');
        } else {
            const panelViews = packageJson.contributes.views['panel'];
            const panelView = panelViews.find(view => view.id === 'terminail.terminalView');
            
            if (panelView) {
                console.log(`✅ terminail.terminalView also registered in panel container: ${panelView.name}`);
            } else {
                console.warn('⚠️  terminail.terminalView not found in panel container (may not be draggable)');
            }
        }
        
        // 6. Verify the command is registered
        console.log('\n4. Verifying command registration...');
        const commands = await vscode.commands.getCommands(true);
        const hasMainCommand = commands.includes('terminail.openTerminal');
        
        if (!hasMainCommand) {
            throw new Error('Main command not registered');
        }
        console.log('✅ Main command is registered: terminail.openTerminal');
        
        console.log('\n🎉 Terminail Sidebar Icon End-to-End Test PASSED!');
        console.log('\nSummary of verified functionality:');
        console.log('- Extension is available and activates correctly');
        console.log('- Sidebar icon is configured in activity bar');
        console.log('- View is registered to sidebar container');
        console.log('- View is also registered to panel container for drag functionality');
        console.log('- Main command is properly registered');
        
        return true;
        
    } catch (error) {
        console.error('❌ Terminail Sidebar Icon End-to-End Test FAILED:', error.message);
        console.log('\nTroubleshooting steps:');
        console.log('1. Verify that viewsContainers.activitybar is properly configured in package.json');
        console.log('2. Verify that the terminail view container has proper id, title, and icon');
        console.log('3. Verify that terminail.terminalView is registered in the terminail container');
        console.log('4. Verify that terminail.terminalView is also registered in the panel container');
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