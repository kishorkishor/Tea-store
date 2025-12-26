import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Shipping & Delivery',
    description: 'Learn about our shipping policies, delivery times, and coverage areas across Bangladesh.',
};

const shippingZones = [
    { zone: 'Dhaka City', time: '1-2 business days', cost: 'Free over ৳1,000' },
    { zone: 'Dhaka Division', time: '2-3 business days', cost: '৳60' },
    { zone: 'Chittagong Division', time: '3-4 business days', cost: '৳80' },
    { zone: 'Other Divisions', time: '4-5 business days', cost: '৳100' },
];

export default function ShippingPage() {
    return (
        <div className="py-12 md:py-16">
            <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <nav className="mb-8 text-sm">
                        <ol className="flex items-center gap-2">
                            <li><Link href="/" className="text-gray-500 hover:text-primary-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900">Shipping & Delivery</li>
                        </ol>
                    </nav>

                    <h1 className="font-display text-4xl font-bold text-gray-900 mb-6">
                        Shipping & Delivery
                    </h1>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-lg text-gray-600 mb-8">
                            We deliver to all 64 districts of Bangladesh. Our goal is to get your tea to you
                            as quickly as possible while ensuring it arrives in perfect condition.
                        </p>

                        {/* Shipping Zones */}
                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Delivery Times & Costs
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left p-4 font-semibold">Zone</th>
                                        <th className="text-left p-4 font-semibold">Delivery Time</th>
                                        <th className="text-left p-4 font-semibold">Shipping Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shippingZones.map((zone, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="p-4">{zone.zone}</td>
                                            <td className="p-4">{zone.time}</td>
                                            <td className="p-4">{zone.cost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-secondary-50 p-6 rounded-xl my-8">
                            <p className="text-secondary-800 font-medium mb-2">🎁 Free Shipping</p>
                            <p className="text-gray-700">
                                Enjoy free shipping on all orders over ৳1,000 within Dhaka City.
                                For other areas, a flat shipping rate applies.
                            </p>
                        </div>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Order Processing
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Orders placed before 2:00 PM are processed the same day</li>
                            <li>Orders placed after 2:00 PM are processed the next business day</li>
                            <li>Orders placed on weekends/holidays are processed the next business day</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Tracking Your Order
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Once your order is shipped, you&apos;ll receive an email with tracking information.
                            You can track your order using the tracking number provided.
                        </p>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Delivery Instructions
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Our delivery partner will call before delivery</li>
                            <li>Please ensure someone is available to receive the package</li>
                            <li>You can provide specific delivery instructions during checkout</li>
                        </ul>

                        <h2 className="font-display text-2xl font-semibold text-gray-900 mt-8 mb-4">
                            Need Help?
                        </h2>
                        <p className="text-gray-700">
                            If you have any questions about shipping or your order, please{' '}
                            <Link href="/contact" className="text-primary-700 hover:underline">
                                contact our support team
                            </Link>
                            . We&apos;re happy to help!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
