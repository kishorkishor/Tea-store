import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Learn how ChaiBari collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
    return (
        <div className="py-12 md:py-16">
            <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <nav className="mb-8 text-sm">
                        <ol className="flex items-center gap-2">
                            <li><Link href="/" className="text-gray-500 hover:text-primary-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900">Privacy Policy</li>
                        </ol>
                    </nav>

                    <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500 mb-8">Last updated: December 2024</p>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-lg text-gray-600 mb-8">
                            At ChaiBari, we are committed to protecting your privacy. This policy explains
                            how we collect, use, and safeguard your personal information.
                        </p>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Information We Collect
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We collect information you provide directly to us, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Name, email address, and phone number</li>
                            <li>Shipping and billing addresses</li>
                            <li>Payment information (processed securely by our payment partners)</li>
                            <li>Order history and preferences</li>
                            <li>Communications with our customer support</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            How We Use Your Information
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Process and fulfill your orders</li>
                            <li>Send order confirmations and shipping updates</li>
                            <li>Respond to your inquiries and provide customer support</li>
                            <li>Send promotional emails (with your consent)</li>
                            <li>Improve our products and services</li>
                            <li>Prevent fraud and ensure security</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Information Sharing
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Delivery partners to fulfill your orders</li>
                            <li>Payment processors to handle transactions</li>
                            <li>Service providers who assist our operations</li>
                            <li>Law enforcement when required by law</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Data Security
                        </h2>
                        <p className="text-gray-700">
                            We implement industry-standard security measures to protect your personal
                            information. All payment transactions are encrypted using SSL technology.
                            However, no method of transmission over the internet is 100% secure.
                        </p>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Cookies
                        </h2>
                        <p className="text-gray-700">
                            We use cookies to enhance your browsing experience, analyze site traffic,
                            and personalize content. You can control cookie settings through your browser.
                        </p>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Your Rights
                        </h2>
                        <p className="text-gray-700 mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt out of marketing communications</li>
                            <li>Lodge a complaint with a supervisory authority</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Contact Us
                        </h2>
                        <p className="text-gray-700">
                            If you have questions about this Privacy Policy, please{' '}
                            <Link href="/contact" className="text-primary-700 hover:underline">
                                contact us
                            </Link>{' '}
                            or email us at privacy@chaibari.com.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
