import Footer from "@/components/footer";
import { AnimatedSection } from "@/components/ui/animated-section";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { AnimatedCard } from "@/components/ui/animated-card";
import {
  FileText,
  Shield,
  User,
  CreditCard,
  AlertTriangle,
  Copyright,
  XCircle,
  AlertCircle,
  Scale,
  Gavel,
  Mail,
  CheckCircle,
} from "lucide-react";

const TermsPage = () => {
  const termsSections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      content:
        'By accessing or using Quizzley.io ("Service", "we", "our", "us"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use the Service.',
      icon: CheckCircle,
    },
    {
      id: 2,
      title: "Description of Service",
      content:
        "Quizzley provides an AI-powered platform that generates quizzes based on uploaded documents or user input. The Service is available via a web application and requires an internet connection. Some features are only available through a paid subscription.",
      icon: FileText,
    },
    {
      id: 3,
      title: "User Accounts",
      content:
        "To use the Service, you must: Be at least 13 years old (or the minimum age in your country). Provide accurate and complete registration information. Maintain the confidentiality of your login credentials. You are responsible for all activity that occurs under your account.",
      icon: User,
    },
    {
      id: 4,
      title: "Subscription and Payments",
      content:
        "Some features require a paid subscription. All payments are processed securely via Stripe. You'll be charged at checkout, unless otherwise stated. Subscriptions automatically renew unless canceled before the next billing cycle. You may cancel at any time in your account settings. No refunds are provided unless required by law.",
      icon: CreditCard,
    },
    {
      id: 5,
      title: "Use Restrictions",
      content:
        "You agree not to: Upload unlawful, offensive, or harmful content. Use the Service to violate any laws or rights of others. Reverse engineer, decompile, or attempt to extract the source code. Misuse AI-generated content in harmful or misleading ways. We reserve the right to suspend or terminate your access if you violate these rules.",
      icon: AlertTriangle,
    },
    {
      id: 6,
      title: "Intellectual Property",
      content:
        "All rights to the platform, branding, and underlying technologies are owned by Quizzley or its licensors. You retain rights to your uploaded content but grant us a limited license to process it for the purpose of providing the service.",
      icon: Copyright,
    },
    {
      id: 7,
      title: "Termination",
      content:
        "We may suspend or terminate your access at any time for breach of these terms. You may cancel your account at any time. Upon termination, your access to the Service and associated data may be removed.",
      icon: XCircle,
    },
    {
      id: 8,
      title: "Disclaimer of Warranties",
      content:
        'The Service is provided "as is" and "as available". We do not guarantee uninterrupted or error-free service. We disclaim all warranties, including fitness for a particular purpose and non-infringement.',
      icon: AlertCircle,
    },
    {
      id: 9,
      title: "Limitation of Liability",
      content:
        "To the extent permitted by law, Quizzley shall not be liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid by you for the Service in the past 12 months.",
      icon: Scale,
    },
    {
      id: 10,
      title: "Modifications to Terms",
      content:
        "We may update these Terms at any time. Changes take effect upon posting. Continued use of the Service after changes means you accept the new terms.",
      icon: Shield,
    },
    {
      id: 11,
      title: "Governing Law",
      content:
        "These Terms are governed by the laws of the United States, without regard to conflict of laws principles.",
      icon: Gavel,
    },
    {
      id: 12,
      title: "Contact",
      content:
        "For questions or concerns about these Terms, please contact us at: 📧 support@quizzley.io",
      icon: Mail,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-24 sm:pt-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <AnimatedHeading className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Terms of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  Service
                </span>
              </AnimatedHeading>
              <AnimatedHeading
                delay={0.2}
                className="mt-6 text-lg leading-8 text-gray-300"
              >
                Effective Date:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </AnimatedHeading>
              <AnimatedHeading
                delay={0.4}
                className="mt-6 text-base leading-7 text-gray-400"
              >
                Please read these terms carefully before using our service. By
                using Quizzley, you agree to be bound by these terms.
              </AnimatedHeading>
            </div>
          </div>
        </section>

        {/* Terms of Service Content */}
        <AnimatedSection className="py-20 sm:py-24 relative">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
            <div className="space-y-12">
              {termsSections.map((section, index) => (
                <AnimatedCard
                  key={section.id}
                  delay={index * 0.1}
                  className="flex flex-col"
                >
                  <div className="rounded-xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 p-8 ring-1 ring-white/10 shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-3">
                          {section.id}. {section.title}
                        </h3>
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300 leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* Important Notice */}
            <AnimatedCard
              delay={1.3}
              className="mt-16"
            >
              <div className="rounded-xl bg-gradient-to-br from-orange-600/10 to-primary/10 p-8 ring-1 ring-orange-600/20 shadow-lg">
                <div className="text-center">
                  <div className="bg-orange-600/10 p-3 rounded-lg inline-flex mb-4">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Important Notice
                  </h3>
                  <p className="text-gray-300 mb-6">
                    By using Quizzley, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms of Service.
                    If you do not agree with any part of these terms, please do
                    not use our service.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/privacy-policy"
                      className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg text-white font-medium hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 border border-white/10"
                    >
                      <Shield className="h-4 w-4" />
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Last Updated */}
            <AnimatedCard
              delay={1.4}
              className="mt-8"
            >
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  © {new Date().getFullYear()} Quizzley. All rights reserved.
                </p>
              </div>
            </AnimatedCard>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
