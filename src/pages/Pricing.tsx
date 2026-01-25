import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, Sparkles, Zap, ArrowRight, HelpCircle, Wallet, TrendingUp, Crown, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition } from '@/components/PageTransition';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type BillingCycle = '1_month' | '2_months' | '6_months' | '1_year' | '2_years';

const BILLING_LABELS: Record<BillingCycle, string> = {
  '1_month': '1 Month',
  '2_months': '2 Months',
  '6_months': '6 Months',
  '1_year': '1 Year',
  '2_years': '2 Years',
};

const BILLING_DISCOUNTS: Record<BillingCycle, number> = {
  '1_month': 0,
  '2_months': 5,
  '6_months': 10,
  '1_year': 20,
  '2_years': 30,
};

const BILLING_MONTHS: Record<BillingCycle, number> = {
  '1_month': 1,
  '2_months': 2,
  '6_months': 6,
  '1_year': 12,
  '2_years': 24,
};

const basePrices = {
  starter: 49,
  plus: 149,
  pro: 299,
  premium: 499,
};

const getPrice = (plan: keyof typeof basePrices, cycle: BillingCycle): number => {
  const months = cycle === '1_month' ? 1 : cycle === '2_months' ? 2 : cycle === '6_months' ? 6 : cycle === '1_year' ? 12 : 24;
  const discount = BILLING_DISCOUNTS[cycle] / 100;
  return Math.round(basePrices[plan] * months * (1 - discount));
};

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for getting started with basic tracking',
    icon: Zap,
    cta: 'Get Started',
    popular: false,
    gradient: 'from-muted to-muted/50',
  },
  {
    id: 'plus',
    name: 'Plus',
    description: 'Great for individuals tracking multiple income streams',
    icon: TrendingUp,
    cta: 'Start Free Trial',
    popular: false,
    gradient: 'from-ticket/80 to-ticket/40',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for individuals serious about their finances',
    icon: Sparkles,
    cta: 'Start 14-Day Free Trial',
    popular: true,
    gradient: 'from-primary to-accent',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For power users who want everything',
    icon: Crown,
    cta: 'Go Premium',
    popular: false,
    gradient: 'from-accent to-primary',
  },
];

const features = [
  { name: 'Income sources', starter: '5', plus: '15', pro: 'Unlimited', premium: 'Unlimited' },
  { name: 'Expense tracking', starter: 'Basic', plus: 'Advanced', pro: 'Advanced', premium: 'Advanced' },
  { name: 'Expense categories', starter: '5', plus: '15', pro: 'Unlimited', premium: 'Unlimited' },
  { name: 'Monthly reports', starter: true, plus: true, pro: true, premium: true },
  { name: 'Weekly reports', starter: false, plus: true, pro: true, premium: true },
  { name: 'Savings goals', starter: false, plus: 'Basic', pro: 'Full', premium: 'Full' },
  { name: 'Analytics & charts', starter: false, plus: 'Basic', pro: 'Detailed', premium: 'Detailed' },
  { name: 'Export (CSV, PDF)', starter: false, plus: false, pro: true, premium: true },
  { name: 'Budget forecasting AI', starter: false, plus: false, pro: false, premium: true },
  { name: 'Custom widgets', starter: false, plus: false, pro: false, premium: true },
  { name: 'Financial insights', starter: false, plus: false, pro: false, premium: true },
  { name: 'Email support', starter: false, plus: true, pro: 'Priority', premium: 'Priority' },
  { name: 'Phone support', starter: false, plus: false, pro: false, premium: true },
  { name: 'Early access', starter: false, plus: false, pro: false, premium: true },
];

const faqs = [
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Pro plan comes with a 14-day free trial. No credit card required to start. You can cancel anytime during the trial period.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept M-Pesa, credit/debit cards (Visa, Mastercard), and bank transfers for annual plans.',
  },
  {
    question: 'Is my financial data secure?',
    answer: 'Yes, we use bank-level encryption (256-bit SSL) and never store your actual banking credentials. Your data is encrypted at rest and in transit.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us for a full refund.',
  },
  {
    question: 'What discounts do you offer?',
    answer: 'Save 5% on 2-month plans, 10% on 6-month plans, 20% on 1-year plans, and 30% on 2-year plans!',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('1_month');
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                  <Wallet className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg">IncomeFlow</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link to="/landing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative"
          >
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Simple, Transparent Pricing
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Choose Your Plan
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg mb-2">
              Start free and upgrade as you grow. All plans include a{' '}
              <span className="font-semibold text-foreground">14-day free trial</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              No credit card required • Cancel anytime
            </p>
          </motion.div>
        </section>

        {/* Billing Cycle Selector & Savings Calculator */}
        <section className="pb-8 -mt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-4 mb-6">
                <p className="text-sm text-muted-foreground">Select billing period:</p>
                <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as BillingCycle)}>
                  <SelectTrigger className="w-[200px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {(Object.keys(BILLING_LABELS) as BillingCycle[]).map((cycle) => (
                      <SelectItem key={cycle} value={cycle}>
                        {BILLING_LABELS[cycle]}
                        {BILLING_DISCOUNTS[cycle] > 0 && (
                          <span className="ml-2 text-xs text-primary">-{BILLING_DISCOUNTS[cycle]}%</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Savings Calculator Card */}
              {billingCycle !== '1_month' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">Your Savings with {BILLING_LABELS[billingCycle]} Billing</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.map((plan) => {
                      const monthlyTotal = basePrices[plan.id as keyof typeof basePrices] * BILLING_MONTHS[billingCycle];
                      const discountedPrice = getPrice(plan.id as keyof typeof basePrices, billingCycle);
                      const savings = monthlyTotal - discountedPrice;
                      
                      return (
                        <div key={plan.id} className="bg-card rounded-xl p-4 border border-border">
                          <div className="flex items-center gap-2 mb-3">
                            <plan.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{plan.name}</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Monthly rate:</span>
                              <span className="line-through">KSh {monthlyTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">You pay:</span>
                              <span className="font-medium">KSh {discountedPrice.toLocaleString()}</span>
                            </div>
                            <div className="pt-2 border-t border-border">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-primary font-medium">You save:</span>
                                <Badge variant="secondary" className="bg-success/10 text-success border-0">
                                  KSh {savings.toLocaleString()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    That's {BILLING_DISCOUNTS[billingCycle]}% off compared to paying monthly!
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-16 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  variants={itemVariants}
                  className={`relative rounded-2xl border-2 ${
                    plan.popular
                      ? 'border-primary bg-gradient-to-b from-primary/5 via-background to-background shadow-xl shadow-primary/10 scale-[1.02]'
                      : 'border-border bg-card hover:border-primary/30'
                  } p-6 sm:p-8 flex flex-col transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <plan.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">KSh</span>
                      <span className="text-4xl sm:text-5xl font-bold tracking-tight">
                        {getPrice(plan.id as keyof typeof basePrices, billingCycle)}
                      </span>
                      <span className="text-muted-foreground text-sm">/{BILLING_LABELS[billingCycle].toLowerCase()}</span>
                    </div>
                    {billingCycle !== '1_month' && (
                      <p className="text-xs text-primary mt-1">
                        Save {BILLING_DISCOUNTS[billingCycle]}% vs monthly
                      </p>
                    )}
                  </div>

                  <div className="mb-8 flex-1">
                    <p className="text-xs text-muted-foreground">See feature comparison below</p>
                  </div>

                  <Link to="/auth" className="w-full">
                    <Button
                      className={`w-full ${plan.popular ? 'shadow-lg shadow-primary/25' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                Compare All Features
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                See exactly what's included in each plan
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto overflow-x-auto"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Feature</TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <span>Starter</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-ticket" />
                        <span>Plus</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Pro</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Crown className="w-4 h-4 text-accent" />
                        <span>Premium</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature) => (
                    <TableRow key={feature.name}>
                      <TableCell className="font-medium">{feature.name}</TableCell>
                      {(['starter', 'plus', 'pro', 'premium'] as const).map((plan) => {
                        const value = feature[plan];
                        return (
                          <TableCell key={plan} className="text-center">
                            {value === true ? (
                              <Check className="w-5 h-5 text-success mx-auto" />
                            ) : value === false ? (
                              <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                            ) : (
                              <span className="text-sm">{value}</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need to know about our pricing and plans
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-8 sm:p-12 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
              <div className="relative">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                  Ready to Take Control?
                </h2>
                <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
                  Join thousands of users managing their finances smarter with IncomeFlow.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/auth">
                    <Button size="lg" variant="secondary" className="shadow-xl">
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Wallet className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="font-display font-semibold">IncomeFlow</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                © 2026 IncomeFlow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
