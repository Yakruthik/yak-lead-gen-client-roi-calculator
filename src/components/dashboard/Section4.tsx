import { useState } from 'react';
import { CalculatorInputs, CalculatorOutputs, ClientType } from '@/hooks/useCalculator';
import { Currency } from '@/lib/currency';
import { LeadCaptureModal } from './LeadCaptureModal';

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

  return (
    <section className="mb-10" data-section="take-action">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary">
        <span className="text-3xl">🚀</span>
        <h2 className="text-2xl font-bold text-primary">Take Action</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8">
        {/* CTA Button - Book a Strategy Call */}
        <button
          onClick={handleBookingClick}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-destructive text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
        >
          🚀 Book a Strategy Call to Fix This Gap
        </button>

        {/* Download Report Button */}
        <button
          onClick={handleDownloadClick}
          className="inline-flex items-center gap-3 border-2 border-secondary text-secondary px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all hover:bg-secondary hover:text-secondary-foreground hover:scale-105"
        >
          📥 Download Report as PDF
        </button>
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
