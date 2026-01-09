import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/App";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Image as ImageIcon,
  Zap,
  Cloud,
  Download,
  Shield,
  Clock,
  Globe,
  X,
  Heart
} from "lucide-react";

// Effects components
import { MagneticHeadline, MagneticCharacter } from "@/components/effects/MagneticText";
import { ScrollReveal, StaggerReveal, TextReveal } from "@/components/effects/ScrollReveal";
import { NavigationTabs, SpotlightButton, OutlineButton } from "@/components/effects/NavigationTabs";
import { SpotlightCard } from "@/components/effects/SpotlightCard";

const features = [
  {
    icon: Sparkles,
    title: "AI Background Removal",
    description: "State-of-the-art AI removes backgrounds with pixel-perfect precision. No manual editing required."
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Get your processed images in under 3 seconds. Built for speed and efficiency."
  },
  {
    icon: Cloud,
    title: "Cloud Storage",
    description: "Your images are securely stored and accessible from any device, anywhere in the world."
  },
  {
    icon: Download,
    title: "High Quality Export",
    description: "Download in PNG format with transparency preserved. Perfect for any use case."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your images are processed securely and deleted after 24 hours. Your data stays yours."
  },
  {
    icon: Globe,
    title: "Shareable Links",
    description: "Generate instant shareable links for your processed images. Collaboration made easy."
  }
];

const navTabs = [
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'about', label: 'About' },
];

export default function LandingPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('features');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden" data-testid="landing-page">
      {/* Thank You Modal for Uplane */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6"
            onClick={() => setShowThankYou(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowThankYou(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 transition-colors"
                data-testid="close-thank-you"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>

              {/* Uplane Image */}
              <div className="flex justify-center mb-8">
                <img 
                  src="https://customer-assets.emergentagent.com/job_flipcut-1/artifacts/z08veiz0_image.png"
                  alt="Uplane Team"
                  className="w-full max-w-md rounded-2xl border border-zinc-800"
                />
              </div>

              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>A Personal Note</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold text-white">
                  Thank You, Uplane Team
                </h2>

                <div className="space-y-4 text-zinc-400 text-left leading-relaxed">
                  <p>
                    <span className="text-white font-medium">To Mr. Marvin</span> — Thank you for giving me the chance to connect with you on LinkedIn and for the opportunity to interview at Uplane. Your openness to hear from aspiring developers means the world.
                  </p>
                  
                  <p>
                    <span className="text-white font-medium">To Mr. Julius</span> — Thank you for the insightful interview today. Learning about what Uplane does, how it works, and the impact you're creating was truly inspiring. It was a delightful conversation that reinforced my excitement about this opportunity.
                  </p>
                  
                  <p>
                    <span className="text-white font-medium">To Mr. Lukas</span> — Thank you for the take-home assignment. Building FlipCut was a great way to showcase my skills, and I genuinely enjoyed the challenge.
                  </p>

                  <p className="text-white font-medium pt-4 text-center">
                    I'm excited about the opportunity to speak with you soon! 🚀
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href="https://my-portfolio-sainath-gandhes-projects.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
                    data-testid="portfolio-link"
                  >
                    Want to know more about my skills?
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left - Thank You Button */}
          <button
            onClick={() => setShowThankYou(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors text-sm"
            data-testid="thank-uplane-btn"
          >
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-zinc-300">For Uplane</span>
          </button>

          {/* Center - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M4 4L10 12L4 20H8L14 12L8 4H4Z" fill="black"/>
                <path d="M12 4L18 12L12 20H16L22 12L16 4H12Z" fill="black" fillOpacity="0.5"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">FlipCut</span>
          </div>

          {/* Right - Nav + CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <NavigationTabs 
                tabs={navTabs} 
                activeTab={activeTab} 
                onChange={setActiveTab}
              />
            </div>
            <SpotlightButton
              onClick={handleGetStarted}
              data-testid="nav-get-started-btn"
              className="text-sm px-5 py-2"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </SpotlightButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Background */}
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px]" />

        <div className="max-w-5xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-8">
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                Powered by AI
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-500">50 free images/month</span>
            </div>
          </ScrollReveal>

          {/* Magnetic Headline */}
          <div className="mb-8">
            <ScrollReveal delay={0.1}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight">
                <span className="block text-zinc-500">
                  <MagneticHeadline text="Remove backgrounds." className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold" />
                </span>
                <span className="block text-white mt-2">
                  <MagneticHeadline text="Flip instantly." className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold" />
                </span>
              </h1>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl text-zinc-500 max-w-xl mb-10 leading-relaxed">
              Professional image processing for creators who value their time. 
              Upload, transform, and download — all in seconds.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap items-center gap-4">
              <SpotlightButton
                onClick={handleGetStarted}
                data-testid="get-started-btn"
                className="text-base px-8 py-3"
              >
                Start Creating
                <ArrowRight className="w-4 h-4" />
              </SpotlightButton>
              
              <OutlineButton
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="learn-more-btn"
                className="text-base"
              >
                Learn More
              </OutlineButton>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap gap-12 mt-16 pt-8 border-t border-zinc-900">
              <div>
                <div className="text-3xl font-semibold text-white">3s</div>
                <div className="text-sm text-zinc-600 mt-1">Average processing</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">50+</div>
                <div className="text-sm text-zinc-600 mt-1">Free images/month</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">100%</div>
                <div className="text-sm text-zinc-600 mt-1">Cloud storage</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="max-w-2xl mb-16">
              <span className="text-xs text-zinc-600 uppercase tracking-wider">Features</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mt-4 mb-4">
                Built for professionals
              </h2>
              <p className="text-zinc-500">
                Every feature designed with one goal — help you create better content, faster.
              </p>
            </div>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {features.map((feature, index) => (
              <SpotlightCard 
                key={index}
                className="p-6 rounded-2xl bg-zinc-900/50 border-zinc-800"
                spotlightColor="rgba(255, 255, 255, 0.05)"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </SpotlightCard>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs text-zinc-600 uppercase tracking-wider">Process</span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mt-4">
                Three steps. That's it.
              </h2>
            </div>
          </ScrollReveal>

          <StaggerReveal className="space-y-8" staggerDelay={0.15}>
            {[
              { step: '01', title: 'Upload', desc: 'Drag and drop your image or click to browse. We support PNG, JPEG, and WebP.' },
              { step: '02', title: 'Process', desc: 'Our AI removes the background and applies a horizontal flip automatically.' },
              { step: '03', title: 'Download', desc: 'Get your processed image instantly. Share it or download in high quality.' }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-colors">
                <div className="text-4xl font-semibold text-zinc-800">{item.step}</div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-zinc-950">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">
              Ready to transform your images?
            </h2>
            <p className="text-zinc-500 mb-10 text-lg">
              Join creators who trust FlipCut for their image processing needs.
            </p>
            <SpotlightButton
              onClick={handleGetStarted}
              data-testid="cta-get-started-btn"
              className="text-lg px-10 py-4"
            >
              {user ? 'Go to Dashboard' : 'Start for Free'}
              <ArrowRight className="w-5 h-5" />
            </SpotlightButton>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M4 4L10 12L4 20H8L14 12L8 4H4Z" fill="black"/>
                <path d="M12 4L18 12L12 20H16L22 12L16 4H12Z" fill="black" fillOpacity="0.5"/>
              </svg>
            </div>
            <span className="text-sm text-zinc-500">FlipCut © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://my-portfolio-sainath-gandhes-projects.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
            >
              Portfolio <ArrowUpRight className="w-3 h-3" />
            </a>
            <span className="text-sm text-zinc-600">Built with care for Uplane</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
