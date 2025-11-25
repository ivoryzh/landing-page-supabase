export const hardwareOptions = [
  {
    id: 'ika-hotplate',
    name: 'IKA Hotplate Stirrer',
    category: 'Heating & Stirring',
    vendor: 'IKA',
    connection: ['usb'],
    icon: '🌡️',
    specs: 'RCT digital, RS232',
    difficulty: 'beginner',
    package: 'ika',
    path: 'ika.magnetic_stirrer',
    module: 'MagneticStirrer'
  },
  {
    id: 'ika-vacuum',
    name: 'IKA Vacuum Pump',
    category: 'Vacuum Systems',
    vendor: 'IKA',
    connection: ['usb'],
    icon: '🔄',
    specs: 'RS232',
    difficulty: 'beginner',
    package: 'ika',
    path: 'ika.vacuum_pump',
    module: 'VacuumPump'
  },
  {
    id: 'new-era-pump',
    name: 'New Era Syringe Pump',
    category: 'Fluid Handling',
    vendor: 'New Era',
    connection: ['usb'],
    icon: '💉',
    specs: 'NE-1000, RS232 control',
    difficulty: 'beginner',
    package: 'new-era',
    path: 'new_era.peristaltic_pump_network',
    module: 'PeristalticPumpNetwork'
  },
  {
    id: 'sielc-autosampler',
    name: 'SIELC Autosampler',
    category: 'Sampling',
    vendor: 'SIELC',
    connection: ['usb'],
    icon: '🧪',
    specs: 'AS-1 Series, serial interface',
    difficulty: 'intermediate',
    package: 'sielc-dompser',
    path: 'sielc_dompser.autosampler.autosampler',
    module: 'Autosampler'
  },
  {
    id: 'vici-valve',
    name: 'VICI Switching Valve',
    category: 'Fluid Routing',
    vendor: 'VICI Valco',
    connection: ['usb'],
    icon: '🔀',
    specs: 'Multiposition valves, TTL/serial',
    difficulty: 'intermediate',
    package: 'vicivalve',
    path: 'vicivalve',
    module: 'VICI'
  },
  {
    id: 'vapourtec-sf10',
    name: 'Vapourtec SF-10',
    category: 'Flow Chemistry',
    vendor: 'Vapourtec',
    connection: ['usb'],
    icon: '⚗️',
    specs: 'Lab scale flow reactor',
    difficulty: 'advanced',
    package: 'vapourtec',
    path: 'vapourtec.sf10',
    module: 'SF10'
  },
  {
    id: 'tecan-pump',
    name: 'Tecan Syringe Pump',
    category: 'Liquid Handling',
    vendor: 'Tecan',
    connection: ['usb'],
    icon: '💧',
    specs: 'Cavro XLP6000, RS232, FTDI serial',
    difficulty: 'intermediate',
    package: 'north-devices',
    path: 'north_devices.pumps.tecan_cavro',
    module: 'TecanCavro'
  },
  {
    id: 'heinsight',
    name: 'HeinSight',
    category: 'Process Monitoring',
    vendor: 'Hein Lab',
    connection: ['network'],
    icon: '📹',
    specs: 'Camera system, REST API',
    difficulty: 'intermediate',
    package: 'heinsight',
    path: 'heinsight.heinsight_api',
    module: 'HeinsightAPI'
  }
];

export const optimizerOptions = [
  {
    id: 'ax-platform',
    name: 'Ax Platform',
    description: 'Bayesian optimization framework by Meta',
    source: 'Meta AI',
    icon: '🎯',
    github: 'facebook/Ax',
    package: 'ax-platform',
    compatible: ['all']
  },
  {
    id: 'baybe',
    name: 'BayBE',
    description: 'Bayesian back end for experimental design',
    source: 'Merck KGaA',
    icon: '🧬',
    github: 'emdgroup/baybe',
    package: 'baybe',
    compatible: ['all']
  },
  {
    id: 'nimo',
    name: 'NIMO',
    description: 'Neural multi-objective optimization',
    source: 'NIMS',
    icon: '🧠',
    github: 'NIMS/nimo',
    package: 'nimo',
    compatible: ['all']
  }
];