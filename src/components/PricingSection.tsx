import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Monthly',
    price: '99',
    period: '/month',
    description: 'Perfect for getting started',
    icon: Zap,
    features: [
      'Unlimited income tracking',
      'Expense management',
      'Basic analytics',
      'Email support',
      'Mobile access',
    ],
    popular: false,
    savings: null,
  },
  {
    name: 'Yearly',
    price: '4,599',
    period: '/year',
    description: 'Best value for committed users',
    icon: Sparkles,
    features: [
      'Everything in Monthly',
      'Advanced analytics',
      'Priority support',
      'Export reports',
      'Goal tracking',
      'Budget forecasting',
    ],
    popular: true,
    savings: 'Save 61%',
  },
  {
    name: '2 Years',
    price: '9,999',
    period: '/2 years',
    description: 'Maximum savings for long-term',
    icon: Crown,
    features: [
      'Everything in Yearly',
      'Lifetime updates',
      'Dedicated support',
      'Early access features',
      'Custom integrations',
      'Team collaboration',
    ],
    popular: false,
    savings: 'Save 58%',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Pricing Plans
          </Badge>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Start with a <span className="font-semibold text-primary">1-month free trial</span>. 
            No credit card required. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? 'border-primary bg-gradient-to-b from-primary/5 to-background shadow-lg scale-105'
                  : 'border-border bg-card'
              } p-6 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-md">
                    Most Popular
                  </Badge>
                </div>
              )}

              {plan.savings && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    {plan.savings}
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  plan.popular ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold">KSh {plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth" className="w-full">
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  Start Free Trial
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground text-center mt-3">
                1 month free, then billed {plan.period.replace('/', '')}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-muted-foreground">
            All plans include a <span className="font-medium text-foreground">30-day money-back guarantee</span>.
            Questions? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
