import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Leaf, Handshake, Sparkles, Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about ChaiBari - our story, mission, and commitment to bringing you the finest teas from Bangladesh and beyond.',
};

const values = [
    {
        icon: 'leaf',
        title: 'Sustainability',
        description: 'We partner with tea gardens that practice sustainable farming methods.',
    },
    {
        icon: 'handshake',
        title: 'Fair Trade',
        description: 'Our farmers receive fair wages and work in safe conditions.',
    },
    {
        icon: 'sparkles',
        title: 'Quality First',
        description: 'Every batch is carefully tested for taste, aroma, and purity.',
    },
    {
        icon: 'heart',
        title: 'Community',
        description: 'We reinvest in local communities and support education initiatives.',
    },
];

const team = [
    { name: 'Kishor', role: 'Founder & CEO', image: '/evil-tom.png' },
    { name: 'Wise Kishor', role: 'Head of Sourcing', image: '/evil-tom.png' },
    { name: 'Not So Wise Kishor', role: 'Master Tea Blender', image: '/evil-tom.png' },
];

export default function AboutPage() {
    return (
        <div>
            {/* Hero */}
            <section className="relative py-24 bg-primary-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                            Our Story
                        </h1>
                        <p className="text-xl text-primary-200 leading-relaxed">
                            From the misty highlands of Sylhet to your cup, we&apos;re on a mission to share
                            Bangladesh&apos;s finest teas with the world. Founded in 2009, ChaiBari began as
                            a small family business with a simple belief: everyone deserves access to
                            exceptional tea.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=600&fit=crop"
                                alt="Tea gardens in Sylhet"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <span className="text-secondary-600 dark:text-secondary font-medium text-sm uppercase tracking-wider">
                                Our Mission
                            </span>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                                Connecting Tea Lovers with Nature&apos;s Best
                            </h2>
                            <div className="space-y-4 text-foreground/90">
                                <p>
                                    At ChaiBari, we believe that great tea tells a story. It speaks of the land
                                    where it was grown, the hands that picked it, and the tradition that shaped it.
                                    Our mission is to bring that story to your doorstep.
                                </p>
                                <p>
                                    We work directly with family-owned tea gardens across Sylhet, Assam, Darjeeling,
                                    and beyond. By cutting out middlemen, we ensure that our farmers are fairly
                                    compensated while you receive the freshest, most flavorful teas possible.
                                </p>
                                <p>
                                    Every cup of ChaiBari tea is a celebration of craftsmanship, sustainability,
                                    and the simple pleasure of a well-brewed cup.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-24 bg-cream-100 dark:bg-muted/30">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <span className="text-secondary-600 dark:text-secondary font-medium text-sm uppercase tracking-wider">
                            What We Stand For
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                            Our Values
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const iconMap: Record<string, React.ReactNode> = {
                                leaf: <Leaf className="w-8 h-8 text-primary-600 dark:text-primary" />,
                                handshake: <Handshake className="w-8 h-8 text-primary-600 dark:text-primary" />,
                                sparkles: <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary" />,
                                heart: <Heart className="w-8 h-8 text-primary-600 dark:text-primary" />,
                            };
                            return (
                                <div key={index} className="bg-card p-6 rounded-2xl text-center card-hover border border-border">
                                    <div className="w-14 h-14 mx-auto mb-4 bg-primary-50 dark:bg-muted rounded-full flex items-center justify-center">
                                        {iconMap[value.icon]}
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 md:py-24">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <span className="text-secondary-600 dark:text-secondary font-medium text-sm uppercase tracking-wider">
                            The People Behind ChaiBari
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                            Meet Our Team
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        {team.map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-border">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="font-semibold text-foreground">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24 bg-primary-700 text-white">
                <div className="container-custom text-center">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                        Ready to Experience ChaiBari?
                    </h2>
                    <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                        Explore our collection of premium teas and find your new favorite.
                    </p>
                    <Link href="/collections">
                        <Button variant="secondary" size="lg">
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
