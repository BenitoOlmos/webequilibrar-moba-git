const fs = require('fs');
const filePath = 'c:/Users/benit/OneDrive/Escritorio/PROYECTOS/webequilibrar-moba-git/src/pages/TestRFAI.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useNavigate import
if (!content.includes('useNavigate')) {
    content = content.replace(
        "import React, { useState } from 'react';", 
        "import React, { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';"
    );
}

// 2. Add navigate hook instantiation
if (!content.includes('const navigate = useNavigate();')) {
    content = content.replace(
        "const [error, setError] = useState<string | null>(null);",
        "const [error, setError] = useState<string | null>(null);\n    const navigate = useNavigate();"
    );
}

// 3. Update handleSubmit
const oldSubmitBlock = `            setResults(calculatedResults);
            setShowResults(true);
            window.scrollTo(0, 0);`;
            
const newSubmitBlock = `            const encodedData = btoa(JSON.stringify(calculatedResults));
            navigate(\`/resultado?data=\${encodedData}\`);
            window.scrollTo(0, 0);`;

content = content.replace(oldSubmitBlock, newSubmitBlock);

// 4. Remove the huge "if (showResults && results) { ... }" block.
// It starts around line 329 and ends right before "const getStepContent = () => {"
const startIndex = content.indexOf('if (showResults && results) {');
const endIndex = content.indexOf('const getStepContent = () => {');

if (startIndex !== -1 && endIndex !== -1) {
    const blockToRemove = content.substring(startIndex, endIndex);
    // Let's only remove it if we safely found both markers
    content = content.replace(blockToRemove, '');
}

fs.writeFileSync(filePath, content);
console.log('Successfully refactored TestRFAI.tsx');
