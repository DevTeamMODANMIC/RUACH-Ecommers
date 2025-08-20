"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-lg">
                  At Ruach E-Store, we value your privacy and are committed to protecting your personal information. 
                  This Privacy Policy explains how we collect, use, and safeguard your data.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">📑 Information We Collect</h2>
                <p>We may collect the following types of information when you shop with us:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal details: Name, email, phone number, delivery address.</li>
                  <li>Payment details: Card or bank information (processed securely by our payment partners).</li>
                  <li>Account details: Login credentials, order history, preferences.</li>
                  <li>Usage data: Device information, IP address, browsing activity on our website.</li>
                </ul>
              </div>

              {/* How We Use Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">🛠 How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and deliver your orders.</li>
                  <li>Send order updates and customer support messages.</li>
                  <li>Improve our website, products, and services.</li>
                  <li>Send promotional offers (only if you opt in).</li>
                  <li>Prevent fraud and ensure secure transactions.</li>
                </ul>
              </div>

              {/* Data Protection */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">🔐 Data Protection</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your payment information is encrypted and processed securely.</li>
                  <li>We do not store sensitive card details.</li>
                  <li>Access to your personal data is restricted to authorized staff only.</li>
                </ul>
              </div>

              {/* Sharing of Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">📤 Sharing of Information</h2>
                <p>We do not sell or rent your personal data.</p>
                <p>We may share limited information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery partners to ship your orders.</li>
                  <li>Payment processors for secure transactions.</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">📞 Contact Us</h2>
                <p>If you have any questions about our Privacy Policy, please contact us:</p>
                <ul className="list-none space-y-2">
                  <li>Email: support@ruachestore.com</li>
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
