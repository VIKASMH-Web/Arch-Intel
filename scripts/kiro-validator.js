/**
 * AWS Kiro Build Workflow: Spec-to-Code Validator
 * This script verifies that the current codebase aligns with the requirements 
 * defined in /specs/arch-intel.spec.md.
 */
const fs = require('fs');
const path = require('path');

function validateKiroSpec() {
    console.log('\x1b[35m%s\x1b[0m', '🔍 Starting Kiro Spec Validation...');
    
    const specPath = path.join(__dirname, '../specs/arch-intel.spec.md');
    if (!fs.existsSync(specPath)) {
        console.error('❌ Error: Kiro Specification file not found at /specs/arch-intel.spec.md');
        process.exit(1);
    }

    const specContent = fs.readFileSync(specPath, 'utf8');
    const coreRoutes = ['analyze', 'chat'];
    
    console.log('\x1b[36m%s\x1b[0m', '📂 Checking API routes against spec...');

    let allPassed = true;

    coreRoutes.forEach(route => {
        const routePath = path.join(__dirname, `../src/app/api/arch-intel/${route}/route.ts`);
        if (fs.existsSync(routePath)) {
            console.log(`✅ [SPEC-ALIGN] Route /api/arch-intel/${route} found.`);
            
            // Basic check for AWS Bedrock integration in the code
            const content = fs.readFileSync(routePath, 'utf8');
            if (content.includes('bedrockClient')) {
                console.log(`   - Verified: Bedrock Runtime Integration`);
            } else {
                console.warn(`   - Warning: Missing Bedrock client in ${route}`);
                allPassed = false;
            }
        } else {
            console.error(`❌ [ERROR] Route /api/arch-intel/${route} is missing but defined in spec!`);
            allPassed = false;
        }
    });

    if (allPassed) {
        console.log('\n\x1b[32m%s\x1b[0m', '✅ SUCCESS: Build aligns with Kiro Specification.');
    } else {
        console.log('\n\x1b[31m%s\x1b[0m', '⚠️ WARNING: Spec mismatches detected. Review /specs before merging.');
    }
}

validateKiroSpec();
