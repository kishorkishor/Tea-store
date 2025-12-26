'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { createOrderPlaceholder } from '@/lib/services/orders';
import { CustomerInfo, ShippingAddress, PaymentMethod } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const districtOptions = [
    { value: '', label: 'Select District' },
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'sylhet', label: 'Sylhet' },
    { value: 'rajshahi', label: 'Rajshahi' },
    { value: 'khulna', label: 'Khulna' },
    { value: 'barishal', label: 'Barishal' },
    { value: 'rangpur', label: 'Rangpur' },
    { value: 'mymensingh', label: 'Mymensingh' },
];

const paymentMethods: { id: PaymentMethod; name: string; description: string; icon: string }[] = [
    { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: '💵' },
    { id: 'bkash', name: 'bKash', description: 'Pay via bKash mobile wallet', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, Amex', icon: '💳' },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal, shipping, total, clearCart } = useCart();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        address: '',
        city: '',
        district: '',
        postalCode: '',
        country: 'Bangladesh',
    });

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!customerInfo.firstName) newErrors.firstName = 'First name is required';
        if (!customerInfo.lastName) newErrors.lastName = 'Last name is required';
        if (!customerInfo.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!customerInfo.phone) newErrors.phone = 'Phone number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (!shippingAddress.address) newErrors.address = 'Address is required';
        if (!shippingAddress.city) newErrors.city = 'City is required';
        if (!shippingAddress.district) newErrors.district = 'District is required';
        if (!shippingAddress.postalCode) newErrors.postalCode = 'Postal code is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // TODO: Replace with actual payment processing
            const order = await createOrderPlaceholder({
                customer: customerInfo,
                shippingAddress,
                items,
                subtotal,
                shipping,
                total,
                paymentMethod,
            });

            // Clear cart and redirect to success page
            clearCart();
            router.push(`/order-success?orderId=${order.id}&orderNumber=${order.orderNumber}`);
        } catch (error) {
            console.error('Order failed:', error);
            setErrors({ submit: 'Failed to place order. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="py-12 md:py-16">
                <div className="container-custom text-center">
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
                        Your cart is empty
                    </h1>
                    <p className="text-gray-600 mb-8">Add some products before checking out.</p>
                    <Link href="/collections">
                        <Button>Browse Collections</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 md:py-16">
            <div className="container-custom">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2">
                        <li><Link href="/" className="text-gray-500 hover:text-primary-700">Home</Link></li>
                        <li className="text-gray-400">/</li>
                        <li><Link href="/cart" className="text-gray-500 hover:text-primary-700">Cart</Link></li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900">Checkout</li>
                    </ol>
                </nav>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {['Customer Info', 'Shipping', 'Payment'].map((label, index) => (
                        <div key={label} className="flex items-center">
                            <div className={cn(
                                'flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm',
                                step > index + 1 ? 'bg-primary-600 text-white' :
                                    step === index + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                            )}>
                                {step > index + 1 ? '✓' : index + 1}
                            </div>
                            <span className={cn(
                                'ml-2 text-sm hidden sm:inline',
                                step === index + 1 ? 'text-gray-900 font-medium' : 'text-gray-500'
                            )}>
                                {label}
                            </span>
                            {index < 2 && (
                                <div className={cn(
                                    'w-12 sm:w-24 h-0.5 mx-4',
                                    step > index + 1 ? 'bg-primary-600' : 'bg-gray-200'
                                )} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Customer Info */}
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <h2 className="font-display text-2xl font-semibold text-gray-900 mb-6">
                                    Customer Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input
                                        label="First Name"
                                        value={customerInfo.firstName}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                                        error={errors.firstName}
                                        required
                                    />
                                    <Input
                                        label="Last Name"
                                        value={customerInfo.lastName}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                                        error={errors.lastName}
                                        required
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={customerInfo.email}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                        error={errors.email}
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        type="tel"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                        placeholder="+880 1XXX-XXXXXX"
                                        error={errors.phone}
                                        required
                                    />
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <Button onClick={handleNext} size="lg">
                                        Continue to Shipping
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Shipping */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="font-display text-2xl font-semibold text-gray-900 mb-6">
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <Input
                                        label="Street Address"
                                        value={shippingAddress.address}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                        placeholder="House #, Road #, Area"
                                        error={errors.address}
                                        required
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="City"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                            error={errors.city}
                                            required
                                        />
                                        <Select
                                            label="District"
                                            value={shippingAddress.district}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                                            options={districtOptions}
                                            error={errors.district}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Postal Code"
                                            value={shippingAddress.postalCode}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                            error={errors.postalCode}
                                            required
                                        />
                                        <Input
                                            label="Country"
                                            value={shippingAddress.country}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-between">
                                    <Button variant="ghost" onClick={() => setStep(1)}>
                                        ← Back
                                    </Button>
                                    <Button onClick={handleNext} size="lg">
                                        Continue to Payment
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <div className="animate-fade-in">
                                <h2 className="font-display text-2xl font-semibold text-gray-900 mb-6">
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={cn(
                                                'w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4',
                                                paymentMethod === method.id
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            )}
                                        >
                                            <span className="text-3xl">{method.icon}</span>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{method.name}</div>
                                                <div className="text-sm text-gray-500">{method.description}</div>
                                            </div>
                                            <div className={cn(
                                                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                                                paymentMethod === method.id ? 'border-primary-600' : 'border-gray-300'
                                            )}>
                                                {paymentMethod === method.id && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Payment Notice */}
                                <div className="mt-6 p-4 bg-secondary-50 rounded-xl text-sm text-gray-700">
                                    <p className="font-medium text-secondary-800 mb-1">🔒 Secure Payment</p>
                                    {paymentMethod === 'cod' && (
                                        <p>You will pay {formatPrice(total)} when your order is delivered.</p>
                                    )}
                                    {paymentMethod === 'bkash' && (
                                        <p>You will be redirected to bKash to complete your payment.</p>
                                    )}
                                    {paymentMethod === 'card' && (
                                        <p>Your card details are encrypted and secure.</p>
                                    )}
                                </div>

                                {errors.submit && (
                                    <p className="mt-4 text-red-600 text-sm">{errors.submit}</p>
                                )}

                                <div className="mt-8 flex justify-between">
                                    <Button variant="ghost" onClick={() => setStep(2)}>
                                        ← Back
                                    </Button>
                                    <Button onClick={handleSubmit} size="lg" isLoading={isSubmitting}>
                                        Place Order • {formatPrice(total)}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                            <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                                Order Summary
                            </h3>

                            {/* Items */}
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-3">
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-gray-900 truncate">{item.product.name}</p>
                                            <p className="text-xs text-gray-500">{item.variant.name}</p>
                                            <p className="text-sm font-medium text-primary-700 mt-1">
                                                {formatPrice(item.variant.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span className="text-primary-700">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
