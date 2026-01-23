import { useState, useCallback, useMemo } from 'react';
import { Currency } from '@/lib/currency';

export type ClientType = 'saas' | 'agency' | 'industrial' | 'consulting' | 'ecommerce' | null;

export interface CalculatorInputs {
  // ACV Mode
  acvMode: 'acv' | 'tcv';
  aacv: number;
  customerLifetime: number;
  tcv: number;
  contractTerm: number;
  
  // Growth & Pipeline
  newClientTarget: number;
  sqlsPerWin: number;
  currentSQLMeetings: number;
  smBudget: number;
  
  // Acquisition
  customersAcquired: number;
  currentCAC: number;
  
  // Retention
  grr: number;
  activeCustomers: number;
  churnRate: number;
  
  // Pricing
  yourRetainer: number;
  yourPPA: number;
}

export interface CalculatorOutputs {
  // Core metrics
  calculatedAacv: number;
  ltv: number;
  calculatedCAC: number;
  cacPercent: number;
  ltvCacRatio: string;
  valuePerMeeting: number;
  
  // Pipeline
  totalMeetingsNeeded: number;
  monthlyGap: number;
  churnRevenue: number;
  revenuePotential: number;
  
  // GRR Required
  grrRequired: number;
  
  // Pricing
  retainerLow: number;
  retainerHigh: number;
  ppaLow: number;
  ppaHigh: number;
  
  // Your service
  annualCost: number;
  breakeven: string;
  servicePercent: string;
  costPerSQL: number;
  netRevenue: number;
  roi: string;
}

const defaultInputs: CalculatorInputs = {
  acvMode: 'acv',
  aacv: 0,
  customerLifetime: 1,
  tcv: 0,
  contractTerm: 1,
  newClientTarget: 0,
  sqlsPerWin: 1,
  currentSQLMeetings: 0,
  smBudget: 0,
  customersAcquired: 1,
  currentCAC: 0,
  grr: 90,
  activeCustomers: 0,
  churnRate: 10,
  yourRetainer: 0,
  yourPPA: 0,
};

function getPricingRange(clientType: ClientType, aacv: number) {
  const ranges = {
    saas: { low: 0.075, high: 0.175 },
    agency: { low: 0.05, high: 0.10 },
    industrial: { low: 0.03, high: 0.08 },
    consulting: { low: 0.06, high: 0.12 },
    ecommerce: { low: 0.02, high: 0.06 }
  };
  const range = ranges[clientType || 'saas'];
  return { low: aacv * range.low, high: aacv * range.high };
}

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [selectedClientType, setSelectedClientType] = useState<ClientType>(null);
  const [currency, setCurrency] = useState<Currency>('INR');

  const updateInput = useCallback(<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const outputs = useMemo((): CalculatorOutputs => {
    // Calculate AACV based on mode
    let calculatedAacv = 0;
    let ltv = 0;
    
    if (inputs.acvMode === 'acv') {
      calculatedAacv = inputs.aacv || 0;
      const lifetime = inputs.customerLifetime || 1;
      ltv = calculatedAacv * lifetime;
    } else {
      const term = inputs.contractTerm || 1;
      calculatedAacv = term > 0 ? (inputs.tcv || 0) / term : 0;
      ltv = inputs.tcv || 0;
    }

    // All calculations
    const sqlsPerWin = inputs.sqlsPerWin || 1;
    const currentSQLMeetings = inputs.currentSQLMeetings || 0;
    const customersAcquired = inputs.customersAcquired || 1;
    const currentCAC = inputs.currentCAC || (customersAcquired > 0 ? inputs.smBudget / customersAcquired : 0);
    const churnRate = inputs.churnRate || 0;
    const activeCustomers = inputs.activeCustomers || 0;
    
    const valuePerMeeting = sqlsPerWin > 0 ? calculatedAacv / sqlsPerWin : 0;
    const churnedClients = (activeCustomers * churnRate / 100) || 0;
    const churnRevenue = churnedClients * calculatedAacv;
    const totalMeetingsNeeded = (inputs.newClientTarget * sqlsPerWin) + (churnedClients * sqlsPerWin);
    const currentAnnualSQLs = currentSQLMeetings * 12;
    const monthlyGap = Math.max(0, (totalMeetingsNeeded / 12) - currentSQLMeetings);
    const revenuePotential = monthlyGap * 12 * valuePerMeeting;
    
    const calculatedCAC = customersAcquired > 0 ? inputs.smBudget / customersAcquired : 0;
    const effectiveCAC = currentCAC > 0 ? currentCAC : calculatedCAC;
    const cacPercent = calculatedAacv > 0 ? (effectiveCAC / calculatedAacv * 100) : 0;
    const ltvCacRatio = effectiveCAC > 0 ? (ltv / effectiveCAC).toFixed(1) : '—';
    
    // GRR Required calculation (from v5)
    const grrRequired = inputs.customerLifetime > 0 ? 100 - (100 / inputs.customerLifetime) : 0;
    
    const annualCost = (inputs.yourRetainer * 12) + (inputs.yourPPA * currentAnnualSQLs);
    const breakeven = calculatedAacv > 0 ? (annualCost / calculatedAacv).toFixed(2) : '0';
    const servicePercent = calculatedAacv > 0 ? ((annualCost / calculatedAacv) * 100).toFixed(1) : '0';
    const costPerSQL = currentAnnualSQLs > 0 ? annualCost / currentAnnualSQLs : 0;
    const netRevenue = revenuePotential - annualCost;
    const roi = annualCost > 0 ? (revenuePotential / annualCost).toFixed(1) : '0';

    // Pricing recommendations
    const pricing = getPricingRange(selectedClientType, calculatedAacv);
    const retainerLow = (pricing.low * 0.65) / 12;
    const retainerHigh = (pricing.high * 0.65) / 12;
    const ppaLow = (pricing.low * 0.35) / 30;
    const ppaHigh = (pricing.high * 0.35) / 30;

    return {
      calculatedAacv,
      ltv,
      calculatedCAC: effectiveCAC,
      cacPercent,
      ltvCacRatio,
      valuePerMeeting,
      totalMeetingsNeeded,
      monthlyGap,
      churnRevenue,
      revenuePotential,
      grrRequired,
      retainerLow,
      retainerHigh,
      ppaLow,
      ppaHigh,
      annualCost,
      breakeven,
      servicePercent,
      costPerSQL,
      netRevenue,
      roi,
    };
  }, [inputs, selectedClientType]);

  const resetAll = useCallback(() => {
    setInputs(defaultInputs);
    setSelectedClientType(null);
  }, []);

  return {
    inputs,
    outputs,
    updateInput,
    selectedClientType,
    setSelectedClientType,
    currency,
    setCurrency,
    resetAll,
  };
}
