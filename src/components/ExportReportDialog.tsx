import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, FileText, Table, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

interface ExportReportDialogProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  expensesByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
  selectedMonth: Date;
}

export function ExportReportDialog({
  monthlyIncome,
  monthlyExpenses,
  expensesByCategory,
  incomeByCategory,
  selectedMonth,
}: ExportReportDialogProps) {
  const [format_, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();

  const monthLabel = format(selectedMonth, 'MMMM yyyy');
  const netIncome = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? ((netIncome / monthlyIncome) * 100).toFixed(1) : '0';
  const reportName = profile?.full_name || 'User';
  const safeReportName = reportName.replace(/[^a-zA-Z0-9]/g, '_');

  const generateCSV = () => {
    const lines: string[] = [];
    lines.push(`${reportName} - FedhaFlow Monthly Report - ${monthLabel}`);
    lines.push('');
    lines.push('Summary');
    lines.push(`Total Income,KSh ${monthlyIncome.toLocaleString()}`);
    lines.push(`Total Expenses,KSh ${monthlyExpenses.toLocaleString()}`);
    lines.push(`Net Income,KSh ${netIncome.toLocaleString()}`);
    lines.push(`Savings Rate,${savingsRate}%`);
    lines.push('');
    lines.push('Income by Category');
    Object.entries(incomeByCategory).forEach(([category, amount]) => {
      if (amount > 0) {
        lines.push(`${category},KSh ${amount.toLocaleString()}`);
      }
    });
    lines.push('');
    lines.push('Expenses by Category');
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      if (amount > 0) {
        lines.push(`${category},KSh ${amount.toLocaleString()}`);
      }
    });
    
    return lines.join('\n');
  };

  const generatePDFContent = () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportName} - FedhaFlow Report - ${monthLabel}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a2e; }
          h1 { color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          h2 { color: #1a1a2e; margin-top: 30px; }
          .summary { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .summary-item { padding: 15px; background: white; border-radius: 8px; }
          .summary-label { color: #666; font-size: 14px; }
          .summary-value { font-size: 24px; font-weight: bold; margin-top: 5px; }
          .income { color: #10b981; }
          .expense { color: #ef4444; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f8fafc; color: #64748b; font-weight: 600; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📊 ${reportName} - FedhaFlow Monthly Report</h1>
        <p>Report Period: <strong>${monthLabel}</strong></p>
        
        <div class="summary">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Total Income</div>
              <div class="summary-value income">KSh ${monthlyIncome.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Expenses</div>
              <div class="summary-value expense">KSh ${monthlyExpenses.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Net Income</div>
              <div class="summary-value" style="color: ${netIncome >= 0 ? '#10b981' : '#ef4444'}">KSh ${netIncome.toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Savings Rate</div>
              <div class="summary-value">${savingsRate}%</div>
            </div>
          </div>
        </div>

        <h2>Income by Category</h2>
        <table>
          <tr><th>Category</th><th>Amount (KSh)</th></tr>
          ${Object.entries(incomeByCategory)
            .filter(([_, amount]) => amount > 0)
            .map(([category, amount]) => `<tr><td>${category}</td><td class="income">${amount.toLocaleString()}</td></tr>`)
            .join('')}
        </table>

        <h2>Expenses by Category</h2>
        <table>
          <tr><th>Category</th><th>Amount (KSh)</th></tr>
          ${Object.entries(expensesByCategory)
            .filter(([_, amount]) => amount > 0)
            .map(([category, amount]) => `<tr><td>${category}</td><td class="expense">${amount.toLocaleString()}</td></tr>`)
            .join('')}
        </table>

        <div class="footer">
          <p>Generated by FedhaFlow for ${reportName} • ${format(new Date(), 'PPP')}</p>
        </div>
      </body>
      </html>
    `;
    return html;
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (format_ === 'csv') {
        const csv = generateCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${safeReportName}_FedhaFlow_Report_${format(selectedMonth, 'yyyy-MM')}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        const html = generatePDFContent();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 250);
        }
      }
      toast({ title: 'Report exported successfully!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export failed', description: 'Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Download your {monthLabel} financial report
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup value={format_} onValueChange={(v) => setFormat(v as 'csv' | 'pdf')}>
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer flex-1">
                <Table className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">CSV File</p>
                  <p className="text-sm text-muted-foreground">Spreadsheet format for Excel</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer flex-1">
                <FileText className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium">PDF Report</p>
                  <p className="text-sm text-muted-foreground">Printable document format</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
          <Button onClick={handleExport} className="w-full" disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {format_.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
