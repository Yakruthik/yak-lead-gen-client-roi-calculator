import { useState, useCallback, useMemo } from 'react';
import { Currency, formatCurrency } from '@/lib/currency';

export type ClientType = 'saas' | 'agency' | 'industrial' | 'consulting' | 'ecommerce' | null;

export interface CalculatorInputs {
  // Contract Value - AACV approach
  aacv: number;
  customerLifetime: number;
  // Contract Value - TCV approach
  tcv: number;
  contractDuration: number;
  
  // Growth & Pipeline
  newClientTarget: number;
  sqlsPerWin: number;
  currentSQLMeetings: number;
  smBudget: number;
  
  // Acquisition
  customersAcquired: number;
  currentCAC: number;
  
  // Retention
  activeCustomers: number;
  churnRate: number;
  
  // ROI Simulator
  hypotheticalBudget: number;
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
  
  // ROI Simulator outputs
  projectedAnnualInvestment: number;
  breakevenDeals: string;
  costOfNewRevenue: number;
  costPerSQL: number;
  netRevenue: number;
  roiRatio: string;
}

const defaultInputs: CalculatorInputs = {
  aacv: 0,
  customerLifetime: 0,
  tcv: 0,
  contractDuration: 0,
  newClientTarget: 0,
  sqlsPerWin: 0,
  currentSQLMeetings: 0,
  smBudget: 0,
  customersAcquired: 0,
  currentCAC: 0,
  activeCustomers: 0,
  churnRate: 0,
  hypotheticalBudget: 0,
};

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [selectedClientType, setSelectedClientType] = useState<ClientType>(null);
  const [currency, setCurrency] = useState<Currency>('INR');

  const updateInput = useCallback(<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const outputs = useMemo((): CalculatorOutputs => {
    // Calculate core values - support both AACV and TCV approaches
    let calculatedAacv = inputs.aacv || 0;
    let lifetimeYears = inputs.customerLifetime || 0;
    
    // If TCV approach is used, derive AACV and lifetime from it
    if (inputs.tcv > 0 && inputs.contractDuration > 0) {
      calculatedAacv = inputs.tcv / inputs.contractDuration;
      lifetimeYears = inputs.contractDuration;
    }
    
    const ltv = calculatedAacv * (lifetimeYears || 1);

    // Pipeline calculations
    const sqlsPerWin = inputs.sqlsPerWin || 1;
    const currentSQLMeetings = inputs.currentSQLMeetings || 0;
    const customersAcquired = inputs.customersAcquired || 1;
    const churnRate = inputs.churnRate || 0;
    const activeCustomers = inputs.activeCustomers || 0;
    
    const valuePerMeeting = sqlsPerWin > 0 ? calculatedAacv / sqlsPerWin : 0;
    const churnedClients = (activeCustomers * churnRate / 100) || 0;
    const churnRevenue = churnedClients * calculatedAacv;
    const totalMeetingsNeeded = (inputs.newClientTarget * sqlsPerWin) + (churnedClients * sqlsPerWin);
    const monthlyGap = Math.max(0, (totalMeetingsNeeded / 12) - currentSQLMeetings);
    const revenuePotential = inputs.newClientTarget * calculatedAacv;
    
    // CAC calculations
    const calculatedCAC = inputs.currentCAC > 0 
      ? inputs.currentCAC 
      : (customersAcquired > 0 ? inputs.smBudget / customersAcquired : 0);
    const cacPercent = calculatedAacv > 0 ? (calculatedCAC / calculatedAacv * 100) : 0;
    const ltvCacRatio = calculatedCAC > 0 ? (ltv / calculatedCAC).toFixed(1) : '—';

    // ROI Simulator calculations
    const hypotheticalBudget = inputs.hypotheticalBudget || 0;
    const projectedAnnualInvestment = hypotheticalBudget * 12;
    const breakevenDeals = calculatedAacv > 0 ? (projectedAnnualInvestment / calculatedAacv).toFixed(2) : '0';
    const costOfNewRevenue = revenuePotential > 0 ? (projectedAnnualInvestment / revenuePotential) * 100 : 0;
    const costPerSQL = monthlyGap > 0 ? hypotheticalBudget / monthlyGap : 0;
    const netRevenue = revenuePotential - projectedAnnualInvestment;
    const roiRatio = projectedAnnualInvestment > 0 ? (revenuePotential / projectedAnnualInvestment).toFixed(1) : '0';

    return {
      calculatedAacv,
      ltv,
      calculatedCAC,
      cacPercent,
      ltvCacRatio,
      valuePerMeeting,
      totalMeetingsNeeded,
      monthlyGap,
      churnRevenue,
      revenuePotential,
      projectedAnnualInvestment,
      breakevenDeals,
      costOfNewRevenue,
      costPerSQL,
      netRevenue,
      roiRatio,
    };
  }, [inputs]);

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
