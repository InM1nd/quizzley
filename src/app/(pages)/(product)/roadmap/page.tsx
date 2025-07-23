"use client";

import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { AnimatedSection } from "@/components/ui/animated-section";
import Footer from "@/components/footer";
import {
  ChevronRight,
  BarChart3,
  Users,
  Smartphone,
  Link as LinkIcon,
  Zap,
  Globe,
  ShieldCheck,
  BookOpen,
  FileText,
  Brain,
  CheckCircle2,
  Clock,
  Code,
  PenTool,
  Bell,
  Mic,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const RoadmapPage = () => {
  const router = useRouter();
  // Data about planned features with estimated timelines
  const roadmapItems = [
    {
      quarter: "Q2 2025",
      title: "MVP Launch",
      description:
        "Launch of the minimum viable product with core features for creating AI-powered quizzes based on documents.",
      status: "completed",
      features: [
        {
          title: "Basic AI for Quizz Creation",
          description:
            "Algorithm for generating simple single-choice questions",
          icon: Brain,
        },
        {
          title: "Simple Document Analyzer",
          description: "Ability to upload and analyze PDF documents",
          icon: FileText,
        },
        {
          title: "User Accounts",
          description: "User registration and authentication system",
          icon: Users,
        },
      ],
    },
    {
      quarter: "Q3 2025",
      title: "Core Functionality Improvement",
      description:
        "Expansion of core features and improved user interface based on early user feedback.",
      status: "in-progress",
      features: [
        {
          title: "Enhanced AI Engine",
          description:
            "More accurate and diverse question types (true/false, short answer, matching)",
          icon: Brain,
        },
        {
          title: "Basic Analytics",
          description: "Simple metrics for tracking student results",
          icon: BarChart3,
        },
        {
          title: "Improved UX/UI",
          description: "User interface improvements for greater intuitiveness",
          icon: PenTool,
        },
      ],
    },
    {
      quarter: "Q4 2025",
      title: "Advanced Analytics",
      description:
        "Launch of in-depth analytics tools to help educators understand student progress and weak points.",
      status: "planned",
      features: [
        {
          title: "Detailed Performance Reports",
          description: "Visualization of results and progress over time",
          icon: BarChart3,
        },
        {
          title: "AI Recommendations",
          description:
            "Automatic recommendations for improving learning based on test results",
          icon: Brain,
        },
        {
          title: "Data Export",
          description:
            "Ability to export analytics in various formats (CSV, PDF)",
          icon: FileText,
        },
      ],
    },
    {
      quarter: "Q1 2026",
      title: "Podcast Features and Collaborative Quizzes",
      description: "Implementation of tools for creating podcasts from text.",
      status: "planned",
      features: [
        {
          title: "Podcast Creation",
          description: "Ability to create podcasts from text and documents",
          icon: Mic,
        },
        {
          title: "Enhanced Quizz Creation",
          description: "Tools for discussing and improving tests within a team",
          icon: FileText,
        },
        {
          title: "Flashcards",
          description: "Ability to create flashcards from documents",
          icon: Zap,
        },
      ],
    },
    {
      quarter: "2026 and Beyond",
      title: "Mobile Application",
      description:
        "Launch of native mobile apps for iOS and Android for working with quizzes on the go.",
      status: "vision",
      features: [
        {
          title: "Mobile Editor",
          description: "Ability to create and edit tests from mobile devices",
          icon: Smartphone,
        },
        {
          title: "Offline Mode",
          description: "Access to saved tests without an internet connection",
          icon: CheckCircle2,
        },
        {
          title: "Push Notifications",
          description: "Timely alerts about student results and activity",
          icon: Bell,
        },
      ],
    },
    // {
    //   quarter: "Q4 2024",
    //   title: "Integration Ecosystem",
    //   description:
    //     "Development of API and integrations with popular LMS and educational platforms.",
    //   status: "planned",
    //   features: [
    //     {
    //       title: "Developer API",
    //       description:
    //         "Public API for creating custom solutions and integrations",
    //       icon: Code,
    //     },
    //     {
    //       title: "LMS Integrations",
    //       description:
    //         "Direct integrations with Canvas, Moodle, Google Classroom, and others",
    //       icon: LinkIcon,
    //     },
    //     {
    //       title: "Single Sign-On (SSO)",
    //       description:
    //         "Support for single sign-on for educational institutions",
    //       icon: ShieldCheck,
    //     },
    //   ],
    // },
    // {
    //   quarter: "2025 and Beyond",
    //   title: "Future Prospects",
    //   description:
    //     "Long-term ambitious plans to transform educational technology.",
    //   status: "vision",
    //   features: [
    //     {
    //       title: "AI Personalized Learning",
    //       description:
    //         "Fully adaptive tests that adjust to individual student needs",
    //       icon: Brain,
    //     },
    //     {
    //       title: "Global Content Library",
    //       description:
    //         "Community for sharing educational resources among teachers worldwide",
    //       icon: Globe,
    //     },
    //     {
    //       title: "Enhanced Accessibility",
    //       description:
    //         "Tools for maximum accessibility of educational content for all students",
    //       icon: Users,
    //     },
    //   ],
    // },
  ];

  // Status badge icon
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20 w-24">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </span>
      );
    } else if (status === "in-progress") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 w-24">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </span>
      );
    } else if (status === "planned") {
      return (
        <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-400 ring-1 ring-inset ring-orange-500/20 w-24">
          <Clock className="h-3 w-3 mr-1" />
          Planned
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20 w-24">
          <Zap className="h-3 w-3 mr-1" />
          Vision
        </span>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:pb-32 sm:pt-36">
        <div className="absolute inset-0 -z-10"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative z-10 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <AnimatedHeading className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                <span className="text-primary">Quizzley</span> Roadmap
              </AnimatedHeading>
              <AnimatedHeading
                delay={0.2}
                className="mt-6 text-lg leading-8 text-gray-300"
              >
                We are constantly working to improve Quizzley, based on user
                feedback and modern trends in education. Below is our roadmap
                with development plans for the coming years.
              </AnimatedHeading>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <AnimatedSection className="">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xl text-gray-300">
              Here is our development plan and future updates to create the best
              platform for education improvement!
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute left-12 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/80 via-primary/40 to-primary/10 hidden md:block"></div>

            {roadmapItems.map((item, index) => (
              <AnimatedCard
                key={item.quarter}
                delay={index * 0.1}
                className="relative mb-16 md:ml-24 md:pl-8"
              >
                <div className="absolute left-0 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary hidden md:flex">
                  <ChevronRight className="h-5 w-5 text-white" />
                </div>

                <div className="rounded-xl bg-zinc-900/80 p-6 ring-1 ring-white/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                    <div>
                      <span className="text-sm text-primary font-medium inline-block mb-2">
                        {item.quarter}
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <p className="text-gray-300 mb-8">{item.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {item.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="rounded-lg bg-zinc-800/50 p-4 ring-1 ring-white/5"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <feature.icon className="h-5 w-5 text-primary" />
                          <h4 className="text-base font-medium text-white">
                            {feature.title}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <AnimatedSection className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your Voice Matters
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Our roadmap evolves based on user feedback. If you have ideas or
              suggestions about features you would like to see in Quizzley, we
              would love to hear your opinion!
            </p>
            <div className="mt-8 inline-block ">
              <Button
                size="lg"
                className="text-lg px-8 py-7 gap-3 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-500 text-white shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 rounded-full border border-white/10 font-semibold"
                onClick={() => router.push("/contact")}
              >
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default RoadmapPage;
