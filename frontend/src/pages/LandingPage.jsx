import React, { useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useAuth } from "@/App";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Zap,
  Cloud,
  Download,
  Shield,
  Globe,
  X,
  Heart
} from "lucide-react";

// Effects components
import { MagneticHeadline } from "@/components/effects/MagneticText";
import { ScrollReveal, StaggerReveal } from "@/components/effects/ScrollReveal";
import { SpotlightButton, OutlineButton } from "@/components/effects/NavigationTabs";
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

// Text Reveal Component for Thank You modal
function TextRevealTitle({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"]
  });

  const words = text.split(' ');

  return (
    <h2 ref={ref} className="text-2xl md:text-3xl font-semibold text-white flex flex-wrap justify-center gap-x-2">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <TextRevealWord key={i} progress={scrollYProgress} range={[start, end]}>{word}</TextRevealWord>;
      })}
    </h2>
  );
}

function TextRevealWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [10, 0]);

  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}
    </motion.span>
  );
}

// Text Reveal for description
function TextRevealDescription({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.6"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [20, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const { user, login, showThankYou, setShowThankYou } = useAuth();
  const navigate = useNavigate();

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
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/95 backdrop-blur-sm overflow-y-auto py-8"
            onClick={() => setShowThankYou(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-2xl w-full mx-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowThankYou(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 transition-colors z-10"
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

                {/* Text Reveal Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-2xl md:text-3xl font-semibold text-white"
                >
                  Thank You, Uplane Team
                </motion.h2>

                {/* Text Reveal Description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="space-y-4 text-zinc-400 text-left leading-relaxed"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-white font-medium">To Mr. Marvin</span> — Thank you for giving me the chance to connect with you on LinkedIn and for the opportunity to interview at Uplane. Your openness to hear from aspiring developers means the world.
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="text-white font-medium">To Mr. Julius</span> — Thank you for the insightful interview. Learning about what Uplane does, how it works, and the impact you're creating was truly inspiring. It was a delightful conversation that reinforced my excitement about this opportunity.
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <span className="text-white font-medium">To Mr. Lukas</span> — Thank you for the take-home assignment. Building FlipCut was a great way to showcase my skills, and I genuinely enjoyed the challenge.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="text-white font-medium pt-4 text-center"
                  >
                    I'm excited about the opportunity to speak with you soon! 🚀
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="pt-6"
                >
                  <a
                    href="https://drive.google.com/file/d/1hCMZT19cyj_4rixefSKHuNDy0DpbImHN/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
                    data-testid="portfolio-link"
                  >
                    Want to know more about my skills?
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Background */}
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px]" />

        <div className="max-w-5xl mx-auto relative z-10">
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
                spotlightColor="rgba(56, 189, 248, 0.15)"
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

          <StaggerReveal className="space-y-6" staggerDelay={0.15}>
            {[
              { step: '01', title: 'Upload', desc: 'Drag and drop your image or click to browse. We support PNG, JPEG, and WebP.' },
              { step: '02', title: 'Process', desc: 'Our AI removes the background and applies a horizontal flip automatically.' },
              { step: '03', title: 'Download', desc: 'Get your processed image instantly. Share it or download in high quality.' }
            ].map((item, index) => (
              <SpotlightCard 
                key={index} 
                className="p-6 rounded-2xl bg-zinc-900/30 border-zinc-900"
                spotlightColor="rgba(56, 189, 248, 0.1)"
              >
                <div className="flex items-start gap-6">
                  <div className="text-4xl font-semibold text-zinc-700">{item.step}</div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
                    <p className="text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              </SpotlightCard>
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
          <span className="text-sm text-zinc-600">Built with care for Uplane</span>
        </div>
      </footer>
    </div>
  );
}
