import { useEffect } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { Header } from '@/components/dashboard/Header';
import { Section1 } from '@/components/dashboard/Section1';
import { Section2 } from '@/components/dashboard/Section2';
import { Section3 } from '@/components/dashboard/Section3';
import { Section4 } from '@/components/dashboard/Section4';
import { fetchLiveRates } from '@/lib/currency';

const Index = () => {
  // Fetch live exchange rates on mount
  useEffect(() => {
    fetchLiveRates();
  }, []);
  const {
    inputs,
    outputs,
    updateInput,
    selectedClientType,
    setSelectedClientType,
    currency,
    setCurrency,
  } = useCalculator();

  return (
    <div className="min-h-screen bg-background text-foreground p-5">
      <div id="calculator-content" className="max-w-[1400px] mx-auto bg-background text-foreground">
        <Header 
          currency={currency} 
          onCurrencyChange={setCurrency} 
        />
        
        <Section1 
          inputs={inputs} 
          updateInput={updateInput} 
          currency={currency}
          selectedClientType={selectedClientType}
          setSelectedClientType={setSelectedClientType}
        />
        
        <Section2 
          outputs={outputs}
          currency={currency}
          selectedClientType={selectedClientType}
        />
        
        <Section3 
          inputs={inputs}
          outputs={outputs}
          updateInput={updateInput}
          currency={currency}
        />
        
        <Section4 
          inputs={inputs}
          outputs={outputs}
          currency={currency}
          selectedClientType={selectedClientType}
        />

        <footer className="text-center mt-16 pt-5 border-t-2 border-border text-muted-foreground text-sm">
          <p>Built by Yakruthik AI Consultancy | Data-driven discovery for precision selling</p>
          <p className="mt-2">© 2026 YAK Apps. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
