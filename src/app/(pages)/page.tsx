import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { AnimatedSection } from "@/components/ui/animated-section";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { AnimatedCard } from "@/components/ui/animated-card";
import { FeaturesSection } from "@/components/sections/features-section";
import SpotlightCard from "@/components/ui/spotlight-card";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  FileText,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/sections/cta-section";
import SubscriptionSection from "@/components/sections/subscription-section";
import { LoginModal } from "@/components/auth/login-modal";

export default function Home() {
  const features = [
    {
      title: "AI-Powered Quizzes",
      description: "Create quizzes using artificial intelligence in seconds",
      icon: Brain,
    },
    {
      title: "Smart Analytics",
      description: "Get detailed statistics and result analysis",
      icon: Sparkles,
    },
    {
      title: "Easy to Use",
      description: "Intuitive interface for creating and managing quizzes",
      icon: CheckCircle,
    },
  ];

  const testimonials = [
    {
      name: "John Doe",
      role: "Teacher",
      content:
        "Quizz AI has revolutionized how I create tests for my students. It's incredibly efficient!",
      image: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    },
    {
      name: "Sarah Smith",
      role: "Education Consultant",
      content:
        "The analytics provided by Quizz AI help me understand student performance better than ever before.",
      image: "https://ui-avatars.com/api/?name=Sarah+Smith&background=random",
    },
    {
      name: "Mike Johnson",
      role: "University Professor",
      content:
        "This platform has saved me countless hours in quiz preparation. Highly recommended!",
      image: "https://ui-avatars.com/api/?name=Mike+Johnson&background=random",
    },
  ];

  const pricing = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out Quizz AI",
      features: [
        "5 quizzes per month",
        "Basic analytics",
        "Email support",
        "Standard features",
      ],
    },
    {
      name: "Pro",
      price: "$7",
      description: "For professional educators",
      features: [
        "Unlimited quizzes",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
      ],
    },
  ];

  const faqs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer:
        "We strive to respond to all inquiries within 24 hours on business days. For urgent technical support questions, we typically respond much faster.",
    },
    // {
    //   question: "Can I request a product demonstration?",
    //   answer:
    //     "Yes, we'd be happy to provide a demonstration of Quizzley for you or your team. Fill out the form above indicating 'Demo Request' in the subject, and we'll arrange a presentation.",
    // },
    {
      question: "How do I report a technical issue?",
      answer:
        "The best way to let us know is through our feedback form (select the 'Contact' topic) or directly from your Dashboard. Please provide a clear subject and as many details as you can so we can help you faster.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden h-screen flex items-center justify-center">
          {/* Animated Floating Elements */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Top Left */}
            <div className="animate-float-slow absolute top-[10%] md:top-[20%] left-[15%] md:left-[25%] opacity-60 transform rotate-[10deg]">
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-2 md:p-3 border border-white/10 shadow-2xl">
                <FileText className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
            </div>

            {/* Top Right */}
            <div className="animate-float absolute top-[15%] md:top-[25%] right-[15%] md:right-[45%] opacity-60 transform rotate-[-5deg]">
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-2 md:p-3 border border-white/10 shadow-2xl">
                <Brain className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
            </div>

            {/* Bottom Left */}
            <div className="animate-float-fast absolute bottom-[35%] md:bottom-[25%] left-[10%] md:left-[30%] opacity-60 transform rotate-[5deg] hidden sm:block">
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-2 md:p-3 border border-white/10 shadow-2xl">
                <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
            </div>

            {/* Bottom Right */}
            <div className="animate-float absolute bottom-[20%] md:bottom-[40%] right-[20%] md:right-[50%] opacity-60 transform rotate-[-8deg] hidden sm:block">
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-2 md:p-3 border border-white/10 shadow-2xl">
                <Star className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="w-full max-w-7xl relative z-10">
            <div className="px-6 gap-16 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-evenly">
              <div className="mx-auto max-w-xl text-center md:text-left md:mx-0 md:max-w-md">
                <AnimatedHeading className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Create Smart Quizzes with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                    AI
                  </span>
                </AnimatedHeading>
                <AnimatedHeading
                  delay={0.2}
                  className="mt-6 text-lg leading-8 text-gray-300"
                >
                  Quizzley helps you create effective tests for learning and
                  knowledge assessment. Harness the power of artificial
                  intelligence to generate questions and answers.
                </AnimatedHeading>

                {/* Stats Counter Section */}
                {/* <div className="mt-8 grid grid-cols-3 gap-4 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-center">
                    <AnimatedHeading
                      delay={0.3}
                      className="text-2xl md:text-3xl font-bold text-white"
                    >
                      10k+
                    </AnimatedHeading>
                    <p className="text-xs md:text-sm mt-1 text-gray-300">
                      Созданных тестов
                    </p>
                  </div>
                  <div className="text-center">
                    <AnimatedHeading
                      delay={0.4}
                      className="text-2xl md:text-3xl font-bold text-white"
                    >
                      98%
                    </AnimatedHeading>
                    <p className="text-xs md:text-sm mt-1 text-gray-300">
                      Точность ИИ
                    </p>
                  </div>
                  <div className="text-center">
                    <AnimatedHeading
                      delay={0.5}
                      className="text-2xl md:text-3xl font-bold text-white"
                    >
                      5000+
                    </AnimatedHeading>
                    <p className="text-xs md:text-sm mt-1 text-gray-300">
                      Довольных пользователей
                    </p>
                  </div>
                </div> */}

                <AnimatedHeading
                  delay={0.6}
                  className="mt-12 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6"
                >
                  <LoginModal>
                    <Button
                      size="lg"
                      className="text-lg px-8 py-7 gap-3 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-500 text-white shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 rounded-full border border-white/10 font-semibold"
                    >
                      Start Free
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </LoginModal>
                  <Link
                    href="/features"
                    className="text-base font-semibold leading-6 text-white bg-white/10 px-8 py-4 rounded-full border border-white/10 hover:bg-white/15 hover:text-primary transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                  >
                    Learn More{" "}
                    <span
                      aria-hidden="true"
                      className="ml-1"
                    >
                      →
                    </span>
                  </Link>
                </AnimatedHeading>
              </div>

              {/* Preview Cards/Question Example */}
              <div className="hidden md:block relative mt-12 md:mt-0">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-orange-600 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-zinc-900/70 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-4 text-sm text-gray-400">
                      AI-Generated Quiz
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Which planet has the most moons?
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 rounded bg-white/5 border border-white/10">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3"></div>
                        <span className="text-gray-300">Earth</span>
                      </div>
                      <div className="flex items-center p-2 rounded bg-white/5 border border-white/10">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3"></div>
                        <span className="text-gray-300">Mars</span>
                      </div>
                      <div className="flex items-center p-2 rounded bg-primary/10 border border-primary/30">
                        <div className="w-4 h-4 rounded-full border-2 border-primary mr-3 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-primary">Saturn</span>
                      </div>
                      <div className="flex items-center p-2 rounded bg-white/5 border border-white/10">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-3"></div>
                        <span className="text-gray-300">Jupiter</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button className="text-sm text-gray-400 hover:text-white transition-colors cursor-none">
                      Skip
                    </button>
                    <button className="bg-gradient-to-r from-primary to-orange-600 px-4 py-2 rounded-lg text-white font-medium cursor-default">
                      Next Question
                    </button>
                  </div>
                </div>

                {/* Second card with floating effect */}
                <div className="absolute -bottom-10 -left-20 w-64 h-40 bg-zinc-900/70 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-xl transform rotate-[-8deg] animate-float-slow">
                  <div className="flex items-center mb-2">
                    <Brain className="h-5 w-5 text-primary mr-2" />
                    <div className="text-xs text-gray-400">Processing AI</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-white/10 rounded-full w-full"></div>
                    <div className="h-2 bg-white/10 rounded-full w-[80%]"></div>
                    <div className="h-2 bg-primary/30 rounded-full w-[60%]"></div>
                    <div className="h-2 bg-white/10 rounded-full w-[70%]"></div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-b from-zinc-950 to-background py-20 sm:py-24 relative">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <FeaturesSection />
        </section>

        {/* Image Showcase Section */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto w-2/3 mb-4"></div>

        <AnimatedSection className="bg-background py-20 sm:py-24 relative">
          <div
            className="absolute top-2 left-1/2 sm:top-10 sm:left-1/3 w-32 h-32 sm:w-72 sm:h-72
                bg-primary/20 rounded-full blur-xl sm:blur-3xl opacity-20 sm:opacity-30 pointer-events-none
              "
          ></div>
          <div
            className="absolute bottom-2 right-1/2 sm:bottom-10 sm:right-1/3 w-36 h-36 sm:w-80 sm:h-80 bg-orange-600/20 rounded-full blur-xl sm:blur-3xl opacity-20 sm:opacity-30 pointer-events-none
              "
          ></div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
                See{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  Quizzley
                </span>{" "}
                in Action
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Experience our intuitive interface and powerful features
              </p>
            </div>

            <div className="grid grid-cols- gap-8 lg:grid-cols-2">
              {/* Image Placeholder 1 */}
              <AnimatedCard
                delay={0.1}
                className="flex flex-col"
              >
                <div className="aspect-video overflow-hidden rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-xl shadow-black/20 hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative">
                  {/* <div className="text-secondary text-center p-8">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                    <p className="text-lg font-medium">
                      Document Upload Interface
                    </p>
                    <p className="text-sm mt-2">
                      Image showing the easy document upload process
                    </p>
                  </div> */}
                  <Image
                    src="/images/landing/Doc_Upload.png"
                    alt="Quizz Dashboard"
                    className="object-contain rounded-lg"
                    width={600}
                    height={338}
                    priority
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>{" "}
                  Effortless Document Uploading
                </h3>
                <p className="mt-2 text-gray-300">
                  Our intuitive drag-and-drop interface makes getting started
                  with your quizzes quick and simple.
                </p>
              </AnimatedCard>

              {/* Image Placeholder 2 */}
              <AnimatedCard
                delay={0.3}
                className="flex flex-col"
              >
                <div className="aspect-video overflow-hidden rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-xl shadow-black/20 hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative">
                  {/* <div className="text-secondary text-center p-8">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                    <p className="text-lg font-medium">
                      Quiz Question Showcase
                    </p>
                    <p className="text-sm mt-2">
                      Image showing generated quiz questions and answer options
                    </p>
                  </div> */}
                  <Image
                    src="/images/landing/Question_Showcase.png"
                    alt="Quiz Generation Example"
                    className="object-contain rounded-lg"
                    width={600}
                    height={338}
                    priority
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>{" "}
                  Intelligent Question Generation
                </h3>
                <p className="mt-2 text-gray-300">
                  Test your knowledge with dynamically created questions and get
                  instant, corrective feedback on every answer you give.
                </p>
              </AnimatedCard>

              {/* Image Placeholder 3 */}
              <AnimatedCard
                delay={0.2}
                className="flex flex-col"
              >
                <div className="aspect-video overflow-hidden rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-xl shadow-black/20 hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative">
                  {/* <div className="text-secondary text-center p-8">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                    <p className="text-lg font-medium">
                      AI Processing Visualization
                    </p>
                    <p className="text-sm mt-2">
                      Image showing AI analyzing document contents
                    </p>
                  </div> */}
                  <Image
                    src="/images/landing/Quizz_Results.png"
                    alt="AI Analysis Process"
                    className="object-contain rounded-lg"
                    width={600}
                    height={338}
                    priority
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>{" "}
                  Advanced Results
                </h3>
                <p className="mt-2 text-gray-300">
                  Get an instant, visual summary of your quiz performance with a
                  detailed score breakdown and actionable recommendations.
                </p>
              </AnimatedCard>

              {/* Image Placeholder 4 */}
              <AnimatedCard
                delay={0.4}
                className="flex flex-col"
              >
                <div className="aspect-video overflow-hidden rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-xl shadow-black/20 hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative">
                  {/* <div className="text-secondary text-center p-8">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                    <p className="text-lg font-medium">Analytics Dashboard</p>
                    <p className="text-sm mt-2">
                      Image showing detailed performance analytics
                    </p>
                  </div> */}
                  <Image
                    src="/images/landing/User_Dashboard.png"
                    alt="Analytics Dashboard"
                    className="object-contain rounded-lg"
                    width={600}
                    height={338}
                    priority
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>{" "}
                  Comprehensive Analytics
                </h3>
                <p className="mt-2 text-gray-300">
                  Track progress and performance with our detailed reporting and
                  analytics dashboard.
                </p>
              </AnimatedCard>
            </div>
          </div>
        </AnimatedSection>

        {/* How It Works Section */}
        <AnimatedSection className="bg-gradient-to-l from-background to-zinc-950 py-20 sm:py-24 relative">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
                How{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  Quizzley
                </span>{" "}
                Works
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Our streamlined process makes quizz creation effortless
              </p>
            </div>
            <div className="relative mx-auto max-w-2xl">
              {/* Timeline line */}
              <div className="absolute left-0 top-4 bottom-4 rounded-full w-1 bg-gradient-to-b from-primary via-primary/50 to-primary/30"></div>

              <AnimatedCard
                delay={0.1}
                className="relative mb-16 ml-8 pl-8"
              >
                <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-primary to-orange-500 shadow-lg shadow-primary/20">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Upload Your Document
                </h3>
                <p className="text-gray-300">
                  Simply upload your PDF, through our intuitive interface.
                </p>
              </AnimatedCard>

              <AnimatedCard
                delay={0.2}
                className="relative mb-16 ml-8 pl-8"
              >
                <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-primary to-orange-500 shadow-lg shadow-primary/20">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  AI Analysis
                </h3>
                <p className="text-gray-300">
                  Our advanced AI processes the document, identifying key
                  concepts, important facts, and knowledge points to create
                  meaningful questions.
                </p>
              </AnimatedCard>

              <AnimatedCard
                delay={0.3}
                className="relative mb-16 ml-8 pl-8"
              >
                <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-primary to-orange-500 shadow-lg shadow-primary/20">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Quiz Generation
                </h3>
                <p className="text-gray-300">
                  Quizzley automatically generates relevant and challenging
                  questions with accurate answers based on the content,
                  customized to your preferences.
                </p>
              </AnimatedCard>

              <AnimatedCard
                delay={0.4}
                className="relative ml-8 pl-8"
              >
                <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-primary to-orange-500 shadow-lg shadow-primary/20">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Use and Share
                </h3>
                <p className="text-gray-300">
                  Take the quiz yourself, share it with students, or analyze
                  results through our comprehensive dashboard to track
                  performance and progress.
                </p>
              </AnimatedCard>
            </div>
          </div>
        </AnimatedSection>

        {/* Pricing Section */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent  mx-auto w-4/5 my-8"></div>

        <SubscriptionSection />

        {/* FAQ Section */}
        <section className="bg-gradient-to-b from-background to-zinc-950 py-20 sm:py-24 relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
                Frequently Asked{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  Questions
                </span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Answers to the most common questions
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="grid gap-6">
                {faqs.map((faq, index) => (
                  <AnimatedCard
                    key={faq.question}
                    delay={index * 0.1}
                    className="flex flex-col"
                  >
                    <div className="rounded-xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 p-6 ring-1 ring-white/10 shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                      <h3 className="text-lg font-medium text-white mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
