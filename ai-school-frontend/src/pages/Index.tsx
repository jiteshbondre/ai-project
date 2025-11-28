import { useNavigate } from "react-router-dom";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  GraduationCap,
  Brain,
  Sparkles,
  BookOpen,
  Users,
  ArrowRight,
  CheckCircle2,
  Video,
  FileCheck,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  Star,
  Quote,
  Linkedin,
  Youtube,
  Instagram,
  Play
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useRef } from "react";
import heroImage from "@/assets/hero-education.png";
import featureVideo from "@/assets/feature-video.png";
import featureHomework from "@/assets/feature-homework.png";
import featureProgress from "@/assets/feature-progress.png";

// Falling Elements Component - Mobile Optimized
const FallingElements = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Reduced element counts for mobile
  const elementCounts = {
    letters: isMobile ? 8 : 25,
    math: isMobile ? 12 : 35,
    science: isMobile ? 10 : 30,
    language: isMobile ? 6 : 28,
    numbers: isMobile ? 15 : 40,
    icons: isMobile ? 6 : 20,
    dots: isMobile ? 15 : 50,
    leftBalance: isMobile ? 5 : 15,
    centerBalance: isMobile ? 4 : 10
  };

  // Mobile-optimized content (shorter, simpler)
  const mobileContent = {
    math: ["E=mc²", "a²+b²=c²", "π", "∫f(x)dx", "∑", "F=ma", "V=IR", "H₂O", "CO₂", "sin²θ=1"],
    science: ["H₂O", "CO₂", "DNA", "RNA", "ATP", "F=ma", "E=mc²", "V=IR", "pV=nRT"],
    numbers: ["π", "∞", "√2", "∑", "∆", "θ", "λ", "φ", "∫", "≈", "≠", "≤", "≥", "→", "±"],
    languages: [
      "Hello",
      "नमस्ते",
      "வணக்கம்",
      "ನಮಸ್ಕಾರ",
      "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      "নমস্কার",
      "કેમ છો",
      "اداب",
      "नमस्कार"
    ]

  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* ABC Letters - Optimized */}
      {[...Array(elementCounts.letters)].map((_, i) => {
        const section = i % 3;
        let left;
        if (section === 0) left = Math.random() * 30;
        else if (section === 1) left = 30 + Math.random() * 40;
        else left = 70 + Math.random() * 30;

        return (
          <motion.div
            key={`letter-${i}`}
            className={`absolute font-bold text-primary/30 drop-shadow-lg ${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'
              }`}
            initial={{
              y: -100,
              opacity: 0,
              rotate: Math.random() * 360
            }}
            animate={{
              y: '100vh',
              opacity: [0, 0.2, 0.2, 0],
              rotate: Math.random() * 360 + 360
            }}
            transition={{
              duration: isMobile ? 12 + Math.random() * 8 : 15 + Math.random() * 10,
              delay: Math.random() * (isMobile ? 25 : 20),
              repeat: Infinity,
              repeatDelay: Math.random() * (isMobile ? 25 : 15) + 10,
              ease: "linear"
            }}
            style={{ left: `${left}%` }}
          >
            {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
          </motion.div>
        );
      })}

      {/* Math Formulas - Optimized */}
      {[...Array(elementCounts.math)].map((_, i) => {
        const section = i % 4;
        let left;
        if (section === 0) left = Math.random() * 25;
        else if (section === 1) left = 25 + Math.random() * 25;
        else if (section === 2) left = 50 + Math.random() * 25;
        else left = 75 + Math.random() * 25;

        const mathContent = isMobile ? mobileContent.math : [
          "E=mc²", "a²+b²=c²", "π=3.14159", "∫f(x)dx", "∂f/∂x", "∑x_i",
          "lim x→∞", "∇·F", "e^{iπ}+1=0", "φ=(1+√5)/2", "F=ma", "V=IR",
          "P=VI", "Q=mcΔT", "v=u+at", "s=ut+½at²", "Area=πr²", "C=2πr",
          "Speed=Distance/Time", "Density=Mass/Volume", "H₂O", "CO₂",
          "NaCl", "C₆H₁₂O₆", "H₂SO₄", "NH₃", "sin²θ+cos²θ=1",
          "tanθ=sinθ/cosθ", "Δ=½bh", "a/b=b/c", "x=(-b±√(b²-4ac))/2a",
          "Work=Force×Distance", "Power=Work/Time", "Pressure=Force/Area", "Momentum=mv"
        ];

        return (
          <motion.div
            key={`math-${i}`}
            className={`absolute font-mono font-bold text-ai-purple/40 drop-shadow-lg ${isMobile ? 'text-lg' : 'text-xl lg:text-2xl'
              }`}
            initial={{
              y: -150,
              opacity: 0,
              scale: 0.8,
              // rotate: Math.random() * 360
            }}
            animate={{
              y: '100vh',
              opacity: [0, 0.3, 0.3, 0],
              scale: 1.2,
              // rotate: Math.random() * 360
            }}
            transition={{
              duration: isMobile ? 15 + Math.random() * 10 : 18 + Math.random() * 12,
              delay: Math.random() * (isMobile ? 35 : 25),
              repeat: Infinity,
              repeatDelay: Math.random() * (isMobile ? 30 : 20) + 15,
              ease: "linear"
            }}
            style={{ left: `${left}%` }}
          >
            {mathContent[i % mathContent.length]}
          </motion.div>
        );
      })}

      {/* Science Symbols - Optimized */}
      {[...Array(elementCounts.science)].map((_, i) => {
        const section = i % 5;
        let left;
        if (section === 0) left = Math.random() * 20;
        else if (section === 1) left = 20 + Math.random() * 20;
        else if (section === 2) left = 40 + Math.random() * 20;
        else if (section === 3) left = 60 + Math.random() * 20;
        else left = 80 + Math.random() * 20;

        const scienceContent = isMobile ? mobileContent.science : [
          "H₂O", "CO₂", "NaCl", "C₆H₁₂O₆", "DNA", "RNA", "ATP", "F=ma",
          "E=mc²", "V=IR", "pV=nRT", "a²+b²=c²", "Δx·Δp≥ħ/2", "H₂SO₄", "CH₄", "NH₃",
          "O₂", "Fe₂O₃", "HCl", "MgSO₄", "OH⁻", "Na⁺", "Cl⁻", "CaCO₃",
          "I=V/R", "P=VI", "Q=mcΔT", "v=u+at", "s=ut+½at²", "λ=f·v", "E=hν", "p=mv"
        ];

        return (
          <motion.div
            key={`science-${i}`}
            className={`absolute font-bold text-emerald-500/40 drop-shadow-lg ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'
              }`}
            initial={{
              y: -120,
              opacity: 0,
              rotate: Math.random() * 360
            }}
            animate={{
              y: '100vh',
              opacity: [0, 0.2, 0.2, 0],
              rotate: Math.random() * 360
            }}
            transition={{
              duration: isMobile ? 16 + Math.random() * 8 : 20 + Math.random() * 10,
              delay: Math.random() * (isMobile ? 40 : 30),
              repeat: Infinity,
              repeatDelay: Math.random() * (isMobile ? 35 : 25) + 20,
              ease: "linear"
            }}
            style={{ left: `${left}%` }}
          >
            {scienceContent[i % scienceContent.length]}
          </motion.div>
        );
      })}

      {/* Language Characters - Optimized */}
      {[...Array(elementCounts.language)].map((_, i) => {
        const section = i % 4;
        let left;
        if (section === 0) left = Math.random() * 25;
        else if (section === 1) left = 25 + Math.random() * 25;
        else if (section === 2) left = 50 + Math.random() * 25;
        else left = 75 + Math.random() * 25;

        const languageContent = isMobile ? mobileContent.languages : [
          "पाठशाला", "வித்தியாலயம்", "పాఠశాల", "ಶಾಲೆ", "বিদ্যালয়", "പാഠശാല", "शाळा", "શાળા", "ਸਕੂਲ", "ବିଦ୍ୟାଳୟ",
          "गणित", "கணிதம்", "గణితం", "ಗಣಿತ", "গণিত", "ഗണിതം", "गणित", "ગણિત", "ਗਣਿਤ", "ଗଣିତ",
          "विज्ञान", "அறிவு", "విజ్ఞానం", "ವಿಜ್ಞಾನ", "বিজ্ঞান", "വിജ്ഞാനം", "विज्ञान", "વિજ્ઞાન", "ਵਿਗਿਆਨ", "ବିଜ୍ଞାନ"
        ];

        return (
          <motion.div
            key={`language-${i}`}
            className={`absolute text-cyan-500/40 font-bold drop-shadow-lg ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'
              }`}
            initial={{
              y: -180,
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              y: '100vh',
              opacity: [0, 0.2, 0.2, 0],
              scale: 1.3
            }}
            transition={{
              duration: isMobile ? 18 + Math.random() * 6 : 22 + Math.random() * 8,
              delay: Math.random() * (isMobile ? 45 : 35),
              repeat: Infinity,
              repeatDelay: Math.random() * (isMobile ? 40 : 30) + 25,
              ease: "linear"
            }}
            style={{ left: `${left}%` }}
          >
            {languageContent[i % languageContent.length]}
          </motion.div>
        );
      })}

      {/* Numbers & Symbols - Optimized */}
      {[...Array(elementCounts.numbers)].map((_, i) => {
        const section = i % 6;
        let left;
        if (section === 0) left = Math.random() * 16.67;
        else if (section === 1) left = 16.67 + Math.random() * 16.67;
        else if (section === 2) left = 33.33 + Math.random() * 16.67;
        else if (section === 3) left = 50 + Math.random() * 16.67;
        else if (section === 4) left = 66.67 + Math.random() * 16.67;
        else left = 83.33 + Math.random() * 16.67;

        const numberContent = isMobile ? mobileContent.numbers : [
          "123", "π", "∞", "√2", "∑", "∏", "∆", "θ", "λ", "φ", "μ", "Ω",
          "ψ", "α", "β", "γ", "σ", "τ", "∫", "≈", "≠", "≤", "≥", "⊕",
          "⊗", "∂", "∇", "→", "↔", "∴", "∵", "±", "×", "÷", "°", "′",
          "″", "‰", "‱", "∀"
        ];

        return (
          <motion.div
            key={`number-${i}`}
            className={`absolute font-bold text-purple-500/40 drop-shadow-lg ${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'
              }`}
            initial={{
              y: -130,
              opacity: 0,
              rotate: Math.random() * 360
            }}
            animate={{
              y: '100vh',
              opacity: [0, 0.2, 0.2, 0],
              rotate: Math.random() * 180 + 180
            }}
            transition={{
              duration: isMobile ? 12 + Math.random() * 6 : 16 + Math.random() * 8,
              delay: Math.random() * (isMobile ? 50 : 40),
              repeat: Infinity,
              repeatDelay: Math.random() * (isMobile ? 30 : 20) + 15,
              ease: "linear"
            }}
            style={{ left: `${left}%` }}
          >
            {numberContent[i % numberContent.length]}
          </motion.div>
        );
      })}

      {/* Educational Icons - Optimized */}
      {[...Array(elementCounts.icons)].map((_, i) => {
        const section = i % 4;
        let left;
        if (section === 0) left = Math.random() * 25;
        else if (section === 1) left = 25 + Math.random() * 25;
        else if (section === 2) left = 50 + Math.random() * 25;
        else left = 75 + Math.random() * 25;

        const iconContent = [
          "📚", "🔬", "🧮", "🌍", "💻", "🎨", "🎵", "📖", "🧪", "📝",
          "🧩", "🌌", "🏛️", "🔭", "🧬", "⚛️", "🔢", "🌡️", "🧲"
        ];

        return (
          <motion.div
            key={`icon-${i}`}
            className={`absolute drop-shadow-lg ${isMobile ? 'text-2xl' : 'text-3xl'}`}
            initial={{
              y: -200,
              opacity: 0,
              scale: 0.7
            }}
            animate={{
              y: '100vh',
              opacity: [0, 0.4, 0.4, 0],
              scale: 1.1
            }}
            transition={{
              duration: isMobile ? 20 + Math.random() * 8 : 25 + Math.random() * 10,
              delay: Math.random() * (isMobile ? 60 : 50),
              repeat: Infinity,
              repeatDelay: Math.random() * (isMobile ? 60 : 40) + 30,
              ease: "linear"
            }}
            style={{ left: `${left}%` }}
          >
            {iconContent[i % iconContent.length]}
          </motion.div>
        );
      })}

      {/* Floating dots - Optimized */}
      {[...Array(elementCounts.dots)].map((_, i) => {
        const section = i % 5;
        let left;
        if (section === 0) left = Math.random() * 20;
        else if (section === 1) left = 20 + Math.random() * 20;
        else if (section === 2) left = 40 + Math.random() * 20;
        else if (section === 3) left = 60 + Math.random() * 20;
        else left = 80 + Math.random() * 20;

        return (
          <motion.div
            key={`dot-${i}`}
            className={`absolute bg-primary/20 rounded-full drop-shadow-lg ${isMobile ? 'w-1 h-1' : 'w-2 h-2'
              }`}
            initial={{
              y: -50,
              opacity: 0
            }}
            animate={{
              y: '100vh',
              opacity: [0, 0.3, 0.3, 0]
            }}
            transition={{
              duration: isMobile ? 8 + Math.random() * 6 : 12 + Math.random() * 8,
              delay: Math.random() * (isMobile ? 70 : 60),
              repeat: Infinity,
              repeatDelay: Math.random() * (isMobile ? 25 : 15) + 10,
              ease: "linear"
            }}
            style={{ left: `${left}%` }}
          />
        );
      })}

      {/* Additional Balance Elements - Optimized */}
      {[...Array(elementCounts.leftBalance)].map((_, i) => (
        <motion.div
          key={`left-balance-${i}`}
          className={`absolute font-bold text-blue-400/30 drop-shadow-lg ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'
            }`}
          initial={{
            y: -100,
            opacity: 0,
            rotate: Math.random() * 180
          }}
          animate={{
            y: '100vh',
            opacity: [0, 0.2, 0.2, 0],
            rotate: Math.random() * 180 + 180
          }}
          transition={{
            duration: isMobile ? 10 + Math.random() * 6 : 14 + Math.random() * 8,
            delay: Math.random() * (isMobile ? 55 : 45),
            repeat: Infinity,
            repeatDelay: Math.random() * (isMobile ? 35 : 25) + 20,
            ease: "linear"
          }}
          style={{ left: `${Math.random() * 40}%` }}
        >
          {["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "λ", "μ"][i % 10]}
        </motion.div>
      ))}

      {/* Additional Center Elements - Optimized */}
      {[...Array(elementCounts.centerBalance)].map((_, i) => (
        <motion.div
          key={`center-balance-${i}`}
          className={`absolute font-mono text-green-400/35 drop-shadow-lg ${isMobile ? 'text-lg' : 'text-2xl lg:text-3xl'
            }`}
          initial={{
            y: -120,
            opacity: 0,
            scale: 0.9
          }}
          animate={{
            y: '100vh',
            opacity: [0, 0.3, 0.3, 0],
            scale: 1.1
          }}
          transition={{
            duration: isMobile ? 12 + Math.random() * 4 : 16 + Math.random() * 6,
            delay: Math.random() * (isMobile ? 45 : 35),
            repeat: Infinity,
            repeatDelay: Math.random() * (isMobile ? 30 : 20) + 15,
            ease: "linear"
          }}
          style={{ left: `${40 + Math.random() * 20}%` }}
        >
          {["÷", "×", "±", "≈", "≠", "≤", "≥", "≡", "≅", "∝"][i % 10]}
        </motion.div>
      ))}
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      icon: Video,
      title: "🎥 AI Video Lessons",
      description: "Instantly generated videos explaining any topic with personalized content tailored to each student's needs",
      image: featureVideo,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileCheck,
      title: "🧠 Homework & Exam Checking",
      description: "Upload and get instant AI feedback and grading with detailed explanations and improvement suggestions",
      image: featureHomework,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Brain,
      title: "⚡ One-Click Study Assistant",
      description: "Summaries, questions, and answers in seconds. Your 24/7 intelligent tutor that never sleeps",
      image: featureVideo,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: TrendingUp,
      title: "📊 Progress Tracking",
      description: "Insights for teachers, students, and parents with real-time performance analytics and learning trends",
      image: featureProgress,
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload or Ask",
      description: "Upload homework or ask for a topic to learn",
      image: "https://img.icons8.com/color/452/upload-to-cloud.png"
    },
    {
      number: "02",
      title: "AI Generates",
      description: "AI generates lessons, explanations, and checks answers instantly",
      image: "https://img.icons8.com/color/452/artificial-intelligence.png" // AI concept
    },
    {
      number: "03",
      title: "Get Insights",
      description: "Get instant reports, analytics, and actionable insights for improvement",
      image: "https://img.icons8.com/color/452/combo-chart--v1.png" // Analytics/report
    }
  ];





  const testimonials = [
    {
      role: "Student",
      name: "Sarah Chen",
      text: "The AI tutor helped me improve my math grade from B to A+ in just 3 months!",
      rating: 5
    },
    {
      role: "Teacher",
      name: "Mr. Johnson",
      text: "Grading homework used to take hours. Now it's done in minutes with better feedback.",
      rating: 5
    },
    {
      role: "Parent",
      name: "Maria Rodriguez",
      text: "I can finally track my child's progress in real-time. It's incredibly reassuring.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Student",
      price: "Free",
      features: [
        "AI-powered video lessons",
        "Study assistant access",
        "Progress tracking",
        "Basic homework help",
        "Mobile app access"
      ],
      popular: false
    },
    {
      name: "Teacher Pro",
      price: "$29",
      period: "/month",
      features: [
        "Everything in Student",
        "Automated grading",
        "Class management tools",
        "Advanced analytics",
        "Priority support",
        "Custom lesson plans"
      ],
      popular: true
    },
    {
      name: "School",
      price: "Custom",
      features: [
        "Everything in Teacher Pro",
        "Unlimited teachers & students",
        "Admin dashboard",
        "API access",
        "Dedicated support",
        "Custom integrations"
      ],
      popular: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative">
      {/* Global Falling Elements */}
      <FallingElements />

      {/* Fixed Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-ai-purple rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">AI School</span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              onClick={() => navigate('/login')}
              variant="gradient"
              className="group"
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-ai-purple/5" /> */}

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
              >
                {/* <Sparkles className="h-4 w-4" /> */}
                <span className="text-sm font-medium">AI-Powered Education Platform</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                Empowering Education
                <span className="text-gradient block mt-2">with the Power of AI</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                One platform for smart learning, instant homework feedback, and progress tracking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/login')}
                  variant="gradient"
                  size="lg"
                  className="group text-lg px-8"
                >
                  {/* <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" /> */}
                  Start Free Today
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8"
                >
                  Explore Features
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-ai)]">
                <img
                  src={heroImage}
                  alt="AI Education Platform"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>


            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              {/* <Sparkles className="h-4 w-4" /> */}
              <span className="text-sm font-medium">Powerful Features</span>
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="text-gradient block mt-2">Excel in Education</span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive tools for students, teachers, and parents
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-luxury)]"
              >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>

                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium">Simple Process</span>
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-6">
              How It Works in
              <span className="text-gradient block mt-2">3 Simple Steps</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <div className="bg-card border-2 border-border rounded-3xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-medium)] h-full flex flex-col items-center text-center">

                  {/* Step Number (Faint background number) */}
                  <div className="text-6xl font-bold text-gradient mb-4 opacity-20">{step.number}</div>

                  {/* Step Image */}
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-32 h-32 object-contain mb-4 transition-transform duration-300 hover:scale-105"
                  />

                  {/* Step Title */}
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>

                  {/* Step Description */}
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Connecting line between cards */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </motion.div>
            ))}

          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Testimonials</span>
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-6">
              Loved by Students, Teachers
              <span className="text-gradient block mt-2">and Parents Worldwide</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-card border-2 border-border rounded-3xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-medium)]"
              >
                <Quote className="h-10 w-10 text-primary/20 mb-4" />

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 text-lg italic">{testimonial.text}</p>

                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-b from-background to-ai-purple/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Pricing Plans</span>
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-6">
              Choose Your
              <span className="text-gradient block mt-2">Perfect Plan</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`relative bg-card border-2 ${plan.popular ? 'border-primary' : 'border-border'} rounded-3xl p-8 transition-all duration-300 hover:shadow-[var(--shadow-luxury)]`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-ai-purple text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gradient">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => navigate('/login')}
                  variant={plan.popular ? "gradient" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-ai-purple rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">INDSC Learn</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Transforming education with the power of artificial intelligence.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              ©2025 AI School. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;