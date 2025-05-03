import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Check if we should focus on the refunds section
    return location.includes('#refunds') ? 'refunds' : 'terms';
  });
  
  return (
    <>
      <Helmet>
        <title>Terms of Service - Zenji Card Game</title>
        <meta 
          name="description"
          content="Terms of Service for Zenji card game. Review our terms, conditions, and refund policy."
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
              
              <h1 className="font-cinzel text-4xl text-jungle-green mb-4">Legal Information</h1>
              <p className="text-gray-600">Last Updated: December 2024</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="terms">Terms of Service</TabsTrigger>
                <TabsTrigger value="refunds" id="refunds">Refund Policy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="terms" className="mt-6">
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6">
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Terms of Service</h2>
                    <p className="text-gray-700 mb-3">
                      These Terms of Service govern your use of the website located at playzenji.com and any related services provided by Zenji.
                    </p>
                    <p className="text-gray-700">
                      By accessing playzenji.com, you agree to abide by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with these Terms of Service, you are prohibited from using or accessing this website or using any other services provided by Zenji.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Use License</h2>
                    <p className="text-gray-700 mb-3">
                      Permission is granted to temporarily download one copy of the materials on Zenji's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                      <li>Modify or copy the materials;</li>
                      <li>Use the materials for any commercial purpose or for any public display;</li>
                      <li>Attempt to reverse engineer any software contained on Zenji's website;</li>
                      <li>Remove any copyright or other proprietary notations from the materials; or</li>
                      <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Intellectual Property</h2>
                    <p className="text-gray-700 mb-3">
                      The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Zenji and its licensors. The Service is protected by copyright, trademark, and other laws of both the Costa Rica and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Zenji.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">User Accounts</h2>
                    <p className="text-gray-700 mb-3">
                      When you create an account with us, you guarantee that you are above the age of 13, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
                    </p>
                    <p className="text-gray-700 mb-3">
                      You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password, whether your password is with our Service or a third-party service. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">E-Commerce</h2>
                    <p className="text-gray-700 mb-3">
                      Certain features of the Service are associated with payments and e-commerce. These features are provided by third-party payment processors. By using these features, you agree to be bound by the terms and conditions of these third-party payment processors.
                    </p>
                    <p className="text-gray-700 mb-3">
                      You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
                    </p>
                    <p className="text-gray-700">
                      We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product availability, errors in the description or price of the product, error in your order or other reasons.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Limitation of Liability</h2>
                    <p className="text-gray-700 mb-3">
                      In no event shall Zenji, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Governing Law</h2>
                    <p className="text-gray-700">
                      These Terms shall be governed and construed in accordance with the laws of Costa Rica, without regard to its conflict of law provisions.
                    </p>
                  </section>
                </div>
              </TabsContent>
              
              <TabsContent value="refunds" className="mt-6">
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6">
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Refund Policy</h2>
                    <p className="text-gray-700 mb-3">
                      We want you to be completely satisfied with your purchase. This refund policy outlines the circumstances under which we offer refunds for our products.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Physical Products</h2>
                    <h3 className="font-medium text-jungle-green mt-4 mb-2">Pre-Orders</h3>
                    <p className="text-gray-700 mb-3">
                      Pre-orders may be canceled for a full refund up until the item ships. Once a pre-order has shipped, our standard refund policy applies.
                    </p>
                    
                    <h3 className="font-medium text-jungle-green mt-4 mb-2">Damaged or Defective Items</h3>
                    <p className="text-gray-700 mb-3">
                      If you receive a damaged or defective item, please contact us within 14 days of receipt. We will provide a replacement or full refund, including shipping costs, upon confirmation of the damage or defect.
                    </p>
                    
                    <h3 className="font-medium text-jungle-green mt-4 mb-2">Return of Unopened Items</h3>
                    <p className="text-gray-700 mb-3">
                      Unopened items in their original packaging may be returned within 30 days of receipt for a full refund minus shipping costs. The customer is responsible for return shipping costs.
                    </p>
                    
                    <h3 className="font-medium text-jungle-green mt-4 mb-2">Opened Items</h3>
                    <p className="text-gray-700 mb-3">
                      We do not offer refunds for opened items unless they are damaged or defective. If you're unsure about a purchase, please contact us before opening the product.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Digital Products</h2>
                    <p className="text-gray-700 mb-3">
                      Due to the nature of digital products, all sales of digital products are final and non-refundable once access has been provided.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">How to Request a Refund</h2>
                    <p className="text-gray-700 mb-3">
                      To request a refund, please contact us at support@playzenji.com with your order number and the reason for your refund request. For damaged or defective items, please include photos of the damage.
                    </p>
                    <p className="text-gray-700 mb-3">
                      We will process valid refund requests within 5-7 business days. Refunds will be issued to the original payment method used for the purchase.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Shipping Costs for Returns</h2>
                    <p className="text-gray-700 mb-3">
                      For returns due to customer preference, the customer is responsible for return shipping costs. For returns due to damaged or defective items, we will provide a prepaid shipping label.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Exceptions</h2>
                    <p className="text-gray-700 mb-3">
                      Custom orders and personalized items cannot be returned unless they are damaged or defective.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Changes to This Policy</h2>
                    <p className="text-gray-700 mb-3">
                      We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting to our website.
                    </p>
                  </section>
                  
                  <section>
                    <h2 className="font-cinzel text-xl text-jungle-green mb-3">Contact Us</h2>
                    <p className="text-gray-700">
                      If you have any questions about our refund policy, please contact us at support@playzenji.com.
                    </p>
                  </section>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
