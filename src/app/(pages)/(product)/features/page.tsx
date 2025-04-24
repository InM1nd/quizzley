"use client";

import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import { AnimatedSection } from "@/components/ui/animated-section";
import SpotlightCard from "@/components/ui/spotlight-card";
import Aurora from "@/components/ui/aurora";
import Footer from "@/components/footer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  CheckCircle,
  FileText,
  BarChart3,
  Upload,
  Zap,
  Award,
  Users,
  Clock,
  ArrowRight,
  Scan,
  Database,
} from "lucide-react";

const FeaturesPage = () => {
  const mainFeatures = [
    {
      title: "AI-Powered Quiz Generation",
      description:
        "Upload any document and instantly generate comprehensive quizzes with precise questions and answers using our advanced AI technology.",
      icon: Brain,
    },
    {
      title: "Detailed Analytics",
      description:
        "Track performance with comprehensive analytics including completion rates, average scores, and improvement metrics for better educational outcomes.",
      icon: BarChart3,
    },
    {
      title: "Smart Document Processing",
      description:
        "Our system intelligently processes PDF documents, extracting key concepts and important information to create relevant questions.",
      icon: FileText,
    },
    {
      title: "Customizable Options",
      description:
        "Tailor quizzes to your specific needs with adjustable difficulty levels, question types, and focusing on particular sections of content.",
      icon: Sparkles,
    },
  ];

  const additionalFeatures = [
    {
      title: "Simple Document Upload",
      description:
        "Drag-and-drop interface makes uploading your documents quick and effortless.",
      icon: Upload,
    },
    {
      title: "Instant Generation",
      description:
        "Get your quiz ready in seconds, not minutes or hours, saving valuable time.",
      icon: Zap,
    },
    {
      title: "High-Quality Questions",
      description:
        "Our AI generates relevant, challenging, and educational questions based on your content.",
      icon: Award,
    },
    {
      title: "Collaborative Learning",
      description:
        "Share quizzes with students, colleagues, or study groups to enhance the learning experience.",
      icon: Users,
    },
    {
      title: "Time-Saving",
      description:
        "Reduce quiz creation time by up to 90% compared to traditional manual methods.",
      icon: Clock,
    },
    {
      title: "Intelligent Scanning",
      description:
        "Advanced AI technology recognizes and analyzes key concepts in your documents with exceptional accuracy.",
      icon: Scan,
    },
    {
      title: "Quiz History",
      description:
        "Access all your previously created quizzes from your personal dashboard anytime.",
      icon: Database,
    },
    {
      title: "User-Friendly Interface",
      description:
        "Clean, modern design that's intuitive and easy to navigate for users of all technical levels.",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:pb-32 sm:pt-36">
        <div className="absolute inset-0 -z-10">
          <Aurora
            colorStops={["#FF6B00", "#FFA500", "#FF4500"]}
            blend={1.0}
            amplitude={0.5}
            speed={0.3}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative z-10 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <AnimatedHeading className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Powerful Features for
                <span className="text-primary"> Efficient Learning</span>
              </AnimatedHeading>
              <AnimatedHeading
                delay={0.2}
                className="mt-6 text-lg leading-8 text-gray-300"
              >
                Discover how Quizzley leverages artificial intelligence to
                transform the way you create and manage quizzes, making
                education more engaging and effective.
              </AnimatedHeading>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Core Features
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Our platform offers a comprehensive suite of tools designed to
              streamline quiz creation and enhance learning outcomes.
            </p>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {mainFeatures.map((feature, index) => (
              <AnimatedCard
                key={feature.title}
                delay={index * 0.1}
                className="flex flex-col"
              >
                <SpotlightCard className="h-full p-8">
                  <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white mb-4">
                    <AnimatedIcon icon={feature.icon} />
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </SpotlightCard>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <AnimatedSection className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              See Quizzley in Action
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Experience our intuitive interface and powerful features
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Image Placeholder 1 */}
            <AnimatedCard
              delay={0.1}
              className="flex flex-col"
            >
              <div className="aspect-video overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                <div className="text-zinc-500 text-center p-8">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium">
                    Document Upload Interface
                  </p>
                  <p className="text-sm mt-2">
                    Image showing the easy document upload process
                  </p>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Effortless Document Uploading
              </h3>
              <p className="mt-2 text-gray-300">
                Our intuitive drag-and-drop interface makes getting started with
                your quizzes quick and simple.
              </p>
            </AnimatedCard>

            {/* Image Placeholder 2 */}
            <AnimatedCard
              delay={0.2}
              className="flex flex-col"
            >
              <div className="aspect-video overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                <div className="text-zinc-500 text-center p-8">
                  <Brain className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium">
                    AI Processing Visualization
                  </p>
                  <p className="text-sm mt-2">
                    Image showing AI analyzing document contents
                  </p>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Advanced AI Analysis
              </h3>
              <p className="mt-2 text-gray-300">
                Watch as our AI technology intelligently processes your
                documents to create perfect quiz questions.
              </p>
            </AnimatedCard>

            {/* Image Placeholder 3 */}
            <AnimatedCard
              delay={0.3}
              className="flex flex-col"
            >
              <div className="aspect-video overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                <div className="text-zinc-500 text-center p-8">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium">Quiz Question Showcase</p>
                  <p className="text-sm mt-2">
                    Image showing generated quiz questions and answer options
                  </p>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Intelligent Question Generation
              </h3>
              <p className="mt-2 text-gray-300">
                Our system creates varied question types with multiple-choice,
                true/false, and short answer formats.
              </p>
            </AnimatedCard>

            {/* Image Placeholder 4 */}
            <AnimatedCard
              delay={0.4}
              className="flex flex-col"
            >
              <div className="aspect-video overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                <div className="text-zinc-500 text-center p-8">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium">Analytics Dashboard</p>
                  <p className="text-sm mt-2">
                    Image showing detailed performance analytics
                  </p>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
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

      {/* Additional Features Grid */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Explore all the features that make Quizzley the preferred choice
              for educators and learners.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {additionalFeatures.map((feature, index) => (
              <AnimatedCard
                key={feature.title}
                delay={index * 0.05}
                className="flex flex-col"
              >
                <div className="rounded-xl bg-zinc-900/80 p-6 ring-1 ring-white/10 h-full">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <AnimatedIcon icon={feature.icon} />
                    {feature.title}
                  </dt>
                  <dd className="mt-4 text-sm text-gray-300">
                    {feature.description}
                  </dd>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <AnimatedSection className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How Quizzley Works
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Our streamlined process makes quiz creation effortless
            </p>
          </div>
          <div className="relative mx-auto max-w-2xl">
            {/* Timeline line */}
            <div className="absolute rounded-full left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary/30"></div>
            <AnimatedCard
              delay={0.1}
              className="relative mb-16 ml-8 pl-8"
            >
              <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Upload Your Document
              </h3>
              <p className="text-gray-300">
                Simply upload your PDF, textbook, or article through our
                intuitive interface. We support various document formats to
                accommodate your needs.
              </p>
            </AnimatedCard>

            <AnimatedCard
              delay={0.2}
              className="relative mb-16 ml-8 pl-8"
            >
              <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary">
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
              <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Quiz Generation
              </h3>
              <p className="text-gray-300">
                Quizzley automatically generates relevant and challenging
                questions with accurate answers based on the content, customized
                to your preferences.
              </p>
            </AnimatedCard>

            <AnimatedCard
              delay={0.4}
              className="relative ml-8 pl-8"
            >
              <div className="absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary">
                <span className="text-white font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Use and Share
              </h3>
              <p className="text-gray-300">
                Take the quiz yourself, share it with students, or analyze
                results through our comprehensive dashboard to track performance
                and progress.
              </p>
            </AnimatedCard>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Quiz Creation?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Join thousands of educators and learners who are already saving
              time and improving results with Quizzley.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/api/auth/signin?callbackUrl=/dashboard">
                <Button
                  size="lg"
                  variant="neo"
                  className="w-full text-white font-semibold text-lg py-6 px-8 my-12 rounded-full"
                >
                  Get Started Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
