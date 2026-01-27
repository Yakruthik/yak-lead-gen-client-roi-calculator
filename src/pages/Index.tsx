import { useCalculator } from '@/hooks/useCalculator';
import { Header } from '@/components/dashboard/Header';
import { Section1 } from '@/components/dashboard/Section1';
import { Section2 } from '@/components/dashboard/Section2';
import { Section3 } from '@/components/dashboard/Section3';
import { Section4 } from '@/components/dashboard/Section4';

const Index = () => {
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
      <div id="calculator-content" className="max-w-[1400px] mx-auto">
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
          <p>Built by YAK AI Consulting | Data-driven discovery for precision selling</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
