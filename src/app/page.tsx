import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import { AnimatedSection } from "@/components/ui/animated-section";
import { AnimatedIcon } from "@/components/ui/animated-icon";
import Aurora from "@/components/ui/aurora";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { AnimatedCard } from "@/components/ui/animated-card";
import { FeaturesSection } from "@/components/ui/features-section";
import SpotlightCard from "@/components/ui/spotlight-card";
import { ArrowRight, Brain, CheckCircle, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";
import { CTASection } from "@/components/ui/cta-section";

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

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden ">
          <div className="absolute inset-0 -z-10">
            <Aurora
              colorStops={["#FF6B00", "#FFA500", "#FF4500"]}
              blend={1.0}
              amplitude={0.5}
              speed={0.3}
            />
          </div>
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 px-6 py-16 sm:px-6 lg:py-60 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <AnimatedHeading className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  Create Smart Quizzes with{" "}
                  <span className="text-primary">AI</span>
                </AnimatedHeading>
                <AnimatedHeading
                  delay={0.2}
                  className="mt-6 text-lg leading-8 text-gray-300"
                >
                  Quizz AI helps you create effective tests for learning and
                  knowledge assessment. Harness the power of artificial
                  intelligence to generate questions and answers.
                </AnimatedHeading>
                <AnimatedHeading
                  delay={0.4}
                  className="mt-10 flex items-center justify-center gap-x-6"
                >
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="gap-2 bg-primary hover:bg-primary/90"
                    >
                      Start Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-semibold leading-6 text-white"
                  >
                    Learn More <span aria-hidden="true">→</span>
                  </Link>
                </AnimatedHeading>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-background py-24 sm:py-32">
          <FeaturesSection />
        </section>

        {/* Testimonials Section */}
        <section className="bg-background py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by Educators Worldwide
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                See what our users have to say about Quizz AI
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <AnimatedCard
                  key={testimonial.name}
                  delay={index * 0.2}
                  className="flex flex-col justify-between bg-zinc-900 p-10 shadow-lg rounded-2xl"
                >
                  <div>
                    <div className="flex items-center gap-x-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="mt-6 text-base leading-7 text-gray-300">
                      {testimonial.content}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-primary fill-primary"
                      />
                    ))}
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-background py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Choose the plan that works best for you
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              {pricing.slice(0, 2).map((plan, index) => (
                <AnimatedCard
                  key={plan.name}
                  delay={index * 0.2}
                >
                  <SpotlightCard
                    className="custom-spotlight-card"
                    spotlightColor="#ff6a008d"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-semibold leading-8 text-white">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline gap-x-1">
                          <span className="text-4xl font-bold tracking-tight text-white">
                            {plan.price}
                          </span>
                          <span className="text-sm font-semibold leading-6 text-gray-400">
                            /month
                          </span>
                        </div>
                      </div>

                      <p className="text-base leading-6 text-gray-300 mb-8">
                        {plan.description}
                      </p>

                      <div className="flex-grow">
                        <ul
                          role="list"
                          className="space-y-4 text-sm leading-6 text-gray-300"
                        >
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-x-3"
                            >
                              <CheckCircle className="h-5 w-5 flex-none text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10">
                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          variant="default"
                        >
                          {plan.name === "Free" ? "Get Started" : "Upgrade Now"}
                        </Button>
                      </div>
                    </div>
                  </SpotlightCard>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
