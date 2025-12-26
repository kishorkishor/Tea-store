import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Returns & Refunds',
    description: 'Our return and refund policy - we want you to be completely satisfied with your purchase.',
};

export default function ReturnsPage() {
    return (
        <div className="py-12 md:py-16">
            <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <nav className="mb-8 text-sm">
                        <ol className="flex items-center gap-2">
                            <li><Link href="/" className="text-gray-500 hover:text-primary-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900">Returns & Refunds</li>
                        </ol>
                    </nav>

                    <h1 className="font-display text-4xl font-bold text-gray-900 mb-6">
                        Returns & Refund Policy
                    </h1>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-lg text-gray-600 mb-8">
                            Your satisfaction is our priority. If you&apos;re not completely happy with your
                            purchase, we&apos;re here to help.
                        </p>

                        <div className="bg-primary-50 p-6 rounded-xl mb-8">
                            <p className="text-primary-800 font-medium mb-2">✨ Our Promise</p>
                            <p className="text-gray-700">
                                We offer a 7-day satisfaction guarantee on all sealed products.
                                If you&apos;re not satisfied, we&apos;ll make it right.
                            </p>
                        </div>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Return Eligibility
                        </h2>
                        <p className="text-gray-700 mb-4">To be eligible for a return:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Products must be in their original, unopened packaging</li>
                            <li>Returns must be initiated within 7 days of delivery</li>
                            <li>Products must not be damaged due to mishandling</li>
                            <li>Gift sets must have all items intact</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Non-Returnable Items
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Opened or used tea products</li>
                            <li>Products damaged after delivery</li>
                            <li>Items purchased more than 7 days ago</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            How to Initiate a Return
                        </h2>
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                            <li>
                                <strong>Contact Us:</strong> Email us at returns@chaibari.com or call +880 1234-567890
                                with your order number and reason for return.
                            </li>
                            <li>
                                <strong>Approval:</strong> Our team will review your request and provide return instructions
                                within 24 hours.
                            </li>
                            <li>
                                <strong>Ship Back:</strong> Pack the items securely and ship them back using the method
                                we provide.
                            </li>
                            <li>
                                <strong>Refund:</strong> Once we receive and inspect the return, we&apos;ll process your
                                refund within 3-5 business days.
                            </li>
                        </ol>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Refund Method
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Refunds are issued to the original payment method</li>
                            <li>bKash payments are refunded to the same bKash number</li>
                            <li>Card payments are refunded to the same card</li>
                            <li>COD orders can be refunded via bKash or bank transfer</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Damaged or Defective Products
                        </h2>
                        <p className="text-gray-700 mb-4">
                            If you receive a damaged or defective product:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Contact us within 24 hours of delivery</li>
                            <li>Provide photos of the damaged items and packaging</li>
                            <li>We&apos;ll arrange a free replacement or full refund</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Questions?
                        </h2>
                        <p className="text-gray-700">
                            For any questions about returns or refunds, please{' '}
                            <Link href="/contact" className="text-primary-700 hover:underline">
                                contact our support team
                            </Link>
                            . We&apos;re here to help!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
