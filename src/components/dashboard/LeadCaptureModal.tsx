import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CalculatorInputs, CalculatorOutputs, ClientType } from '@/hooks/useCalculator';
import { Currency, rates, formatCurrency } from '@/lib/currency';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'pdf' | 'booking';
  inputs: CalculatorInputs;
  outputs: CalculatorOutputs;
  currency: Currency;
  selectedClientType: ClientType;
  onSuccess: () => void;
}

const WEBHOOK_URL = 'https://hook.eu2.make.com/5iyi5lkvyxb3sixcpahg8wfgkafxj117';
const BOOKING_URL = 'https://calendar.app.google/ZyEP6mjh984WXLcX8';

const businessModelLabels: Record<NonNullable<ClientType>, string> = {
  saas: 'B2B SaaS',
  agency: 'Agency',
  industrial: 'Industrial / Manufacturing',
  consulting: 'Consulting / Prof Services',
  ecommerce: 'E-commerce / DTC',
};

export function LeadCaptureModal({
  isOpen,
  onClose,
  mode,
  inputs,
  outputs,
  currency,
  selectedClientType,
  onSuccess,
}: LeadCaptureModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    // Block gmail and other personal email domains
    const blockedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const domain = email.toLowerCase().split('@')[1];
    return !blockedDomains.includes(domain);
  };

  const validateForm = (): boolean => {
    const newErrors = { name: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please use a work email (not Gmail, Yahoo, etc.)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const buildPayload = (reportLink: string | null) => {
    return {
      action: mode === 'pdf' ? 'download_report' : 'book_call',
      timestamp: new Date().toISOString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim() || null,
      report_link: reportLink || 'Upload Failed',
      currency: currency,
      business_model: selectedClientType ? businessModelLabels[selectedClientType] : null,
      aacv: inputs.aacv,
      client_lifetime_years: inputs.customerLifetime,
      tcv: inputs.aacv * inputs.customerLifetime,
      contract_duration: inputs.customerLifetime,
      new_clients_target: inputs.newClientTarget,
      sqls_to_win_ratio: inputs.sqlsPerWin,
      current_sql_meetings_per_month: inputs.currentSQLMeetings,
      current_annual_sm_spend: inputs.smBudget,
      customers_acquired_last_year: inputs.customersAcquired,
      current_cac: inputs.currentCAC,
      active_clients: inputs.activeCustomers,
      annual_client_churn_rate: inputs.churnRate,
      calculated_aacv: outputs.calculatedAacv,
      calculated_ltv: outputs.ltv,
      current_annual_cac: outputs.calculatedCAC,
      calculated_cac_percentage: outputs.cacPercent,
      calculated_ltv_cac_ratio: parseFloat(outputs.ltvCacRatio) || 0,
      pipeline_value_per_meeting: outputs.valuePerMeeting,
      total_annual_meetings_needed: outputs.totalMeetingsNeeded,
      monthly_gap_sqls: outputs.monthlyGap,
      churn_revenue_loss_annual: outputs.churnRevenue,
      revenue_potential: outputs.revenuePotential,
      hypothetical_monthly_budget: inputs.hypotheticalBudget,
      projected_annual_investment: outputs.projectedAnnualInvestment,
      breakeven_deals: parseFloat(outputs.breakevenDeals) || 0,
      cost_of_new_revenue_percentage: outputs.costOfNewRevenue,
      cost_per_sql: outputs.costPerSQL,
      net_revenue_after_investment: outputs.netRevenue,
      roi_ratio: parseFloat(outputs.roiRatio) || 0,
    };
  };

  const generatePdfAndUpload = async (): Promise<{ success: boolean; reportLink: string | null }> => {
    const element = document.getElementById('calculator-content');
    if (!element) {
      console.error('Calculator content not found');
      return { success: false, reportLink: null };
    }

    // Hide action section for PDF
    const actionSection = element.querySelector('[data-section="take-action"]') as HTMLElement;
    if (actionSection) actionSection.style.display = 'none';

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Calculate exact dimensions for single-page PDF
      const totalHeight = element.scrollHeight + 50;
      const totalWidth = element.offsetWidth;

      const filename = 'YAK AI-SDR Lead Gen - Client ROI Calculator.pdf';

      const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#0f172a',
        },
        jsPDF: {
          unit: 'px' as const,
          format: [totalWidth, totalHeight] as [number, number],
          orientation: 'portrait' as const,
        },
      };

      const worker = html2pdf().set(opt).from(element);
      
      // 1. Instant user download
      worker.save();

      // 2. Background upload to tmpfiles.org
      let reportLink: string | null = null;
      
      try {
        const pdfBlob = await worker.output('blob');
        const uploadData = new FormData();
        uploadData.append('file', pdfBlob, filename);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const res = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: uploadData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          // Convert to direct download link and force HTTPS
          reportLink = json.data.url
            .replace('http://', 'https://')
            .replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        }
      } catch (uploadError) {
        console.error('PDF upload failed:', uploadError);
        // Non-blocking - continue with webhook even if upload fails
      }

      return { success: true, reportLink };
    } catch (error) {
      console.error('PDF generation error:', error);
      return { success: false, reportLink: null };
    } finally {
      // Restore action section visibility
      if (actionSection) actionSection.style.display = 'block';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    let webhookSuccess = false;
    let reportLink: string | null = null;

    try {
      // For PDF mode: Generate PDF and trigger instant download + background upload
      if (mode === 'pdf') {
        const { success: pdfSuccess, reportLink: link } = await generatePdfAndUpload();
        reportLink = link;

        if (pdfSuccess) {
          toast({
            title: "Your PDF is downloading!",
            description: "We'll email the report shortly.",
          });
        }
      }

      // Build payload with report link (or null for booking)
      const payload = buildPayload(reportLink);

      // Send webhook for both modes
      try {
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          webhookSuccess = true;
          toast({
            title: "Success!",
            description: "We have mailed you your Client ROI report and Meeting invite, kindly check!",
          });
        } else {
          throw new Error('Webhook response not ok');
        }
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        webhookSuccess = false;
        toast({
          title: "We couldn't save your details",
          description: mode === 'pdf' 
            ? "Don't worry! Your PDF has been downloaded."
            : "Don't worry! You can still book a call.",
          variant: "destructive",
        });
      }

      onSuccess();
      onClose();
      resetForm();

      // For booking mode, only redirect on webhook ERROR
      if (mode === 'booking' && !webhookSuccess) {
        window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      toast({
        title: "Something went wrong",
        description: "Don't worry! You can still proceed with your request.",
        variant: "destructive",
      });

      // On error, allow booking redirect
      if (mode === 'booking') {
        window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
      }

      onClose();
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', company: '' });
    setErrors({ name: '', email: '' });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            {mode === 'pdf' 
              ? 'Get Your Free Personalized Report' 
              : 'Book Your Free Strategy Call'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your details to receive your personalized analysis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Work Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-foreground">
              Company Name <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="Acme Corp"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            🔒 Your data is private. We'll only use this to send your report and meeting invitation.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : mode === 'pdf' ? 'Download Report' : 'Book Call'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
