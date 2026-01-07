"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Cpu, Zap, Download, Wifi, Usb, CheckCircle, AlertCircle,
  Settings, Play, ChevronRight, Search, Plus, Trash2, FileText, Code,
  Monitor, Terminal, Command
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { optimizerOptions } from './constants';

import { Database } from "@/utils/supabase/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useBuildCart } from "@/context/build-cart-context";
import Link from 'next/link';

type Module = Database["public"]["Tables"]["modules"]["Row"] & {
  devices: Database["public"]["Tables"]["devices"]["Row"] | null;
  profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
};

interface IvoryOSHubProps {
  userEmail: string | null;
  modules: Module[];
}

type OSType = 'windows' | 'unix';

export default function IvoryOSHub({ userEmail, modules }: IvoryOSHubProps) {
  const { cartItems, removeFromCart, clearCart } = useBuildCart();
  const [selectedOptimizers, setSelectedOptimizers] = useState<string[]>([]);
  const [connections, setConnections] = useState<any>({});
  const [step, setStep] = useState('hardware');
  const [copiedMain, setCopiedMain] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [port, setPort] = useState('8000');
  const [osType, setOsType] = useState<OSType>('windows');
  const [activeScriptTab, setActiveScriptTab] = useState<'main' | 'setup'>('main');

  useEffect(() => {
    const savedOptimizers = localStorage.getItem('ivoryos-build-optimizers');
    if (savedOptimizers) {
      try {
        setSelectedOptimizers(JSON.parse(savedOptimizers));
      } catch (e) {
        console.error("Failed to parse saved optimizers", e);
      }
    }

    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("win") !== -1) setOsType('windows');
    else setOsType('unix');

    setIsLoaded(true);
  }, []);

  // Sync connections with cartItems
  useEffect(() => {
    const newConnections: any = { ...connections };

    // Remove connections for items no longer in cart
    Object.keys(newConnections).forEach(instanceId => {
      if (!cartItems.find(item => item.instanceId === instanceId)) {
        delete newConnections[instanceId];
      }
    });

    // Add connections for new items
    cartItems.forEach((item, index) => {
      if (!newConnections[item.instanceId]) {
        const initialArgs: Record<string, any> = {};
        if (item.init_args) {
          item.init_args.forEach((arg: any) => {
            if (arg.type === 'bool') initialArgs[arg.name] = false;
            else initialArgs[arg.name] = '';
          });
        }

        const sameTypeCount = cartItems.filter((i, idx) => i.id === item.id && idx <= index).length;

        newConnections[item.instanceId] = {
          type: item.connection[0] || 'usb',
          port: '',
          ip: '',
          nickname: `${item.name} #${sameTypeCount}`,
          args: initialArgs
        };
      }
    });

    setConnections(newConnections);
  }, [cartItems]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ivoryos-build-optimizers', JSON.stringify(selectedOptimizers));
    }
  }, [selectedOptimizers, isLoaded]);

  const updateConnection = (instanceId: string, field: string, value: any) => {
    setConnections({
      ...connections,
      [instanceId]: {
        ...connections[instanceId],
        [field]: value
      }
    });
  };

  const updateCustomArg = (instanceId: string, argName: string, value: any) => {
    setConnections({
      ...connections,
      [instanceId]: {
        ...connections[instanceId],
        args: {
          ...connections[instanceId].args,
          [argName]: value
        }
      }
    });
  };

  // --- Code Generation ---
  const generateScripts = () => {
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

  const handleDownload = () => {
    const { ps, bash, python, bat } = generateScripts();
    const zip = new JSZip();

    zip.file('main.py', python);

    if (osType === 'windows') {
      zip.file('ivoryos-setup.ps1', ps);
      zip.file('run.bat', bat);
    } else {
      zip.file('setup.sh', bash);
    }

    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'ivoryos-scripts.zip');
      })
      .catch((err) => console.error('Failed to generate ZIP:', err));
  };

  const handleCopy = () => {
    const { ps, bash, python } = generateScripts();
    if (activeScriptTab === 'main') {
      navigator.clipboard.writeText(python);
    } else {
      navigator.clipboard.writeText(osType === 'windows' ? ps : bash);
    }
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Header Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">Build your platform</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'hardware', icon: Cpu, label: 'Hardware' },
              { id: 'connect', icon: Settings, label: 'Connect' },
              { id: 'optimizers', icon: Zap, label: 'IvoryOS Config' },
              { id: 'launch', icon: Play, label: 'Launch' },
            ].map((s, idx, arr) => (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full whitespace-nowrap transition-colors ${step === s.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </button>
                {idx < arr.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground/30" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {step === 'hardware' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-muted/30 border border-border rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Build Your Setup</h2>
                <p className="text-muted-foreground mb-6">
                  Browse the Modules and Devices pages to add hardware to your build.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/hub/modules" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90">
                    Browse Modules
                  </Link>
                  <Link href="/hub/devices" className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:bg-secondary/80">
                    Browse Devices
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 h-fit">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Selected ({cartItems.length})
              </h3>

              <div className="space-y-2 max-h-[500px] overflow-y-auto mb-4">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No devices added yet</p>
                ) : (
                  cartItems.map(hw => (
                    <div key={hw.instanceId} className="p-3 bg-card rounded-lg border border-border shadow-sm flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-foreground">{connections[hw.instanceId]?.nickname || hw.name}</p>
                        <p className="text-xs text-muted-foreground">{hw.name}</p>
                      </div>
                      <button onClick={() => removeFromCart(hw.instanceId)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => setStep('connect')} className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                  Next Step
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Connections Step */}
        {step === 'connect' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(hw => (
                <div key={hw.instanceId} className="border border-border rounded-xl p-6 bg-card shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 ">
                    <span className="text-2xl">{hw.icon}</span>
                    <input
                      type="text"
                      value={connections[hw.instanceId]?.nickname || ''}
                      onChange={(e) => updateConnection(hw.instanceId, 'nickname', e.target.value)}
                      className="font-bold text-foreground text-lg bg-transparent border-b-2 border-transparent hover:border-primary/50 focus:border-primary focus:outline-none flex-1"
                    />
                    <div className="flex items-center gap-2">
                      {hw.connection.map((conn: string) => (
                        <span
                          key={conn}
                          className={`text-xs px-2 py-1 rounded border`}
                        >
                          {conn.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Custom Init Args */}
                  {hw.init_args && hw.init_args.length > 0 && (
                    <div className="mt-4 pt-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hw.init_args.map((arg: any) => (
                          <div key={arg.name}>
                            <Label className="text-xs text-muted-foreground mb-1.5 block">
                              {arg.name} <span className="text-[10px] opacity-70">({arg.type})</span>
                            </Label>
                            {arg.type === 'bool' ? (
                              <div className="flex items-center space-x-2 h-9">
                                <Checkbox
                                  id={`${hw.instanceId}-${arg.name}`}
                                  checked={connections[hw.instanceId]?.args?.[arg.name] || false}
                                  onCheckedChange={(c) => updateCustomArg(hw.instanceId, arg.name, !!c)}
                                />
                                <label htmlFor={`${hw.instanceId}-${arg.name}`} className="text-sm cursor-pointer">
                                  Enabled
                                </label>
                              </div>
                            ) : (
                              <Input
                                type={arg.type === 'int' || arg.type === 'float' ? 'number' : 'text'}
                                step={arg.type === 'float' ? 'any' : '1'}
                                value={connections[hw.instanceId]?.args?.[arg.name] || ''}
                                onChange={(e) => updateCustomArg(hw.instanceId, arg.name, e.target.value)}
                                className="h-9"
                                placeholder={`Enter ${arg.name}...`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar for Actions */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 h-fit">
              <h3 className="font-bold text-foreground mb-3">Actions</h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => setStep('optimizers')} className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                  Next Step
                </button>
                <button onClick={() => setStep('hardware')} className="w-full py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg text-sm">
                  Back to Hardware
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Optimizers Step (IvoryOS Config) */}
        {step === 'optimizers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {optimizerOptions.map(opt => (
                  <div
                    key={opt.id}
                    className={`p-4 border rounded-xl transition-all bg-card ${selectedOptimizers.includes(opt.id)
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-primary/50 hover:shadow-md'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl">{opt.icon}</span>
                      <button
                        onClick={() => setSelectedOptimizers(prev =>
                          prev.includes(opt.id) ? prev.filter(id => id !== opt.id) : [...prev, opt.id]
                        )}
                        className={`text-sm font-medium flex items-center gap-1 ${selectedOptimizers.includes(opt.id) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                      >
                        {selectedOptimizers.includes(opt.id) ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {selectedOptimizers.includes(opt.id) ? 'Added' : 'Add'}
                      </button>
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{opt.name}</h3>
                    <p className="text-xs text-primary mb-2">{opt.source}</p>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar for Selected Optimizers & Config */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 h-fit">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Configuration
              </h3>

              <div className="mb-6 space-y-2">
                <label className="text-sm font-medium text-foreground">IvoryOS Port</label>
                <Input
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="8000"
                  className="bg-card"
                />
                <p className="text-xs text-muted-foreground">Port to run the IvoryOS web server on.</p>
              </div>

              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Selected ({selectedOptimizers.length})
              </h3>

              <div className="space-y-2 max-h-[500px] overflow-y-auto mb-4">
                {selectedOptimizers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No optimizers added yet</p>
                ) : (
                  selectedOptimizers.map(optId => {
                    const opt = optimizerOptions.find(o => o.id === optId);
                    if (!opt) return null;
                    return (
                      <div key={opt.id} className="p-3 bg-card rounded-lg border border-border shadow-sm flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-foreground">{opt.name}</p>
                          <p className="text-xs text-muted-foreground">{opt.source}</p>
                        </div>
                        <button onClick={() => setSelectedOptimizers(prev => prev.filter(id => id !== opt.id))} className="text-destructive hover:text-destructive/80">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => setStep('launch')} className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                  Next Step
                </button>
                <button onClick={() => setStep('connect')} className="w-full py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg text-sm">
                  Back to Connect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Launch Step */}
        {step === 'launch' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-foreground">Launch Configuration</h3>

                  {/* OS Selector */}
                  <div className="flex bg-muted/30 p-1 rounded-lg border border-border">
                    <button
                      onClick={() => setOsType('windows')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${osType === 'windows' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      Windows
                    </button>
                    <button
                      onClick={() => setOsType('unix')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${osType === 'unix' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      Mac / Linux
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  {/* Tabs */}
                  <div className="flex items-center gap-1 mb-0 border-b border-border">
                    <button
                      onClick={() => setActiveScriptTab('main')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeScriptTab === 'main'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      Main Script (main.py)
                    </button>
                    <button
                      onClick={() => setActiveScriptTab('setup')}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeScriptTab === 'setup'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      Setup Script ({osType === 'windows' ? 'ps1/bat' : 'sh'})
                    </button>
                  </div>

                  {/* Code Area */}
                  <div className="bg-muted/30 border border-t-0 border-border rounded-b-lg p-0">
                    <div className="flex justify-end p-2 bg-card/50 border-b border-border">
                      <button
                        onClick={handleCopy}
                        className="text-xs px-2 py-1 border border-input rounded hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors flex items-center gap-1.5"
                      >
                        {copiedMain ? <CheckCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {copiedMain ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto text-xs">
                      <SyntaxHighlighter
                        language={activeScriptTab === 'main' ? "python" : (osType === 'windows' ? "powershell" : "bash")}
                        style={oneDark}
                        customStyle={{ margin: 0, fontSize: '11px' }}
                      >
                        {activeScriptTab === 'main'
                          ? generateScripts().python
                          : (osType === 'windows' ? generateScripts().ps : generateScripts().bash)
                        }
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-muted-foreground">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {osType === 'windows' ? <Monitor className="w-5 h-5 text-primary" /> : <Terminal className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Ready for {osType === 'windows' ? 'Windows' : 'Mac & Linux'}</p>
                    <p className="text-xs">Download includes {osType === 'windows' ? 'PowerShell script and .bat file' : 'Bash script'} for easy setup.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar for Actions */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 h-fit">
              <h3 className="font-bold text-foreground mb-3">Download & Run</h3>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleDownload}
                  className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="w-5 h-5" />
                  Download Bundle
                </button>
                <div className="text-xs text-muted-foreground text-center">
                  Includes main.py and setup script for {osType === 'windows' ? 'Windows' : 'Mac & Linux'}
                </div>

                {osType !== 'windows' && (
                  <div className="bg-background border border-border rounded p-3 text-xs text-muted-foreground">
                    <p className="font-semibold mb-1 text-foreground">How to run:</p>
                    <p className="mb-2">1. Unzip the downloaded folder</p>
                    <p className="mb-1">2. Open Terminal in that folder</p>
                    <p>3. Run this command:</p>
                    <code className="block bg-muted mt-1 p-1.5 rounded select-all cursor-text text-foreground bg-primary/10">
                      chmod +x setup.sh && ./setup.sh
                    </code>
                  </div>
                )}

                {osType === 'windows' && (
                  <div className="bg-background border border-border rounded p-3 text-xs text-muted-foreground">
                    <p className="font-semibold mb-1 text-foreground">How to run:</p>
                    <p>Double-click <span className="text-foreground font-mono">run.bat</span> to start.</p>
                  </div>
                )}

                <button onClick={() => setStep('optimizers')} className="w-full py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg text-sm">
                  Back to IvoryOS Config
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}