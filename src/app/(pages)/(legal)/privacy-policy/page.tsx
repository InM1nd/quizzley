import Footer from "@/components/footer";
import { AnimatedSection } from "@/components/ui/animated-section";
import { AnimatedHeading } from "@/components/ui/animated-heading";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Shield, Eye, Lock, Users, Cookie, Globe, Mail } from "lucide-react";

const PrivacyPage = () => {
  const privacySections = [
    {
      id: 1,
      title: "Introduction",
      content:
        'This privacy notice explains how Quizzley.io ("we", "us", or "our") collects, uses, shares and protects your personal data when you use our AI‑powered quiz generation platform.',
      icon: Shield,
    },
    {
      id: 2,
      title: "What Information We Collect",
      content:
        "We may collect: Information you provide: name, email address, password; payment or billing details when you subscribe. Automatically collected data: IP address, device type, browser version, usage metrics (pages visited, documents uploaded, quizzes created) and cookies. Third-party data: if you choose to integrate with external analytics or services (e.g. Google Analytics).",
      icon: Eye,
    },
    {
      id: 3,
      title: "How We Use Your Data",
      content:
        "We process your information to: Provide and maintain the Service (account setup, quiz generation, analytics). Process payments and manage subscriptions. Communicate service updates, support, and marketing (only with your consent). Analyze usage trends to improve features and detect abuse or fraud.",
      icon: Lock,
    },
    {
      id: 4,
      title: "Sharing Personal Data",
      content:
        "We may share your data with: Service providers (e.g. payment processors, hosting, email providers) who support operation of the platform. Legal requests: when required by law enforcement or compliance, for fraud prevention or litigation. Business transfers: if Quizzley is merged, acquired, or sold; in such case data may be transferred under confidentiality.",
      icon: Users,
    },
    {
      id: 5,
      title: "User Rights & Data Retention",
      content:
        "We retain personal data as long as you maintain an account or as needed for legal reasons. You may access, correct, update or delete your personal data via account settings or by contacting us. Upon account deletion request, we erase your personal records unless we're legally required to keep them.",
      icon: Shield,
    },
    {
      id: 6,
      title: "Cookies & Tracking",
      content:
        "We use cookies and similar technologies to: Authenticate you across sessions. Remember preferences and settings. Analyze service usage; you can manage cookie permissions via your browser or within settings.",
      icon: Cookie,
    },
    {
      id: 7,
      title: "Data Security",
      content:
        "We implement standard security measures including: TLS/HTTPS encryption in transit. Secure data storage with encryption at rest. Role-based access controls and regular audits to prevent unauthorized access.",
      icon: Lock,
    },
    {
      id: 8,
      title: "GDPR / CCPA Compliance",
      content:
        "If you are in the EU or California, you may have additional rights such as data portability, restriction of processing, or lodging a complaint with a supervisory authority. We rely on lawful processing bases such as contract fulfillment, consent, and legitimate interests. Data may be transferred internationally (e.g. to third-party services hosted in the US) under EU‑approved transfer mechanisms or standard contractual clauses.",
      icon: Globe,
    },
    {
      id: 9,
      title: "Children's Privacy",
      content:
        "Our Service is not intended for children under 13. If we receive personal data from users under 13 without verifiable parental consent, we will promptly erase it.",
      icon: Users,
    },
    {
      id: 10,
      title: "Changes to This Policy",
      content:
        'We may update this Privacy Policy from time to time. We\'ll post updates on this page and adjust the "Last Updated" date. Significant changes will be communicated via email or through a prominent notice in the app.',
      icon: Shield,
    },
    {
      id: 11,
      title: "Contact Us",
      content:
        "If you have questions, concerns, or requests about your data, please contact us at: privacy@quizzley.io",
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
                Privacy{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  Policy
                </span>
              </AnimatedHeading>
              <AnimatedHeading
                delay={0.2}
                className="mt-6 text-lg leading-8 text-gray-300"
              >
                Last Updated:{" "}
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
                Your privacy is important to us. This policy explains how we
                collect, use, and protect your information.
              </AnimatedHeading>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <AnimatedSection className="py-20 sm:py-24 relative">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
            <div className="space-y-12">
              {privacySections.map((section, index) => (
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

            {/* Additional Information */}
            <AnimatedCard
              delay={1.2}
              className="mt-16"
            >
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-orange-600/10 p-8 ring-1 ring-primary/20 shadow-lg">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Questions About Your Privacy?
                  </h3>
                  <p className="text-gray-300 mb-6">
                    We&apos;re committed to transparency and protecting your
                    data. If you have any questions about this privacy policy or
                    how we handle your information, please don&apos;t hesitate
                    to reach out.
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
