"use client";

import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { AnimatedSection } from "@/components/ui/animated-section";
import Aurora from "@/components/ui/aurora";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Mail,
  Send,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  HelpCircle,
  Users,
} from "lucide-react";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulating form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
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
                Contact <span className="text-primary">Us</span>
              </AnimatedHeading>
              <AnimatedHeading
                delay={0.2}
                className="mt-6 text-lg leading-8 text-gray-300"
              >
                Do you have questions or suggestions? We&apos;re happy to help
                and hear your feedback.
              </AnimatedHeading>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
            {/* Contact Information */}
            <AnimatedCard
              delay={0.1}
              className="flex flex-col"
            >
              <div className="rounded-xl bg-zinc-900/80 p-8 ring-1 ring-white/10 h-full">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Contact Information
                </h2>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-white">Email</h3>
                      <p className="mt-1 text-gray-300">info@quizzley.com</p>
                      <p className="mt-1 text-gray-300">support@quizzley.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <HelpCircle className="h-6 w-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Support
                      </h3>
                      <p className="mt-1 text-gray-300">
                        Our team is available 24/7 to assist you with any
                        questions or issues.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="h-6 w-6 text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        Community
                      </h3>
                      <p className="mt-1 text-gray-300">
                        Join our growing community of users and share your
                        experiences with Quizzley.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition-colors"
                      aria-label="Twitter"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-300" />
                    </a>
                    <a
                      href="#"
                      className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition-colors"
                      aria-label="LinkedIn"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-300" />
                    </a>
                    <a
                      href="#"
                      className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition-colors"
                      aria-label="GitHub"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-300" />
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Contact Form */}
            <AnimatedCard
              delay={0.2}
              className="flex flex-col"
            >
              <div className="rounded-xl bg-zinc-900/80 p-8 ring-1 ring-white/10 h-full">
                <h2 className="text-2xl font-bold text-white mb-6">
                  <MessageCircle className="h-6 w-6 inline-block mr-2 text-primary" />
                  Send Us a Message
                </h2>

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-300 text-center">
                      Thank you for reaching out! We&apos;ll get back to you as
                      soon as possible.
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-zinc-400"
                      >
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-zinc-400"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        required
                        className="bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-zinc-400"
                      >
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        placeholder="Your message subject"
                        required
                        className="bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-zinc-400"
                      >
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        required
                        className="min-h-[150px] bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
