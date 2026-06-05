import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { PageTransition } from '@/components/PageTransition';
import {
  Users2,
  Goal,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Heart,
} from 'lucide-react';
import aboutStory from '@/assets/about-story.jpg';

const values = [
  {
    icon: Users2,
    title: 'Built with people',
    description: 'Features come from real feedback, not roadmap theatre.',
  },
  {
    icon: Goal,
    title: 'Keep it simple',
    description: 'Plain words. Clear numbers. No jargon to decode.',
  },
  {
    icon: ShieldCheck,
    title: 'Your data is yours',
    description: 'Locked to your account. Export it any time. We never sell it.',
  },
  {
    icon: Heart,
    title: 'For all of us',
    description: 'Many currencies. Many income shapes. Salary, freelance, hustle, all of it.',
  },
];

export default function About() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/landing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              About FedhaFlow
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A small team in Nairobi building a finance app that gets out of the way.
              Simple, private, useful on a regular Tuesday.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">
                Why we built this
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Most finance apps were built for one kind of life. One salary, one currency, one bank.
                  Reality is messier. People juggle salaries, side gigs, family contributions, rent paid in cash.
                </p>
                <p>
                  FedhaFlow started as a side project to track all of that in one place.
                  No bank logins, no scary permissions. Just a clear picture of what came in,
                  what went out, and what is left for the goals.
                </p>
                <p>
                  It grew into budgets, savings goals, analytics, and a team plan for small businesses.
                  The point has not changed: make this stuff useful and easy to actually open every day.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-primary/5 ring-1 ring-white/5">
                <img
                  src={aboutStory}
                  alt="Notebook with handwritten budget and a phone showing a chart"
                  className="w-full h-auto"
                  width={1280}
                  height={960}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">What we care about</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-5 rounded-2xl bg-card border border-border/50"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <value.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
            Want to try it?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Free to start. Take it for a spin and see if it fits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth">
              <Button size="lg">
                Get started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">Say hello</Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
    </PageTransition>
  );
}
