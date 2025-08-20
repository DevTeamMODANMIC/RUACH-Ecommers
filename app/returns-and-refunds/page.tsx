"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReturnsAndRefundsPage() {
  return (
    <div className="min-h-screen py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Returns & Refunds Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-lg">
                  At Ruach E-Store, customer satisfaction is our top priority. If for any reason you are not
                  completely happy with your purchase, we are here to help.
                </p>
              </div>

              {/* Eligibility */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">✅ Eligibility for Returns</h2>
                <p>Items must be returned within 7 days of delivery.</p>
                <p>To be eligible, the item must be:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unused, unworn, and in the same condition as received.</li>
                  <li>In its original packaging with all tags, labels, or seals intact.</li>
                </ul>
                <div className="space-y-2">
                  <p>Certain items cannot be returned for hygiene and safety reasons (e.g., underwear, cosmetics, food items).</p>
                  <p>Sale or clearance items may not be eligible for return unless faulty.</p>
                </div>
              </div>

              {/* How to Initiate */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">📦 How to Initiate a Return</h2>
                <ol className="list-decimal pl-6 space-y-4">
                  <li>Contact our Customer Support Team via email or WhatsApp within 7 days of receiving your order.</li>
                  <li>Provide your order number, product details, and reason for return.</li>
                  <li>Our team will guide you on the return shipping process.</li>
                </ol>
              </div>

              {/* Refunds */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">💰 Refunds</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Once your return is received and inspected, we will notify you of the approval or rejection of your refund.</li>
                  <li>Approved refunds will be processed within 5–10 business days.</li>
                  <li>Refunds will be made to your original payment method (bank transfer, card, or wallet credit).</li>
                  <li>Shipping fees are non-refundable, unless the return is due to a mistake on our part (e.g., wrong or damaged item).</li>
                </ul>
              </div>

              {/* Exchanges */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">🔄 Exchanges</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>If you would like to exchange an item (e.g., for a different size or color), please indicate this when contacting support.</li>
                  <li>Exchanges are subject to product availability.</li>
                  <li>If the replacement item is not available, a refund will be issued instead.</li>
                </ul>
              </div>

              {/* Damaged Items */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">🛡 Damaged, Defective, or Wrong Items</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery.</li>
                  <li>Provide clear pictures of the product and packaging.</li>
                  <li>We will arrange a replacement or issue a full refund at no extra cost to you.</li>
                </ul>
              </div>

              {/* Return Shipping */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">📍 Return Shipping Costs</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Customers are responsible for the cost of return shipping, unless the return is due to our error (wrong or defective item).</li>
                  <li>We recommend using a trackable courier service, as we cannot guarantee that we will receive your returned item.</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">📞 Need Help?</h2>
                <p>For returns, refunds, or exchanges, please reach out to our Customer Support Team:</p>
                <ul className="list-none space-y-2">
                  <li>Email: support@ruachestore.com</li>
                  <li>Phone/WhatsApp: <a href="https://wa.me/2348160662997" className="text-green-600 hover:text-green-700">+234 816 066 2997</a></li>
                </ul>
                <p>We'll be glad to assist you.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
