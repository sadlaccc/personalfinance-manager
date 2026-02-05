 import { useState, useEffect } from 'react';
 import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from '@/components/ui/dialog';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { toast } from 'sonner';
 import { Building2, Save } from 'lucide-react';
 
 interface CompanySettings {
   id: string;
   user_id: string;
   company_name: string | null;
   company_logo_url: string | null;
   industry: string | null;
   fiscal_year_start: number;
   currency: string;
 }
 
 interface CompanySettingsDialogProps {
   children: React.ReactNode;
 }
 
 const INDUSTRIES = [
   'Technology',
   'Finance',
   'Healthcare',
   'Education',
   'Retail',
   'Manufacturing',
   'Consulting',
   'Real Estate',
   'Agriculture',
   'Other',
 ];
 
 const MONTHS = [
   { value: 1, label: 'January' },
   { value: 2, label: 'February' },
   { value: 3, label: 'March' },
   { value: 4, label: 'April' },
   { value: 5, label: 'May' },
   { value: 6, label: 'June' },
   { value: 7, label: 'July' },
   { value: 8, label: 'August' },
   { value: 9, label: 'September' },
   { value: 10, label: 'October' },
   { value: 11, label: 'November' },
   { value: 12, label: 'December' },
 ];
 
 const CURRENCIES = [
   { code: 'KES', name: 'Kenyan Shilling' },
   { code: 'USD', name: 'US Dollar' },
   { code: 'EUR', name: 'Euro' },
   { code: 'GBP', name: 'British Pound' },
   { code: 'TZS', name: 'Tanzanian Shilling' },
   { code: 'UGX', name: 'Ugandan Shilling' },
 ];
 
 export function CompanySettingsDialog({ children }: CompanySettingsDialogProps) {
   const { user } = useAuth();
   const queryClient = useQueryClient();
   const [open, setOpen] = useState(false);
   const [companyName, setCompanyName] = useState('');
   const [industry, setIndustry] = useState('');
   const [fiscalYearStart, setFiscalYearStart] = useState(1);
   const [currency, setCurrency] = useState('KES');
 
   const { data: settings, isLoading } = useQuery({
     queryKey: ['company-settings', user?.id],
     queryFn: async () => {
       if (!user) return null;
       const { data, error } = await supabase
         .from('company_settings')
         .select('*')
         .eq('user_id', user.id)
         .maybeSingle();
 
       if (error) throw error;
       return data as CompanySettings | null;
     },
     enabled: !!user && open,
   });
 
   useEffect(() => {
     if (settings) {
       setCompanyName(settings.company_name || '');
       setIndustry(settings.industry || '');
       setFiscalYearStart(settings.fiscal_year_start || 1);
       setCurrency(settings.currency || 'KES');
     }
   }, [settings]);
 
   const saveSettings = useMutation({
     mutationFn: async () => {
       if (!user) throw new Error('Not authenticated');
 
       const settingsData = {
         user_id: user.id,
         company_name: companyName.trim() || null,
         industry: industry || null,
         fiscal_year_start: fiscalYearStart,
         currency,
       };
 
       const { error } = await supabase
         .from('company_settings')
         .upsert(settingsData, { onConflict: 'user_id' });
 
       if (error) throw error;
     },
     onSuccess: () => {
       toast.success('Company settings saved!');
       queryClient.invalidateQueries({ queryKey: ['company-settings'] });
       setOpen(false);
     },
     onError: (error: Error) => {
       toast.error(error.message || 'Failed to save settings');
     },
   });
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>{children}</DialogTrigger>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <Building2 className="w-5 h-5" />
             Company Settings
           </DialogTitle>
           <DialogDescription>
             Configure your business profile and preferences
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="companyName">Company Name</Label>
             <Input
               id="companyName"
               placeholder="Acme Corporation"
               value={companyName}
               onChange={(e) => setCompanyName(e.target.value)}
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="industry">Industry</Label>
             <Select value={industry} onValueChange={setIndustry}>
               <SelectTrigger>
                 <SelectValue placeholder="Select industry" />
               </SelectTrigger>
               <SelectContent>
                 {INDUSTRIES.map((ind) => (
                   <SelectItem key={ind} value={ind}>
                     {ind}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="fiscalYear">Fiscal Year Starts</Label>
             <Select
               value={fiscalYearStart.toString()}
               onValueChange={(v) => setFiscalYearStart(parseInt(v))}
             >
               <SelectTrigger>
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {MONTHS.map((month) => (
                   <SelectItem key={month.value} value={month.value.toString()}>
                     {month.label}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="currency">Default Currency</Label>
             <Select value={currency} onValueChange={setCurrency}>
               <SelectTrigger>
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {CURRENCIES.map((curr) => (
                   <SelectItem key={curr.code} value={curr.code}>
                     {curr.code} - {curr.name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </div>
 
         <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)}>
             Cancel
           </Button>
           <Button onClick={() => saveSettings.mutate()} disabled={saveSettings.isPending}>
             <Save className="w-4 h-4 mr-2" />
             {saveSettings.isPending ? 'Saving...' : 'Save Settings'}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }