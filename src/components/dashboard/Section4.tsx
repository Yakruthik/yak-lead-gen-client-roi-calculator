import { CalculatorInputs, CalculatorOutputs, ClientType } from '@/hooks/useCalculator';
import { Currency, formatCurrency } from '@/lib/currency';
interface Section4Props {
  inputs: CalculatorInputs;
  outputs: CalculatorOutputs;
  currency: Currency;
  selectedClientType: ClientType;
}
export function Section4({
  inputs,
  outputs,
  currency,
  selectedClientType
}: Section4Props) {
  const handleDownloadPDF = async () => {
    // Dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('calculator-content');
    if (!element) return;
    const opt = {
      margin: 0.5,
      filename: 'YAK-Lead-Gen-ROI-Report.pdf',
      image: {
        type: 'jpeg' as const,
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: {
        unit: 'in' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const
      }
    };
    html2pdf().set(opt).from(element).save();
  };
  return <section className="mb-10">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary">
        <span className="text-3xl">🚀</span>
        <h2 className="text-2xl font-bold text-primary">Take Action</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8">
        {/* CTA Button - Book a Strategy Call */}
        <a href="https://calendar.app.google/F4kwMLG2TjFA5WwJA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-destructive text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 bg-primary">
          🚀 Book a Strategy Call to Fix This Gap
        </a>

        {/* Download Report Button */}
        <button onClick={handleDownloadPDF} className="inline-flex items-center gap-3 border-2 border-secondary text-secondary px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all hover:bg-secondary hover:text-secondary-foreground hover:scale-105">
          📥 Download Report as PDF
        </button>
      </div>
    </section>;
}