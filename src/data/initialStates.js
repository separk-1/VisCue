// src/data/initialStates.js
export const initialStateA = {
    'Block Valve': 'OFF',
    'Safety Valve': 'ON',
    'Pressure Valve': 'OFF',
    'Condensate Pump': 'OFF',
    'Main Feedwater Pump': 'ON',
    'Circulating Water Pump': 'OFF',
    'Generator': 'ON',
    'Turbine': 'ON',
    'Transformer': 'OFF',
    'Relief Valve 3698': 'OFF',
    'Relief Valve 3699': 'OFF',
    'Relief Valve 3700': 'ON',
    'Relief Valve 3671': 'OFF',
    'Relief Valve 3672': 'ON',
    'Relief Valve 3673': 'OFF'
  }
  
  export const initialStateB = {
    'Block Valve': 'ON',
    'Safety Valve': 'OFF',
    'Pressure Valve': 'ON',
    'Condensate Pump': 'ON',
    'Main Feedwater Pump': 'OFF',
    'Circulating Water Pump': 'ON',
    'Generator': 'OFF',
    'Turbine': 'OFF',
    'Transformer': 'ON',
    'Relief Valve 3698': 'ON',
    'Relief Valve 3699': 'ON',
    'Relief Valve 3700': 'OFF',
    'Relief Valve 3671': 'ON',
    'Relief Valve 3672': 'OFF',
    'Relief Valve 3673': 'ON'
  }
  
  export const initialSets = {
    'Set A': initialStateA,
    'Set B': initialStateB
  }
  