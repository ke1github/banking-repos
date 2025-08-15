import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-branding mb-6">
          <Link href="/" className="mb-3">
            <Logo variant="large" className="font-bold" />
          </Link>
          <p className="text-sm text-gray-600 max-w-xs">
            Your trusted partner for secure and convenient banking solutions.
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-link-group">
            <h3 className="footer-title">Quick Links</h3>
            <Link href="#" className="footer-link">
              About Us
            </Link>
            <Link href="#" className="footer-link">
              Contact
            </Link>
            <Link href="#" className="footer-link">
              FAQ
            </Link>
            <Link href="#" className="footer-link">
              Privacy Policy
            </Link>
            <Link href="#" className="footer-link">
              Terms of Service
            </Link>
          </div>

          <div className="footer-link-group">
            <h3 className="footer-title">Support</h3>
            <p className="footer-text">Need help? Contact our support team.</p>
            <p className="footer-text">
              <strong>Email:</strong> support@bankingapp.com
            </p>
            <p className="footer-text">
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
          </div>
        </div>

        <div className="footer-social">
          <h3 className="footer-title">Connect With Us</h3>
          <div className="social-icons">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Image
                src="/icons/facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="icon"
              />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Image
                src="/icons/twitter.svg"
                alt="Twitter"
                width={24}
                height={24}
                className="icon"
              />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Image
                src="/icons/linkedin.svg"
                alt="LinkedIn"
                width={24}
                height={24}
                className="icon"
              />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="icon"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © {new Date().getFullYear()} Banking App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
