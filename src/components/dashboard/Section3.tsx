import { useState } from 'react';
import { CalculatorOutputs, CalculatorInputs, ClientType } from '@/hooks/useCalculator';
import { Currency, formatCurrency } from '@/lib/currency';

interface Section3Props {
  inputs: CalculatorInputs;
  outputs: CalculatorOutputs;
  currency: Currency;
  selectedClientType: ClientType;
  onReset: () => void;
}

interface ScriptProps {
  title: string;
  icon: string;
  content: string;
}

// Client type configuration with LTV on CAC ranges - matching client type selection ranges
const clientTypeConfig: Record<string, { label: string; ltvOnCacRange: string; ltvOnCacMax: number; cacRange: string }> = {
  saas: { label: 'B2B SaaS', ltvOnCacRange: '30-40%', ltvOnCacMax: 0.40, cacRange: '7.5-17.5%' },
  agency: { label: 'B2B Service/Agency', ltvOnCacRange: '20-30%', ltvOnCacMax: 0.30, cacRange: '5-10%' },
  industrial: { label: 'Industrial/Manufacturing', ltvOnCacRange: '15-25%', ltvOnCacMax: 0.25, cacRange: '3-8%' },
  consulting: { label: 'Consulting/Prof Services', ltvOnCacRange: '25-35%', ltvOnCacMax: 0.35, cacRange: '6-12%' },
  ecommerce: { label: 'E-commerce/DTC', ltvOnCacRange: '10-20%', ltvOnCacMax: 0.20, cacRange: '2-6%' },
};

function ScriptItem({ title, icon, content }: ScriptProps) {
  const [copied, setCopied] = useState(false);

  const copyScript = () => {
    // Remove HTML tags for plain text copy
    const plainText = content.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-background p-5 rounded-lg mb-5 border-l-4 border-l-secondary">
      <div className="text-base font-bold text-primary mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
      </div>
      <div 
        className="bg-card p-4 rounded-md text-sm leading-relaxed text-muted-foreground mb-3 italic"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <button
        onClick={copyScript}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md font-semibold text-sm cursor-pointer transition-all hover:bg-primary/80 hover:-translate-y-0.5 hover:shadow-lg"
      >
        📋 {copied ? 'Copied!' : 'Copy Script'}
      </button>
    </div>
  );
}

export function Section3({ inputs, outputs, currency, selectedClientType, onReset }: Section3Props) {
  const fmt = (v: number) => formatCurrency(v, currency);
  const highlight = (text: string) => `<strong class="text-primary">${text}</strong>`;
  const dynamicHighlight = (text: string) => `<strong class="text-destructive">${text}</strong>`;

  // Get client type config (default to saas if none selected)
  const typeConfig = clientTypeConfig[selectedClientType || 'saas'];
  const ltvBudgetMax = outputs.ltv * typeConfig.ltvOnCacMax;

  // Script 1: ROI Breakeven (Best for CFOs & Finance-Focused Buyers)
  const script1 = `Your average deal is ${highlight(fmt(outputs.calculatedAacv))}. My annual cost is ${highlight(fmt(outputs.annualCost))}. So mathematically, you break even after closing just ${highlight(outputs.breakeven + ' deals')} with the leads I generate. Every deal after deal number ${outputs.breakeven} is pure profit for you. Given that you're targeting ${highlight(inputs.newClientTarget + ' new clients')} annually, this investment pays for itself by Month 3 at your current conversion rate.`;

  // Script 2: Growth Ceiling (Best for Ambitious CEOs/Founders)
  const revPot = outputs.monthlyGap * 12 * outputs.valuePerMeeting;
  const roiRatio = outputs.annualCost > 0 ? (revPot / outputs.annualCost).toFixed(1) : '0';
  const script2 = `Here's what I'm seeing: You want to hit ${highlight(inputs.newClientTarget + ' new clients')} this year, but your current meeting volume falls short by ${highlight(outputs.monthlyGap.toFixed(1) + ' qualified SQL meetings per month')}. That gap is a hard ceiling on your growth. You can't close what you're not talking to. Right now, you're leaving ${highlight(fmt(revPot))} in annual revenue on the table just because the pipeline isn't full enough. For ${highlight(fmt(outputs.annualCost))} annually, I close that gap and unlock that revenue potential. That's a ${roiRatio}:1 ROI after my cost—you're profitable in Month 3.`;

  // Script 3: Churn Replacement (Best for Established Companies with Retention Pressure)
  const churnedClients = (inputs.activeCustomers * inputs.churnRate / 100) || 0;
  const script3 = `Based on what you shared: You've got ${highlight(inputs.activeCustomers + ' active clients')} at ${highlight(fmt(outputs.calculatedAacv))} each. With ${highlight(inputs.churnRate + '% annual churn')}, you're losing about ${highlight(fmt(outputs.churnRevenue))} in recurring revenue annually—and that's just to stay flat. To hit your growth target of ${highlight(inputs.newClientTarget + ' new clients')}, you need to fill the churn gap AND add new revenue. That means you need roughly ${highlight(Math.round(outputs.totalMeetingsNeeded) + ' SQL meetings this year')}. You're currently ${highlight(outputs.monthlyGap.toFixed(1) + ' meetings per month')} short. What we do is fill that gap. Every meeting we book is worth ${highlight(fmt(outputs.valuePerMeeting))} in potential revenue. Add that up over a year, minus my cost, and you're building a sustainable growth engine instead of just replacing churn.`;

  // Script 4: Pipeline Pressure (Best for Founders/Sales Reps in Trenches)
  const script4 = `Here's the reality: You need ${highlight(inputs.newClientTarget + ' new clients')} at ${highlight(fmt(outputs.calculatedAacv))} each. Your pipeline is ${highlight(outputs.monthlyGap.toFixed(1) + ' SQL meetings per month')} short of what you need to hit that target. That's the problem. Your close rate is locked in. Your deal size is locked in. What's NOT locked in is your pipeline. For ${highlight(fmt(outputs.annualCost))} annually, I solve that one variable. You hit your target. That's the deal.`;

  // Script 5: The LTV Math Angle (Best for Data-Driven Buyers) - Dynamic based on client type
  const script5 = `Here's the math that matters for scaling: your LTV is ${highlight(fmt(outputs.ltv))}. That's your AACV of ${highlight(fmt(outputs.calculatedAacv))} multiplied by your average client lifespan of <span class="inline-block bg-secondary/20 px-2 py-0.5 rounded border border-secondary text-secondary font-semibold">${inputs.customerLifetime} years</span>. That's your revenue ceiling per client.

Against that, you can afford to spend up to ${dynamicHighlight(typeConfig.ltvOnCacRange)} of LTV on CAC and still be healthy long-term. That gives you a budget of roughly ${dynamicHighlight(fmt(ltvBudgetMax))} per client to acquire them.

My investment of ${highlight(fmt(outputs.costPerSQL))} per qualified meeting is well within that ceiling. And since you need to speak with ${highlight(inputs.sqlsPerWin.toString())} qualified leads to find just one buyer, my total CAC per client through my service is efficient. This is how you scale without burning out your S&M team.`;

  // Script 6: CAC Efficiency (Best for CFOs/Finance Buyers) - Dynamic based on client type
  const cacMaxPercent = parseFloat(typeConfig.cacRange.split('-')[1]);
  const isHealthy = outputs.cacPercent <= cacMaxPercent;
  const benefitStatement = isHealthy 
    ? "You have the margin to scale aggressively with precision."
    : "You need to stop the bleeding by shifting to higher-quality, lower-waste channels.";
  
  const script6 = `Let me frame this as a CAC optimization play. Right now, your CAC is ${highlight(outputs.cacPercent.toFixed(1) + '%')} of AACV. ${dynamicHighlight('Industry standard for ' + typeConfig.label + ' is ' + typeConfig.cacRange + ' of AACV.')} You're at ${highlight(outputs.cacPercent.toFixed(1) + '%')}. Since you're ${isHealthy ? 'below' : 'above'} that ${cacMaxPercent}% ceiling, ${benefitStatement}

The math here is simple: instead of spending money on broad campaigns that generate low-quality volume, you're investing ${highlight(fmt(outputs.annualCost))} annually in qualified leads that match your ICP. We reduce your CAC waste and improve your close rate because you're not chasing tire-kickers.

Your LTV is ${highlight(fmt(outputs.ltv))}—that means you have significant runway to invest in customer acquisition while staying profitable. We're essentially saying: let's shift budget from broad-based CAC into precision CAC. Better spend, better returns, predictable pipeline.`;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary">
        <span className="text-3xl">🎬</span>
        <h2 className="text-2xl font-bold text-primary">Section 3: Sales Scripts (Pick One Based On Your Client)</h2>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-5 border-l-4 border-l-secondary">
        <strong className="text-secondary">Pick ONE script matching your client's personality.</strong>{' '}
        <span className="text-muted-foreground">Copy, memorize the flow, and deliver naturally with confidence.</span>
      </div>

      <div className="bg-card border-2 border-border rounded-xl p-6">
        <ScriptItem
          icon="🎯"
          title="Script 1: ROI Breakeven (Best for CFOs & Finance-Focused Buyers)"
          content={script1}
        />
        
        <ScriptItem
          icon="📈"
          title="Script 2: Growth Ceiling (Best for Ambitious CEOs/Founders)"
          content={script2}
        />
        
        <ScriptItem
          icon="⚠️"
          title="Script 3: Churn Replacement (Best for Established Companies with Retention Pressure)"
          content={script3}
        />
        
        <ScriptItem
          icon="⚡"
          title="Script 4: Pipeline Pressure (Best for Founders/Sales Reps in Trenches)"
          content={script4}
        />
        
        <ScriptItem
          icon="📊"
          title="Script 5: The LTV Math Angle (Best for Data-Driven Buyers)"
          content={script5}
        />
        
        <ScriptItem
          icon="💼"
          title="Script 6: CAC Efficiency (Best for CFOs/Finance Buyers)"
          content={script6}
        />
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-secondary/80 hover:-translate-y-0.5 hover:shadow-lg"
        >
          🔄 Reset All Fields
        </button>
      </div>
    </section>
  );
}
