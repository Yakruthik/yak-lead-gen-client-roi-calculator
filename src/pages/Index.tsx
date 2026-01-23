import { useCalculator } from '@/hooks/useCalculator';
import { Header } from '@/components/dashboard/Header';
import { Section1 } from '@/components/dashboard/Section1';
import { Section2 } from '@/components/dashboard/Section2';
import { Section3 } from '@/components/dashboard/Section3';

const Index = () => {
  const {
    inputs,
    outputs,
    updateInput,
    selectedClientType,
    setSelectedClientType,
    currency,
    setCurrency,
    resetAll,
  } = useCalculator();

  return (
    <div className="min-h-screen bg-background text-foreground p-5">
      <div className="max-w-[1400px] mx-auto">
        <Header 
          currency={currency} 
          onCurrencyChange={setCurrency} 
        />
        
        <Section1 
          inputs={inputs} 
          updateInput={updateInput} 
          currency={currency}
          grrRequired={outputs.grrRequired}
        />
        
        <Section2 
          inputs={inputs}
          outputs={outputs}
          updateInput={updateInput}
          currency={currency}
          selectedClientType={selectedClientType}
          setSelectedClientType={setSelectedClientType}
        />
        
        <Section3 
          inputs={inputs}
          outputs={outputs}
          currency={currency}
          selectedClientType={selectedClientType}
          onReset={resetAll}
        />

        <footer className="text-center mt-16 pt-5 border-t-2 border-border text-muted-foreground text-sm">
          <p>Built by YAK AI Consulting | Data-driven discovery for precision selling</p>
          <p className="mt-2 text-xs">© 2026 YAK Apps. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
