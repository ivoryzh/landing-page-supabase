"use client";

import React, { useState } from 'react';
import {
  Cpu, Zap, Download, Wifi, Usb, CheckCircle, AlertCircle,
  Settings, Play, ChevronRight, Search, Plus, Trash2, FileText, Code
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { hardwareOptions, optimizerOptions } from './constants'; // Import data

export default function IvoryOSHub({ userEmail }: { userEmail?: string }) {
  // --- State Management ---
  const [selectedHardware, setSelectedHardware] = useState<any[]>([]);
  const [selectedOptimizers, setSelectedOptimizers] = useState<string[]>([]);
  const [connections, setConnections] = useState<any>({});
  const [step, setStep] = useState('hardware');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [downloadType, setDownloadType] = useState('bash');
  const [showMainPreview, setShowMainPreview] = useState(false);
  const [copiedMain, setCopiedMain] = useState(false);

  // --- Logic Helpers ---
  const filteredHardware = hardwareOptions.filter(hw =>
    hw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hw.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hw.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const templateOptions: any[] = []; // Add templates here if needed later
  const filteredTemplates = selectedTemplate ? [selectedTemplate] : templateOptions;

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'text-green-600 bg-green-50',
      intermediate: 'text-yellow-600 bg-yellow-50',
      advanced: 'text-red-600 bg-red-50'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-50';
  };

  const addHardware = (hw: any) => {
    const instanceId = `${hw.id}-${Date.now()}`;
    setSelectedHardware([...selectedHardware, { ...hw, instanceId }]);
    setConnections({
      ...connections,
      [instanceId]: {
        type: hw.connection[0],
        port: '',
        baudRate: '115200',
        ip: '',
        networkPort: '8080',
        nickname: `${hw.name} #${selectedHardware.filter(h => h.id === hw.id).length + 1}`
      }
    });
  };

  const removeHardware = (instanceId: string) => {
    setSelectedHardware(selectedHardware.filter(h => h.instanceId !== instanceId));
    const newConnections = { ...connections };
    delete newConnections[instanceId];
    setConnections(newConnections);
  };

  const updateConnection = (instanceId: string, field: string, value: string) => {
    setConnections({
      ...connections,
      [instanceId]: {
        ...connections[instanceId],
        [field]: value
      }
    });
  };

  // --- Code Generation ---
  const generateBashScript = () => {
    const uniqueHardware = Array.from(new Map(selectedHardware.map(hw => [hw.module, hw])).values());
    const optimizerPackages = selectedOptimizers.map(id =>
      optimizerOptions.find(o => o.id === id)?.package
    ).filter(Boolean);

    const hardwareImports = uniqueHardware.map(hw => {
      return `from ${hw.path} import ${hw.module}`;
    }).join('\n');

    const hardwareInstances = selectedHardware.map(hw => {
      const varName = connections[hw.instanceId]?.nickname.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const conn = connections[hw.instanceId];

      if (conn?.type === 'usb') {
        return `    ${varName} = ${hw.module}("${conn.port || '/dev/ttyUSB0'}")`;
      } else {
        return `    ${varName} = ${hw.module}(ip="${conn.ip || '127.0.0.1'}", port=${conn.networkPort || 8080})`;
      }
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

if (Test-Path "ivoryos-env") { Remove-Item -Recurse -Force "ivoryos-env" }
uv venv ivoryos-env
& .\\ivoryos-env\\Scripts\\Activate.ps1

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
${hardwareInstances}
except Exception as e:
    print(f"Failed to initialize hardware: {e}. Connect them in the web interface or try again.")
    
# Start IvoryOS web interface
if __name__ == "__main__":
    ivoryos.run(__name__)
`;

    return { bash: bashScript, python: mainScript, bat: batScript };
  };

  const handleDownload = () => {
    if (downloadType === 'bash') {
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
    }
  };

  const handleCopyMain = () => {
    const { python } = generateBashScript();
    navigator.clipboard.writeText(python);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  const handleDownloadMain = () => {
    const { python } = generateBashScript();
    const pyBlob = new Blob([python], { type: 'text/plain' });
    const pyUrl = URL.createObjectURL(pyBlob);
    const pyLink = document.createElement('a');
    pyLink.href = pyUrl;
    pyLink.download = 'main.py';
    pyLink.click();
    URL.revokeObjectURL(pyUrl);
  };

  // --- Render ---
  return (
    <div className="w-full bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="bg-gray-50 border-b px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">IvoryOS Hub</h1>
              <p className="text-sm text-gray-500">
                {userEmail ? `Logged in as ${userEmail}` : 'No-code laboratory automation'}
              </p>
            </div>
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
                  className={`flex items-center gap-2 px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                    step === s.id ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </button>
                {idx < arr.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {step === 'hardware' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hardware..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredHardware.map(hw => (
                  <div key={hw.id} className="p-4 border rounded-xl hover:border-blue-300 hover:shadow transition-all bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl">{hw.icon}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(hw.difficulty)}`}>
                        {hw.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{hw.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{hw.vendor}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-1">
                        {hw.connection.map((c: string) => (
                          <span key={c} className="text-[10px] uppercase bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                            {c}
                          </span>
                        ))}
                      </div>
                      <button onClick={() => addHardware(hw)} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 h-fit">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Selected ({selectedHardware.length})
              </h3>

              <div className="space-y-2 max-h-[500px] overflow-y-auto mb-4">
                {selectedHardware.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No devices added yet</p>
                ) : (
                  selectedHardware.map(hw => (
                    <div key={hw.instanceId} className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm flex justify-between items-start">
                       <div>
                          <p className="text-sm font-medium text-gray-900">{connections[hw.instanceId]?.nickname}</p>
                          <p className="text-xs text-gray-500">{hw.name}</p>
                       </div>
                       <button onClick={() => removeHardware(hw.instanceId)} className="text-red-400 hover:text-red-600">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => selectedHardware.length > 0 && setStep('optimizers')}
                disabled={selectedHardware.length === 0}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Optimizers Step */}
        {step === 'optimizers' && (
          <div className="max-w-4xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               {optimizerOptions.map(opt => (
                 <div
                   key={opt.id}
                   onClick={() => setSelectedOptimizers(prev =>
                     prev.includes(opt.id) ? prev.filter(id => id !== opt.id) : [...prev, opt.id]
                   )}
                   className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                     selectedOptimizers.includes(opt.id)
                       ? 'border-purple-500 bg-purple-50'
                       : 'border-gray-200 hover:border-purple-300'
                   }`}
                 >
                   <div className="flex justify-between mb-2">
                     <span className="text-3xl">{opt.icon}</span>
                     {selectedOptimizers.includes(opt.id) && <CheckCircle className="w-5 h-5 text-purple-600" />}
                   </div>
                   <h3 className="font-bold text-gray-900">{opt.name}</h3>
                   <p className="text-xs text-purple-600 mb-2">{opt.source}</p>
                   <p className="text-sm text-gray-600">{opt.description}</p>
                 </div>
               ))}
             </div>
             <div className="flex justify-between">
               <button onClick={() => setStep('hardware')} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Back</button>
               <button onClick={() => setStep('connect')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next</button>
             </div>
          </div>
        )}

        {/* Connections Step */}
        {step === 'connect' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {selectedHardware.map(hw => (
              <div key={hw.instanceId} className="border rounded-xl p-6 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-4 border-b pb-4">
                  <span className="text-2xl">{hw.icon}</span>
                  <input
                    type="text"
                    value={connections[hw.instanceId]?.nickname || ''}
                    onChange={(e) => updateConnection(hw.instanceId, 'nickname', e.target.value)}
                    className="font-bold text-gray-900 text-lg border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none flex-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Type</label>
                    <div className="flex gap-2">
                      {hw.connection.map((conn: string) => (
                         <button
                           key={conn}
                           onClick={() => updateConnection(hw.instanceId, 'type', conn)}
                           className={`flex-1 py-1.5 px-3 rounded text-sm border ${
                             connections[hw.instanceId]?.type === conn 
                               ? 'bg-blue-50 border-blue-500 text-blue-700' 
                               : 'bg-white border-gray-300'
                           }`}
                         >
                           {conn.toUpperCase()}
                         </button>
                      ))}
                    </div>
                  </div>

                  {connections[hw.instanceId]?.type === 'usb' ? (
                     <div>
                       <label className="text-sm font-medium text-gray-700 block mb-2">Port</label>
                       <input
                         type="text"
                         placeholder="/dev/ttyUSB0"
                         className="w-full border rounded px-3 py-1.5 text-sm"
                         value={connections[hw.instanceId]?.port || ''}
                         onChange={(e) => updateConnection(hw.instanceId, 'port', e.target.value)}
                       />
                     </div>
                  ) : (
                    <div>
                       <label className="text-sm font-medium text-gray-700 block mb-2">IP Address</label>
                       <input
                         type="text"
                         placeholder="192.168.1.100"
                         className="w-full border rounded px-3 py-1.5 text-sm"
                         value={connections[hw.instanceId]?.ip || ''}
                         onChange={(e) => updateConnection(hw.instanceId, 'ip', e.target.value)}
                       />
                    </div>
                  )}
                </div>
              </div>
            ))}
             <div className="flex justify-between pt-4">
               <button onClick={() => setStep('optimizers')} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Back</button>
               <button onClick={() => setStep('launch')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Next</button>
             </div>
          </div>
        )}

        {/* Launch Step */}
        {step === 'launch' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 border rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Launch Configuration</h3>

              <div className="flex gap-4 mb-6">
                 <button
                   onClick={() => setDownloadType('bash')}
                   className={`flex-1 p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${
                     downloadType === 'bash' ? 'border-blue-500 bg-white' : 'border-gray-200'
                   }`}
                 >
                   <Code className="w-6 h-6 text-blue-600" />
                   <span className="font-medium">Bash/Powershell</span>
                 </button>
                 <button
                   onClick={() => setDownloadType('exe')}
                   className={`flex-1 p-4 border-2 rounded-lg flex flex-col items-center gap-2 ${
                     downloadType === 'exe' ? 'border-blue-500 bg-white' : 'border-gray-200'
                   }`}
                 >
                   <Download className="w-6 h-6 text-green-600" />
                   <span className="font-medium">Executable (.exe)</span>
                 </button>
              </div>

              {downloadType === 'bash' && (
                <div className="space-y-4">
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">Preview: main.py</span>
                      <div className="flex gap-2">
                        <button onClick={handleCopyMain} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">
                          {copiedMain ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto text-xs rounded border">
                       <SyntaxHighlighter language="python" style={oneDark} customStyle={{ margin: 0 }}>
                         {generateBashScript().python}
                       </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
               onClick={handleDownload}
               disabled={downloadType === 'exe'}
               className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 text-lg shadow-lg ${
                 downloadType === 'exe' 
                   ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700'
               }`}
             >
               <Download className="w-6 h-6" />
               {downloadType === 'exe' ? 'Executable Build (Coming Soon)' : 'Download Project Files'}
             </button>

             <div className="mt-8 text-center">
               <button onClick={() => setStep('connect')} className="text-gray-500 hover:text-gray-700">Back to Settings</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};