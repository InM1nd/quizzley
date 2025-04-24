"use client";

import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { AnimatedSection } from "@/components/ui/animated-section";
import Aurora from "@/components/ui/aurora";
import Footer from "@/components/footer";
import Image from "next/image";
import {
  Code,
  Lightbulb,
  Users,
  BookOpen,
  Award,
  Star,
  Heart,
} from "lucide-react";

const AboutUsPage = () => {
  const teamMembers = [
    {
      name: "Oleksandr Zabolotnyi",
      role: "Founder & Lead Developer",
      bio: "Software engineer with a passion for education and AI technology. Created Quizzley to help educators save time and improve learning outcomes.",
      image: "/placeholder-profile.jpg", // Плейсхолдер для будущей замены
    },
  ];

  const values = [
    {
      title: "Education First",
      description:
        "We believe in the power of education to transform lives. Every feature we develop is designed to enhance the learning experience.",
      icon: BookOpen,
    },
    {
      title: "Innovation",
      description:
        "We constantly explore new technologies and methodologies to improve our platform and provide cutting-edge solutions.",
      icon: Lightbulb,
    },
    {
      title: "User-Centered",
      description:
        "Our users' needs drive every decision we make. We actively listen to feedback and continuously improve our platform.",
      icon: Users,
    },
    {
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from code quality to user experience and customer support.",
      icon: Award,
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
                About <span className="text-primary">Quizzley</span>
              </AnimatedHeading>
              <AnimatedHeading
                delay={0.2}
                className="mt-6 text-lg leading-8 text-gray-300"
              >
                Leveraging AI to revolutionize education and make quiz creation
                effortless
              </AnimatedHeading>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <AnimatedSection className="bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
            <div>
              <p className="text-gray-300 mb-6">
                Quizzley was born from a simple observation: educators spend
                hours creating quizzes and assessments that could be automated
                with the right technology. As a software developer with friends
                in education, I witnessed firsthand the challenges teachers face
                with limited time and resources.
              </p>
              <p className="text-gray-300 mb-6">
                The initial concept was straightforward - use AI to analyze
                educational documents and automatically generate high-quality
                quiz questions. What started as a weekend project quickly
                evolved as early users provided valuable feedback and requested
                more features.
              </p>
              <p className="text-gray-300">
                Today, Quizzley has grown into a comprehensive platform that
                helps educators save time, create engaging assessments, and
                analyze student performance - all powered by cutting-edge AI
                technology.
              </p>
            </div>

            {/* Image Placeholder */}
            <div className="relative w-full h-[550px] overflow-hidden rounded-lg">
              <Image
                src="/images/About_Pic_1.png"
                alt="Quizzley Logo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Mission & Vision Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <AnimatedCard
              delay={0.1}
              className="flex flex-col"
            >
              <div className="rounded-xl bg-zinc-900/80 p-8 ring-1 ring-white/10 h-full">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Star className="h-6 w-6 text-primary mr-2" />
                  Our Mission
                </h3>
                <p className="text-gray-300">
                  Our mission is to empower educators with AI-powered tools that
                  save time and enhance the learning experience. We believe that
                  by automating routine tasks like quiz creation, teachers can
                  focus more on what truly matters - connecting with students
                  and providing personalized guidance.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard
              delay={0.2}
              className="flex flex-col"
            >
              <div className="rounded-xl bg-zinc-900/80 p-8 ring-1 ring-white/10 h-full">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Heart className="h-6 w-6 text-primary mr-2" />
                  Our Vision
                </h3>
                <p className="text-gray-300">
                  We envision a future where AI seamlessly integrates with
                  education, making high-quality learning resources accessible
                  to everyone. Quizzley aims to be at the forefront of this
                  transformation, continuously innovating to create tools that
                  adapt to the evolving needs of modern education.
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <AnimatedSection className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              The principles that guide everything we do
            </p>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {values.map((value, index) => (
              <AnimatedCard
                key={value.title}
                delay={index * 0.1}
                className="flex flex-col"
              >
                <div className="rounded-xl bg-zinc-900/80 p-6 ring-1 ring-white/10 h-full">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <value.icon className="h-6 w-6 text-primary" />
                    {value.title}
                  </dt>
                  <dd className="mt-4 text-sm text-gray-300">
                    {value.description}
                  </dd>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Meet the Team Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Meet the Team
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              The people behind Quizzley
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            {teamMembers.map((member, index) => (
              <AnimatedCard
                key={member.name}
                delay={index * 0.1}
                className="flex flex-col mb-8"
              >
                <div className="rounded-xl bg-zinc-900/80 p-8 ring-1 ring-white/10">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                      <div className="text-zinc-500 text-center">
                        <Code className="h-12 w-12 mx-auto opacity-40" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="text-primary mb-4">{member.role}</p>
                      <p className="text-gray-300">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      {/* <AnimatedSection className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Technology
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Built with modern tools for performance and reliability
            </p>
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl bg-zinc-900/80 p-8 ring-1 ring-white/10">
              <p className="text-gray-300 mb-6">
                Quizzley is built with cutting-edge technologies that enable
                robust features and a smooth user experience:
              </p>

              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <Code className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <span className="font-semibold">Next.js Framework:</span>{" "}
                    For fast, server-rendered React applications with excellent
                    performance and SEO capabilities.
                  </div>
                </li>
                <li className="flex items-start">
                  <Code className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <span className="font-semibold">AI Integration:</span>{" "}
                    Utilizing advanced natural language processing models to
                    analyze documents and generate high-quality quiz questions.
                  </div>
                </li>
                <li className="flex items-start">
                  <Code className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <span className="font-semibold">Tailwind CSS:</span> For a
                    beautiful, responsive design that works flawlessly across
                    all devices.
                  </div>
                </li>
                <li className="flex items-start">
                  <Code className="h-6 w-6 text-primary mr-3 mt-0.5" />
                  <div>
                    <span className="font-semibold">PostgreSQL Database:</span>{" "}
                    Ensuring robust data storage and fast retrieval for all user
                    content.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection> */}

      <Footer />
    </div>
  );
};

export default AboutUsPage;
