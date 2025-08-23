import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { ROUTES } from "@/constants/route";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section with logo and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-gray-200">
          <div className="lg:col-span-5 space-y-4">
            <Link href={ROUTES.HOME} className="inline-block">
              <Logo variant="large" className="font-bold" />
            </Link>
            <p className="text-gray-600 mt-4 max-w-md">
              Empowering your financial journey with secure, innovative banking
              solutions designed for today's digital world.
            </p>
            <div className="pt-4">
              <p className="text-sm font-medium text-gray-800 mb-3">
                Stay updated with our newsletter
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none flex-grow"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-md font-medium whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick links section */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Products
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Checking Accounts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Savings Accounts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Credit Cards
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Loans
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Investments
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Partners
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Resources
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Mobile App
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Developer API
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Middle section with contact info and social media */}
        <div className="py-8 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Contact Us
            </h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +1 (800) 123-4567
              </p>
              <p className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                support@bankingapp.com
              </p>
              <p className="flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                123 Financial Street, New York, NY 10001
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors"
              >
                <Image
                  src="/icons/facebook.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="text-blue-600"
                />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors"
              >
                <Image
                  src="/icons/twitter.svg"
                  alt="Twitter"
                  width={20}
                  height={20}
                  className="text-blue-600"
                />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors"
              >
                <Image
                  src="/icons/linkedin.svg"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                  className="text-blue-600"
                />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors"
              >
                <Image
                  src="/icons/instagram.svg"
                  alt="Instagram"
                  width={20}
                  height={20}
                  className="text-blue-600"
                />
              </Link>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Mobile Banking
              </h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#"
                  className="flex items-center bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg px-4 py-2"
                >
                  <Image
                    src="/icons/apple.svg"
                    alt="App Store"
                    width={24}
                    height={24}
                    className="mr-2 text-gray-900"
                  />
                  <div>
                    <p className="text-xs text-gray-600">Download on the</p>
                    <p className="text-sm font-semibold text-gray-900">
                      App Store
                    </p>
                  </div>
                </Link>
                <Link
                  href="#"
                  className="flex items-center bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg px-4 py-2"
                >
                  <Image
                    src="/icons/google-play.svg"
                    alt="Google Play"
                    width={24}
                    height={24}
                    className="mr-2 text-gray-900"
                  />
                  <div>
                    <p className="text-xs text-gray-600">Get it on</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Google Play
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with legal links and copyright */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Terms & Conditions
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Cookie Policy
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Accessibility
            </Link>
          </div>
          <div className="text-right text-sm text-gray-600 md:order-last order-first md:mt-0 mt-4">
            © {currentYear} Banking App. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
