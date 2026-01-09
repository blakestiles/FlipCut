import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/App";
import { useNavigate } from "react-router-dom";
import { 
  Scissors, 
  Zap, 
  Cloud, 
  Download, 
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  FlipHorizontal2
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Background Removal",
    description: "Instantly remove backgrounds from any image using advanced AI technology"
  },
  {
    icon: FlipHorizontal2,
    title: "Horizontal Flip",
    description: "Automatically flip your processed images for perfect mirror effects"
  },
  {
    icon: Cloud,
    title: "Cloud Storage",
    description: "All your images are securely stored and accessible from anywhere"
  },
  {
    icon: Download,
    title: "Easy Download",
    description: "Download your processed images instantly in high quality PNG format"
  }
];

const demoImages = [
  {
    url: "https://images.pexels.com/photos/19245168/pexels-photo-19245168.jpeg",
    category: "Portrait"
  },
  {
    url: "https://images.pexels.com/photos/27298415/pexels-photo-27298415.jpeg",
    category: "Product"
  },
  {
    url: "https://images.pexels.com/photos/5195367/pexels-photo-5195367.jpeg",
    category: "Automotive"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function LandingPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen pt-20" data-testid="landing-page">
      {/* Hero Section */}
      <section className="px-6 py-24 md:py-32 lg:py-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-start mb-8">
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#06b6d4]" />
              <span className="text-sm text-zinc-400">AI-Powered Image Processing</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Remove backgrounds.{" "}
            <span className="gradient-text">Flip instantly.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-base lg:text-lg text-zinc-400 max-w-2xl mb-10"
          >
            Transform your images in seconds with FlipCut. Our AI removes backgrounds 
            and flips your images horizontally — perfect for e-commerce, social media, 
            and creative projects.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Button
              onClick={handleGetStarted}
              className="rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-6 text-lg font-medium shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-shadow"
              data-testid="get-started-btn"
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/10 hover:bg-white/5 text-white px-8 py-6 text-lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="learn-more-btn"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Demo Images Section */}
      <section className="px-6 py-16 bg-[#0a0a0f]/50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Works with any image
            </h2>
            <p className="text-zinc-400">Portraits, products, vehicles, and more</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative overflow-hidden rounded-2xl glass"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm text-white font-medium">{image.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-zinc-400 text-base lg:text-lg">
              Professional image processing in just a few clicks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass p-6 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#7c3aed]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-24 bg-[#0a0a0f]/50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-zinc-400 text-base lg:text-lg">
              Three simple steps to transform your images
            </p>
          </div>

          <div className="space-y-8">
            {[
              { step: 1, title: "Upload", description: "Drag & drop or click to upload your image" },
              { step: 2, title: "Process", description: "Our AI removes the background and flips horizontally" },
              { step: 3, title: "Download", description: "Get your processed image instantly" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-full bg-[#7c3aed] flex items-center justify-center shrink-0 text-white font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to transform your images?
          </h2>
          <p className="text-zinc-400 mb-8 text-base lg:text-lg">
            Join thousands of creators using FlipCut for their image processing needs.
          </p>
          <Button
            onClick={handleGetStarted}
            className="rounded-full bg-white text-black hover:bg-zinc-200 px-10 py-6 text-lg font-medium"
            data-testid="cta-get-started-btn"
          >
            {user ? 'Go to Dashboard' : 'Start for Free'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-[#7c3aed]" />
            <span className="text-sm text-zinc-400">FlipCut © {new Date().getFullYear()}</span>
          </div>
          <p className="text-sm text-zinc-500">
            Built with AI-powered background removal
          </p>
        </div>
      </footer>
    </div>
  );
}
