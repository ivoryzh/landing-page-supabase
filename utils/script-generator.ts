
import { optimizerOptions } from '@/app/hub/ivoryos/constants';

interface Module {
    id: number | string;
    name: string;
    module: string;
    package: string;
    path?: string | null;
    init_args?: any[] | null;
    // Add other necessary fields
}

export const generateScripts = (
    cartItems: any[],
    selectedOptimizers: string[],
    connections: any,
    port: string,
    userEmail: string | null
) => {
    const uniqueHardware = Array.from(new Map(cartItems.map(hw => [hw.module, hw])).values());
    const optimizerPackages = selectedOptimizers.map(id =>
        optimizerOptions.find(o => o.id === id)?.package
    ).filter(Boolean);

    const hardwareImports = uniqueHardware.map(hw => {
        return `from ${hw.path} import ${hw.module}`;
    }).join('\n');

    const hardwareInstances = cartItems.map(hw => {
        const varName = connections[hw.instanceId]?.nickname.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'device';
        const conn = connections[hw.instanceId];
        const args = [];

        // Standard args
        if (conn?.type === 'usb') {
            if (conn.port) args.push(`port="${conn.port}"`);
        } else {
            if (conn?.ip) args.push(`ip="${conn.ip}"`);
            if (conn?.networkPort) args.push(`port=${conn.networkPort}`);
        }

        // Custom args
        if (hw.init_args && conn?.args) {
            hw.init_args.forEach((argDefinition: any) => {
                const val = conn.args[argDefinition.name];
                if (val !== undefined && val !== "") {
                    if (argDefinition.type === 'str') {
                        args.push(`${argDefinition.name}="${val}"`);
                    } else {
                        // int, float, bool (python bool is True/False)
                        if (argDefinition.type === 'bool') {
                            args.push(`${argDefinition.name}=${val ? 'True' : 'False'}`);
                        } else {
                            args.push(`${argDefinition.name}=${val}`);
                        }
                    }
                }
            });
        }

        return `    ${varName} = ${hw.module}(${args.join(', ')})`;
    }).join('\n');

    // Windows PowerShell Script
    const psScript = `
# IvoryOS Universal Setup Script
# Generated: ${new Date().toISOString()}
# User: ${userEmail || 'Guest'}

Write-Host "=== Setting up IvoryOS environment ==="

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "uv not found, installing uv..."
    try {
        iwr https://astral.sh/uv/install.ps1 -UseBasicParsing | iex
    } catch {
        Write-Error "Failed to install uv."
        exit 1
    }
}

if (Test-Path ".venv") { Remove-Item -Recurse -Force ".venv" }
uv venv .venv
& .\\.venv\\Scripts\\Activate.ps1

uv pip install ivoryos
${Array.from(new Set(uniqueHardware.map(hw => hw.package))).map(pkg => `uv pip install ${pkg}`).join('\n')}
${optimizerPackages.map(pkg => `uv pip install ${pkg}`).join('\n')}

Start-Process "http://localhost:${port}"
python main.py
`;

    const batScript = `@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0\\ivoryos-setup.ps1"
pause
`;

    // Unix/Mac Bash Script
    const bashScript = `#!/bin/bash
# IvoryOS Setup Script for Mac/Linux
# Generated: ${new Date().toISOString()}

echo "=== Setting up IvoryOS environment ==="

if ! command -v uv &> /dev/null; then
    echo "uv not found, installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi

if [ -d ".venv" ]; then
    rm -rf .venv
fi

uv venv .venv
source .venv/bin/activate

echo "Installing dependencies..."
uv pip install ivoryos
${Array.from(new Set(uniqueHardware.map(hw => hw.package))).map(pkg => `uv pip install ${pkg}`).join('\n')}
${optimizerPackages.map(pkg => `uv pip install ${pkg}`).join('\n')}

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:${port}"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:${port}"
    fi
fi

python3 main.py
`;

    const mainScript = `#!/usr/bin/env python3
"""
IvoryOS Main Script
Generated: ${new Date().toISOString()}
"""

${hardwareImports}
import ivoryos

# Initialize hardware
try:
${hardwareInstances || '    pass'}
except Exception as e:
    print(f"Failed to initialize hardware: {e}. Connect them in the web interface or try again.")
    
# Start IvoryOS web interface
if __name__ == "__main__":
    ivoryos.run(__name__, port=${port})
`;

    return { ps: psScript, bash: bashScript, python: mainScript, bat: batScript };
};
