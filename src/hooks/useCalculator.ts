import { useState, useCallback, useMemo } from 'react';
import { Currency, formatCurrency } from '@/lib/currency';

// Helper function to format currency for disqualification message
const formatCurrencyForDisqualification = (amount: number, currency: Currency): string => {
  const symbols: Record<Currency, string> = { USD: '$', INR: '₹', AED: 'AED ' };
  return `${symbols[currency]}${Math.round(amount).toLocaleString()}`;
};

export type ClientType = 'saas' | 'agency' | 'industrial' | 'consulting' | 'ecommerce' | null;

export interface PricingTier {
  name: string;
  retainer: number;
  ppa: number;
  description: string;
}

export interface PricingRecommendation {
  lite: PricingTier;
  standard: PricingTier;
  aggressive: PricingTier;
  disqualified: boolean;
  disqualificationReason?: string;
}

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
  
  // Pricing Tiers (NEW)
  pricingTiers: PricingRecommendation;
  
  // Legacy pricing (for backwards compatibility)
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
  
  // New metrics
  effectiveTakeRate: number;
  newRevenueGenerated: number;
  budgetHealthStatus: 'safe' | 'warning' | 'none';
  effectiveCAC: number;
}

const defaultInputs: CalculatorInputs = {
  acvMode: 'acv',
  aacv: 0,
  customerLifetime: 0,
  tcv: 0,
  contractTerm: 0,
  newClientTarget: 0,
  sqlsPerWin: 0,
  currentSQLMeetings: 0,
  smBudget: 0,
  customersAcquired: 0,
  currentCAC: 0,
  grr: 0,
  activeCustomers: 0,
  churnRate: 0,
  yourRetainer: 0,
  yourPPA: 0,
};

// --- REVENUE MAXIMIZATION ENGINE CONSTANTS ---
const CURRENCY_RATES = { USD: 1, INR: 92, AED: 3.6725 };

const INDUSTRY_RANGES = {
  saas: { low: 0.075, high: 0.175 },
  agency: { low: 0.05, high: 0.10 },
  industrial: { low: 0.03, high: 0.08 },
  consulting: { low: 0.06, high: 0.12 },
  ecommerce: { low: 0.02, high: 0.06 }
};

const BASE_VELOCITY = {
  saas: 5, agency: 5, consulting: 5, industrial: 2, ecommerce: 20
};

const MATURITY_THRESHOLDS = {
  saas: { startup: 20, mature: 200 },
  agency: { startup: 3, mature: 15 },
  consulting: { startup: 2, mature: 10 },
  industrial: { startup: 1, mature: 8 },
  ecommerce: { startup: 100, mature: 5000 }
};

// Currency Converter Helper
const convert = (amount: number, from: string, to: string) => {
  const inUSD = amount / CURRENCY_RATES[from as keyof typeof CURRENCY_RATES];
  return inUSD * CURRENCY_RATES[to as keyof typeof CURRENCY_RATES];
};

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const [selectedClientType, setSelectedClientType] = useState<ClientType>(null);
  const [currency, setCurrency] = useState<Currency>('INR');

  const updateInput = useCallback(<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const outputs = useMemo((): CalculatorOutputs => {
    // Calculate AACV based on mode - STRICT TAB ISOLATION
    let calculatedAacv = 0;
    let ltv = 0;
    let lifetimeYears = 0;
    
    if (inputs.acvMode === 'acv') {
      // Only use ACV tab values
      calculatedAacv = inputs.aacv || 0;
      lifetimeYears = inputs.customerLifetime || 0;
      ltv = calculatedAacv * (lifetimeYears || 1);
    } else {
      // Only use TCV tab values
      const term = inputs.contractTerm || 0;
      calculatedAacv = term > 0 ? (inputs.tcv || 0) / term : 0;
      lifetimeYears = term;
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
    
    // Annual cost uses Monthly Gap in SQLs, not currentSQLMeetings
    const annualCost = (inputs.yourRetainer * 12) + (inputs.yourPPA * monthlyGap * 12);
    const breakeven = calculatedAacv > 0 ? (annualCost / calculatedAacv).toFixed(2) : '0';
    const servicePercent = calculatedAacv > 0 ? ((annualCost / calculatedAacv) * 100).toFixed(1) : '0';
    
    // Cost per SQL based on monthly gap SQLs provided
    const totalSQLsProvided = monthlyGap * 12;
    const costPerSQL = totalSQLsProvided > 0 ? annualCost / totalSQLsProvided : 0;
    const netRevenue = revenuePotential - annualCost;
    const roi = annualCost > 0 ? (revenuePotential / annualCost).toFixed(1) : '0';

    // New metrics: Effective Take Rate
    const totalAnnualMeetings = totalMeetingsNeeded;
    const newRevenueGenerated = sqlsPerWin > 0 ? (totalAnnualMeetings / sqlsPerWin) * calculatedAacv : 0;
    const effectiveTakeRate = newRevenueGenerated > 0 ? (annualCost / newRevenueGenerated) * 100 : 0;

    // Budget Health Check
    let budgetHealthStatus: 'safe' | 'warning' | 'none' = 'none';
    if (inputs.smBudget > 0) {
      budgetHealthStatus = annualCost > inputs.smBudget * 0.5 ? 'warning' : 'safe';
    }

    // === REVENUE MAXIMIZATION ENGINE ===
    const clientType = selectedClientType || 'saas';
    const ranges = INDUSTRY_RANGES[clientType];
    const velocityBase = BASE_VELOCITY[clientType];

    // 1. Calculate Allowable Retainer (The Anchor)
    let maturityMultiplier = 1.0;
    const activeCust = inputs.activeCustomers || 0;
    const thresholds = MATURITY_THRESHOLDS[clientType];

    if (activeCust > 0) {
      if (activeCust >= thresholds.mature) maturityMultiplier = 1.5;
      else if (activeCust < thresholds.startup) maturityMultiplier = 0.75;
    }

    const adjustedVelocity = Math.max(2, velocityBase * maturityMultiplier);

    // Revenue Potential Multiplier (Upside Logic)
    let revenueMult = 1.0;
    if (revenuePotential > (calculatedAacv * 50)) revenueMult = 1.2;
    else if (revenuePotential > (calculatedAacv * 20)) revenueMult = 1.1;

    // Base Retainer Calculation
    const retainerBaseRaw = (calculatedAacv * adjustedVelocity * ranges.low) / 12;
    const retainerOptimized = retainerBaseRaw * revenueMult;

    // Floor Protection ($1,000 USD converted to selected currency)
    const floor = convert(1000, 'USD', currency);
    const finalRetainerAnchor = Math.max(floor, retainerOptimized);

    // 2. Calculate PPA (The Scale Engine)
    const safeSqlsToWin = Math.max(inputs.sqlsPerWin, 4);
    const maxCostPerMeeting = (calculatedAacv * ranges.high) / safeSqlsToWin;

    // Volume Discount Logic
    const gap = Math.max(0, monthlyGap);
    let volumeDiscount = 1.0;
    if (gap > 100) volumeDiscount = 0.85;
    else if (gap > 50) volumeDiscount = 0.90;

    const ppaBase = (maxCostPerMeeting * 0.35) * volumeDiscount;

    // 3. Competitive & Budget Guardrails with SMART FLOOR
    let ppaAdjusted = ppaBase;

    // Smart Floor for Competitive Pricing
    const minViableCAC = calculatedAacv * 0.05;
    let competitiveCap: number;
    
    if (effectiveCAC > minViableCAC) {
      // Their CAC is realistic, aim to beat it by 10%
      competitiveCap = effectiveCAC * 0.90;
    } else {
      // Their CAC is too low to be real (e.g., ad spend only), use industry minimum
      competitiveCap = minViableCAC;
    }

    // Guard 1: Apply competitive cap
    if (gap > 0) {
      const estimatedCPA = (finalRetainerAnchor / adjustedVelocity) + (ppaBase * safeSqlsToWin);
      const finalCPA = Math.min(estimatedCPA, competitiveCap);
      
      if (estimatedCPA > finalCPA) {
        const ratio = finalCPA / estimatedCPA;
        ppaAdjusted = ppaBase * ratio;
      }
    }

    // Guard 2: S&M Budget Cap (Soft cap at 50% of budget)
    if (inputs.smBudget > 0 && gap > 0) {
      const projectedAnnualCost = (finalRetainerAnchor * 12) + (ppaAdjusted * gap * 12);
      if (projectedAnnualCost > (inputs.smBudget * 0.5)) {
        const ratio = (inputs.smBudget * 0.5) / projectedAnnualCost;
        ppaAdjusted = ppaAdjusted * ratio;
      }
    }

    // 4. GENERATE 3 TIERS
    const targetMonthlyRevenue = finalRetainerAnchor + (ppaAdjusted * gap);

    // Tier 1: Aggressive (High Retainer, Low PPA)
    const aggRetainer = targetMonthlyRevenue * 0.70;
    const aggPPA = gap > 0 ? (targetMonthlyRevenue * 0.30) / gap : 0;

    // Tier 2: Standard (Balanced)
    const stdRetainer = targetMonthlyRevenue * 0.50;
    const stdPPA = gap > 0 ? (targetMonthlyRevenue * 0.50) / gap : 0;

    // Tier 3: Lite (Low Retainer, High PPA)
    const liteRetainer = Math.max(floor, targetMonthlyRevenue * 0.30);
    const litePPA = gap > 0 ? (targetMonthlyRevenue - liteRetainer) / gap : 0;

    // Calculate minimum AACV required for disqualification message
    const minAacvRequired = (floor * 12) / (adjustedVelocity * ranges.low);
    
    const pricingTiers: PricingRecommendation = {
      disqualified: retainerBaseRaw < floor,
      disqualificationReason: retainerBaseRaw < floor 
        ? `AACV too low for minimum service level. Min AACV required = ${formatCurrencyForDisqualification(minAacvRequired, currency)}` 
        : undefined,
      aggressive: {
        name: "Enterprise / Scale",
        retainer: Math.round(aggRetainer),
        ppa: Math.round(aggPPA),
        description: "Highest stability, lowest cost-per-meeting. Best for high volume."
      },
      standard: {
        name: "Growth (Recommended)",
        retainer: Math.round(stdRetainer),
        ppa: Math.round(stdPPA),
        description: "Balanced risk/reward. The standard engagement model."
      },
      lite: {
        name: "Performance Starter",
        retainer: Math.round(liteRetainer),
        ppa: Math.round(litePPA),
        description: "Lowest upfront commitment, higher performance fee."
      }
    };

    // Legacy pricing (backwards compatibility)
    const retainerLow = pricingTiers.lite.retainer;
    const retainerHigh = pricingTiers.aggressive.retainer;
    const ppaLow = pricingTiers.aggressive.ppa;
    const ppaHigh = pricingTiers.lite.ppa;

    return {
      calculatedAacv,
      ltv,
      calculatedCAC: effectiveCAC,
      effectiveCAC,
      cacPercent,
      ltvCacRatio,
      valuePerMeeting,
      totalMeetingsNeeded,
      monthlyGap,
      churnRevenue,
      revenuePotential,
      grrRequired,
      pricingTiers,
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
      effectiveTakeRate,
      newRevenueGenerated,
      budgetHealthStatus,
    };
  }, [inputs, selectedClientType, currency]);

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
