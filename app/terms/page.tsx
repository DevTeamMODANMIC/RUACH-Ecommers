"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">📜 Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-lg">
                  Welcome to Ruach E-Store. By accessing or using our website and services, you agree to be bound by these Terms & Conditions. Please read them carefully.
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">1. Introduction</h2>
                <p>These Terms & Conditions govern the use of Ruach E-Store's website, products, and services. By placing an order with us, you agree to these terms along with our Privacy Policy, Shipping & Delivery Policy, and Returns & Refunds Policy.</p>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">2. Eligibility</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 18 years old or have parental/guardian consent to use our services.</li>
                  <li>By using our site, you confirm that all information you provide is accurate and complete.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">3. Products & Orders</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We make every effort to display product details, descriptions, and prices accurately.</li>
                  <li>All orders are subject to availability. If a product is unavailable, we will notify you and offer alternatives or a refund.</li>
                  <li>Placing an order means you agree to pay the stated price (including shipping and applicable fees).</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">4. Pricing & Payment</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Prices are listed in Nigerian Naira (₦) unless otherwise stated.</li>
                  <li>We reserve the right to change prices at any time without prior notice.</li>
                  <li>Payment must be completed before your order is processed.</li>
                  <li>We accept payment methods displayed on the checkout page.</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">5. Shipping & Delivery</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery timelines are estimates and may vary due to courier delays or external factors.</li>
                  <li>Risk of loss or damage passes to you once your order has been delivered to your specified address.</li>
                  <li>For full details, see our Shipping & Delivery Policy.</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">6. Returns & Refunds</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Returns and refunds are subject to our Returns & Refunds Policy.</li>
                  <li>Certain items may not be eligible for return (e.g., personal care products, food, or clearance sales).</li>
                </ul>
              </div>

              {/* Section 7 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">7. User Responsibilities</h2>
                <p>When using our website, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and up-to-date information.</li>
                  <li>Not engage in fraudulent activity, abuse, or misuse of our services.</li>
                  <li>Not attempt to interfere with the security or operation of the website.</li>
                </ul>
              </div>

              {/* Section 8 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">8. Intellectual Property</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All content on Ruach E-Store (logos, images, text, graphics, and designs) is owned by or licensed to us.</li>
                  <li>You may not copy, reproduce, distribute, or use our content without written permission.</li>
                </ul>
              </div>

              {/* Section 9 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ruach E-Store will not be liable for indirect, incidental, or consequential damages arising from your use of our website or services.</li>
                  <li>We are not responsible for delays, losses, or damages caused by third-party courier services.</li>
                </ul>
              </div>

              {/* Section 10 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">10. Termination</h2>
                <p>We may suspend or terminate your access to Ruach E-Store if you violate these Terms & Conditions or engage in fraudulent activity.</p>
              </div>

              {/* Section 11 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">11. Changes to Terms</h2>
                <p>Ruach E-Store reserves the right to update or modify these Terms & Conditions at any time. Updates will be posted on this page with a revised date. Continued use of our services after changes means you accept the new terms.</p>
              </div>

              {/* Section 12 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">12. Governing Law</h2>
                <p>These Terms & Conditions shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria.</p>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">13. Contact Us</h2>
                <p>If you have questions about these Terms & Conditions, please reach out to us:</p>
                <ul className="list-none space-y-2">
                  <li>Email: legal@ruachestore.com</li>
                  <li>Phone/WhatsApp: <a href="https://wa.me/2348160662997" className="text-green-600 hover:text-green-700">+234 816 066 2997</a></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
