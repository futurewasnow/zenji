import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Zenji Card Game</title>
        <meta 
          name="description"
          content="Privacy Policy for Zenji card game. Learn how we collect, use, and protect your personal information."
        />
      </Helmet>
      
      <div className="min-h-[calc(100vh-16rem)] bg-bamboo-light py-12 px-4 md:px-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Link href="/">
                <Button variant="ghost" className="mb-4">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              
              <h1 className="font-cinzel text-4xl text-jungle-green mb-4">Privacy Policy</h1>
              <p className="text-gray-600">Last Updated: December 2024</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6">
              <section>
                <h2 className="font-cinzel text-xl text-jungle-green mb-3">Introduction</h2>
                <p className="text-gray-700 mb-3">
                  Welcome to Zenji ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website.
                </p>
                <p className="text-gray-700">
                  This Privacy Policy explains how we collect, use, and share information about you when you use our website, playzenji.com, our services, and related applications (collectively, the "Services").
                </p>
              </section>
              
              <section>
                <h2 className="font-cinzel text-xl text-jungle-green mb-3">Information We Collect</h2>
                <p className="text-gray-700 mb-3">We collect several types of information from and about users of our Services:</p>
                
                <h3 className="font-medium text-jungle-green mt-4 mb-2">Information You Provide to Us</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <strong>Contact and Account Information:</strong> When you create an account, subscribe to our newsletter, or place an order, we collect your name, email address, postal address, phone number, and other contact details.
                  </li>
                  <li>
                    <strong>Order Information:</strong> When you place an order, we collect payment information, billing address, and shipping details.
                  </li>
                  <li>
                    <strong>Communications:</strong> When you contact us directly, we may keep a record of that communication.
                  </li>
                </ul>
                
                <h3 className="font-medium text-jungle-green mt-4 mb-2">Information We Collect Automatically</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <strong>Usage Data:</strong> We collect information about how you interact with our Services, including page views, time spent on pages, and features used.
                  </li>
                  <li>
                    <strong>Device Information:</strong> We collect information about the device you use to access our Services, including device type, operating system, and browser type.
                  </li>
                  <li>
                    <strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to collect information about your browsing activities.
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="font-cinzel text-xl text-jungle-green mb-3">How We Use Your Information</h2>
                <p className="text-gray-700 mb-3">We use the information we collect for various purposes, including to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Provide and maintain our Services</li>
                  <li>Improve and develop our Services</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Protect the security and integrity of our Services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>
              
              <section>
                <h2 className="font-cinzel text-xl text-jungle-green mb-3">Sharing Your Information</h2>
                <p className="text-gray-700 mb-3">We may share your information with:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> We share information with third-party service providers that help us operate our business and deliver our Services, such as payment processors and shipping companies.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="font-cinzel text-xl text-jungle-green mb-3">Your Rights and Choices</h2>
                <p className="text-gray-700 mb-3">You have certain rights regarding your personal information:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Access, update, or delete your personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Set browser or device to refuse cookies</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  To exercise these rights, please contact us at privacy@playzenji.com.
                </p>
              </section>
              
              <section>
                <h2 className="font-cinzel text-xl text-jungle-green mb-3">Data Security</h2>
                <p className="text-gray-700">
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>
              
              <section>
                <h2 className="font-cinzel text-xl text-jungle-green mb-3">Children's Privacy</h2>
                <p className="text-gray-700">
                  Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
                </p>
              </section>
              
              <section>
                <h2 className="font-cinzel text-xl text-jungle-green mb-3">Changes to This Privacy Policy</h2>
                <p className="text-gray-700">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
                </p>
              </section>
              
              <section>
                <h2 className="font-cinzel text-xl text-jungle-green mb-3">Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at privacy@playzenji.com.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
