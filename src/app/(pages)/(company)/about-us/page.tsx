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
  Github,
  Linkedin,
  Send,
} from "lucide-react";

const AboutUsPage = () => {
  const teamMembers = [
    {
      name: "Oleksandr Zabolotnyi",
      role: "Founder & Lead Developer",
      bio: "Front-end Developer based in Vienna. Passionate about building AI-driven tools that make education more accessible and effective. Created Quizzley to help students prepare for exams and seminars faster and smarter.",
      image: "/placeholder-profile.jpg", // заменишь, когда будет фото
      socialLinks: [
        {
          name: "GitHub",
          url: "https://github.com/zabolotnyi-oleksandr",
          icon: "github",
        },
        {
          name: "LinkedIn",
          url: "https://linkedin.com/in/zabolotnyi-oleksandr",
          icon: "linkedin",
        },
        {
          name: "Send",
          url: "https://t.me/InM1nd",
          icon: "send",
        },
      ],
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
      <AnimatedSection>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
            <div>
              <p className="text-gray-300 mb-6">
                Quizzley was created with one goal in mind: to make studying
                easier and more efficient for students preparing for exams and
                seminars. As a developer surrounded by friends in university, I
                saw firsthand how overwhelming academic prep can be.
              </p>
              <p className="text-gray-300 mb-6">
                The idea was simple — use AI to analyze study materials and
                automatically generate high-quality quizzes. What started as a
                weekend project quickly gained momentum thanks to feedback from
                early users who wanted more features and flexibility.
              </p>
              <p className="text-gray-300">
                Today, Quizzley is a smart, student-focused platform that helps
                learners study faster, retain information better, and feel more
                confident heading into their next academic challenge — whether
                it&apos;s a tough seminar or a final exam.
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
      <section className="bg-background py-20 sm:py-24">
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
                <p className="text-gray-300 mb-6">
                  Our mission is to empower students with AI-driven tools that
                  make studying smarter, faster, and more effective. By
                  automating time-consuming tasks like quiz generation, Quizzley
                  helps students focus on what really matters — understanding
                  the material and feeling confident in class and during exams.
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
                  We see a future where AI becomes a natural part of the
                  learning journey — making high-quality, personalized study
                  resources available to everyone. Quizzley is built to lead
                  this shift, constantly evolving to meet the real needs of
                  students in today&aposs fast-paced academic world.
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <AnimatedSection className="bg-background py-20 sm:py-24">
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
      <section className="bg-background py-20 sm:py-24">
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
                      <p className="text-gray-300 mb-4">{member.bio}</p>
                      <div className="flex space-x-4">
                        {member.socialLinks &&
                          member.socialLinks.map((link) => (
                            <a
                              key={link.name}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-primary transition-colors"
                              aria-label={link.name}
                            >
                              {link.icon === "github" && (
                                <Github className="h-5 w-5" />
                              )}
                              {link.icon === "linkedin" && (
                                <Linkedin className="h-5 w-5" />
                              )}
                              {link.icon === "send" && (
                                <Send className="h-5 w-5" />
                              )}
                            </a>
                          ))}
                      </div>
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
