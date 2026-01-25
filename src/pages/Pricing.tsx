import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Zap, ArrowRight, HelpCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition } from '@/components/PageTransition';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const plans = [
  {
    name: 'Starter',
    price: '49',
    period: '/month',
    description: 'Perfect for getting started with basic tracking',
    icon: Zap,
    features: [
      'Track up to 5 income sources',
      'Basic expense tracking',
      'Monthly summary reports',
      'Mobile-friendly access',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
    gradient: 'from-muted to-muted/50',
  },
  {
    name: 'Pro',
    price: '299',
    period: '/month',
    description: 'Best for individuals serious about their finances',
    icon: Sparkles,
    features: [
      'Unlimited income sources',
      'Advanced expense categories',
      'Savings goals & tracking',
      'Detailed analytics & charts',
      'Export reports (CSV, PDF)',
      'Priority email support',
      'Budget forecasting',
    ],
    cta: 'Start 14-Day Free Trial',
    popular: true,
    gradient: 'from-primary to-accent',
  },
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
    question: 'Do you offer annual discounts?',
    answer: 'Yes! Pay annually and save up to 20%. Starter annual is KSh 470/year (save KSh 118), Pro annual is KSh 2,870/year (save KSh 718).',
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

        {/* Pricing Cards */}
        <section className="pb-16 sm:pb-20 -mt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto"
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
                      <span className="text-4xl sm:text-5xl font-bold tracking-tight">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-success" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

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
