import Link from "next/link";
import { RiTwitterXFill } from "react-icons/ri";
import { IoLogoInstagram } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-800/50 bg-background py-8">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quizzley</h3>
            <p className="mt-4 text-sm text-secondary">
              Create smart quizzes using artificial intelligence. Learn and grow
              with us.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-sm text-secondary hover:text-orange-500 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="text-sm text-secondary hover:text-orange-500 transition-colors"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/api/auth/signin?callbackUrl=/dashboard"
                  className="text-sm text-secondary hover:text-orange-500 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-secondary hover:text-orange-500 transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-secondary hover:text-orange-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-secondary hover:text-orange-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-secondary hover:text-orange-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-zinc-800/50 pt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-secondary">
              © {new Date().getFullYear()} Quizzley. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="https://twitter.com"
                className="text-secondary hover:text-orange-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RiTwitterXFill className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/quizzley.io?igsh=NTc4MTIwNjQ2YQ=="
                className="text-secondary hover:text-orange-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoInstagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/quizzley-io/"
                className="text-secondary hover:text-orange-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.tiktok.com/@quizzley.io?_t=ZN-8yGcgrOVXPS&_r=1"
                className="text-secondary hover:text-orange-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
