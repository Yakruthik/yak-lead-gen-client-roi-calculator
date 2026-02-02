import { useState } from 'react';
import { CalculatorInputs, CalculatorOutputs, ClientType } from '@/hooks/useCalculator';
import { Currency } from '@/lib/currency';
import { LeadCaptureModal } from './LeadCaptureModal';

interface Section4Props {
  inputs: CalculatorInputs;
  outputs: CalculatorOutputs;
  currency: Currency;
  selectedClientType: ClientType;
  onReset?: () => void;
}

export function Section4({
  inputs,
  outputs,
  currency,
  selectedClientType,
  onReset
}: Section4Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'pdf' | 'booking'>('pdf');

  const handleDownloadClick = () => {
    setModalMode('pdf');
    setModalOpen(true);
  };

  const handleBookingClick = () => {
    setModalMode('booking');
    setModalOpen(true);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  return (
    <section className="mb-10" data-section="take-action">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary">
        <span className="text-3xl">🚀</span>
        <h2 className="text-2xl font-bold text-primary">Take Action</h2>
      </div>

      <div className="flex flex-col items-center py-8">
        {/* Primary CTA - Book a Strategy Call */}
        <button
          onClick={handleBookingClick}
          className="inline-flex items-center gap-3 bg-destructive text-destructive-foreground px-10 py-5 rounded-lg font-bold text-xl cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-destructive/30 mb-6"
        >
          🚀 Book a Strategy Call to Fix This Gap
        </button>

        {/* Description */}
        <p className="text-muted-foreground text-center mb-6 max-w-xl">
          Schedule a free consultation to discuss how we can help close your pipeline gap and accelerate your growth.
        </p>

        {/* Secondary Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleDownloadClick}
            className="inline-flex items-center gap-2 border-2 border-secondary text-secondary px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-secondary hover:text-secondary-foreground hover:scale-105"
          >
            📄 Download Report as PDF
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 border-2 border-secondary text-secondary px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-secondary hover:text-secondary-foreground hover:scale-105"
          >
            🔄 Reset Calculator
          </button>
        </div>
      </div>

      <LeadCaptureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        inputs={inputs}
        outputs={outputs}
        currency={currency}
        selectedClientType={selectedClientType}
        onSuccess={() => {}}
      />
    </section>
  );
}
