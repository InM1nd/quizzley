"use client";

interface StructuredDataProps {
  type: "Organization" | "WebSite" | "SoftwareApplication" | "FAQPage";
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Quizzley",
          url: "https://quizzley.io",
          logo: "https://quizzley.io/logo.png",
          description: "AI-powered quiz generator for personalized learning",
          sameAs: [
            "https://twitter.com/quizzley",
            "https://linkedin.com/company/quizzley",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "support@quizzley.io",
          },
        };

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Quizzley",
          url: "https://quizzley.io",
          description: "AI-powered quiz generator for personalized learning",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://quizzley.io/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        };

      case "SoftwareApplication":
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Quizzley",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web Browser",
          description: "AI-powered quiz generator for personalized learning",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        };

      case "FAQPage":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.questions.map((q: any) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer,
            },
          })),
        };

      default:
        return data;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}
