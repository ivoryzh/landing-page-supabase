"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Cpu, Zap, Download, Wifi, Usb, CheckCircle, AlertCircle,
  Settings, Play, ChevronRight, Search, Plus, Trash2, FileText, Code
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
  userEmail?: string;
  modules: Module[];
}

export default function IvoryOSHub({ userEmail, modules }: IvoryOSHubProps) {
  // --- State Management ---
  const { cartItems, removeFromCart, clearCart } = useBuildCart();
  const [selectedOptimizers, setSelectedOptimizers] = useState<string[]>([]);
  const [connections, setConnections] = useState<any>({});
  const [step, setStep] = useState('hardware');
  const [copiedMain, setCopiedMain] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    const savedOptimizers = localStorage.getItem('ivoryos-build-optimizers');

    if (savedOptimizers) {
      try {
        setSelectedOptimizers(JSON.parse(savedOptimizers));
      } catch (e) {
        console.error("Failed to parse saved optimizers", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sync connections with cartItems
  useEffect(() => {
    // We want to preserve existing connections if possible, but add new ones for new items
    // and remove ones for removed items.
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

        // Count how many of this same module (by ID) are already in the cart BEFORE this one
        // to generate a nice nickname like "Camera #1", "Camera #2"
        // Actually, let's just use the index in the cart for simplicity or filter by ID.
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
  const generateBashScript = () => {
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

    const bashScript = `
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
${uniqueHardware.map(hw => `uv pip install ${hw.package}`).join('\n')}
${optimizerPackages.map(pkg => `uv pip install ${pkg}`).join('\n')}

Start-Process "http://localhost:8000"
python main.py
`;

    const batScript = `@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0\\ivoryos-setup.ps1"
pause
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
    ivoryos.run(__name__)
`;

    return { bash: bashScript, python: mainScript, bat: batScript };
  };

  const handleDownload = () => {
    const { bash, python, bat } = generateBashScript();
    const zip = new JSZip();
    zip.file('ivoryos-setup.ps1', bash);
    zip.file('main.py', python);
    zip.file('run.bat', bat);

    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'ivoryos-scripts.zip');
      })
      .catch((err) => console.error('Failed to generate ZIP:', err));
  };

  const handleCopyMain = () => {
    const { python } = generateBashScript();
    navigator.clipboard.writeText(python);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  // --- Render ---
  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="bg-muted/50 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">Community Hub</h1>
              <p className="text-sm text-muted-foreground">
                {userEmail ? `Logged in as ${userEmail}` : 'No-code laboratory automation'}
              </p>
            </div>
            <a href="/hub/contribute" className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors">
              + Contribute
            </a>
          </div>

          {/* Navigation Stepper */}
          <div className="flex items-center gap-2 text-xs md:text-sm overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'hardware', icon: Cpu, label: 'Hardware' },
              { id: 'optimizers', icon: Zap, label: 'Optimizers' },
              { id: 'connect', icon: Settings, label: 'Connect' },
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

      <div className="p-6">
        {step === 'hardware' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              <button
                onClick={() => cartItems.length > 0 && setStep('optimizers')}
                disabled={cartItems.length === 0}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Optimizers Step */}
        {step === 'optimizers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            {/* Sidebar for Selected Optimizers */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 h-fit">
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
                <button onClick={() => setStep('connect')} className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                  Next Step
                </button>
                <button onClick={() => setStep('hardware')} className="w-full py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg text-sm">
                  Back to Hardware
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Connections Step */}
        {step === 'connect' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(hw => (
                <div key={hw.instanceId} className="border border-border rounded-xl p-6 bg-card shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3 mb-4 border-b border-border pb-4">
                    <span className="text-2xl">{hw.icon}</span>
                    <input
                      type="text"
                      value={connections[hw.instanceId]?.nickname || ''}
                      onChange={(e) => updateConnection(hw.instanceId, 'nickname', e.target.value)}
                      className="font-bold text-foreground text-lg bg-transparent border-b-2 border-transparent hover:border-primary/50 focus:border-primary focus:outline-none flex-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Type</label>
                      <div className="flex gap-2">
                        {hw.connection.map((conn: string) => (
                          <button
                            key={conn}
                            onClick={() => updateConnection(hw.instanceId, 'type', conn)}
                            className={`flex-1 py-1.5 px-3 rounded text-sm border transition-colors ${connections[hw.instanceId]?.type === conn
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-background border-input text-muted-foreground hover:bg-accent'
                              }`}
                          >
                            {conn.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Removed explicit Port input as requested */}
                  </div>

                  {/* Custom Init Args */}
                  {hw.init_args && hw.init_args.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
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
                <button onClick={() => setStep('launch')} className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                  Next Step
                </button>
                <button onClick={() => setStep('optimizers')} className="w-full py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg text-sm">
                  Back to Optimizers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Launch Step */}
        {step === 'launch' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
                <h3 className="font-bold text-foreground mb-4">Launch Configuration</h3>

                <div className="flex gap-4 mb-6">
                  <button
                    className="flex-1 p-4 border-2 border-primary bg-primary/5 rounded-lg flex flex-col items-center gap-2 transition-colors cursor-default"
                  >
                    <Code className="w-6 h-6 text-primary" />
                    <span className="font-medium text-foreground">Bash/Powershell</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/30 border border-border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-muted-foreground">Preview: main.py</span>
                      <div className="flex gap-2">
                        <button onClick={handleCopyMain} className="text-xs px-2 py-1 border border-input rounded hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors">
                          {copiedMain ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto text-xs rounded border border-border">
                      <SyntaxHighlighter language="python" style={oneDark} customStyle={{ margin: 0 }}>
                        {generateBashScript().python}
                      </SyntaxHighlighter>
                    </div>
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
                  Download Files
                </button>
                <button onClick={() => setStep('connect')} className="w-full py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg text-sm">
                  Back to Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};