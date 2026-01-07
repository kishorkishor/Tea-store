'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
                router.push(redirect);
                router.refresh();
            } else {
                const result = await signUp(email, password, firstName, lastName);
                if (result.user) {
                    setError('Account created! Please check your email to verify your account.');
                    // Optionally redirect after a delay
                    setTimeout(() => {
                        setIsLogin(true);
                        setError('');
                    }, 3000);
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || err.error_description || 'Something went wrong. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-12 md:py-16">
            <div className="container-custom max-w-md">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-muted-foreground mb-8 text-center">
                    {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <Input
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <Input
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />

                    {error && (
                        <div className={`p-4 rounded-lg text-sm ${
                            error.includes('created') 
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                        }`}>
                            {error}
                        </div>
                    )}

                    <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-primary-600 dark:text-primary hover:underline"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}

