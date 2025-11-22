import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GuidelinesPage() {
    return (
        <div className="h-screen bg-gray-50 overflow-y-auto">
            
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link href="/" className="inline-flex items-center text-[#5865F2] hover:text-[#4752c4] transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </header>

            
            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
                <p className="text-gray-600 mb-8">Last updated: November 22, 2024</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Tenord is a place where you can belong to a community, collaborate with friends, and connect with people who share your interests. We want to make sure everyone has a positive experience, so we&apos;ve established these Community Guidelines.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Be Respectful</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Treat others the way you want to be treated. This means:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>No harassment, bullying, or hate speech</li>
                            <li>Respect different opinions and perspectives</li>
                            <li>Be kind and considerate in your interactions</li>
                            <li>Don&apos;t engage in personal attacks or insults</li>
                            <li>Respect people&apos;s privacy and personal boundaries</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Keep It Safe</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We want Tenord to be a safe space for everyone. You must not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Share content that promotes violence or harm</li>
                            <li>Post sexually explicit or suggestive content</li>
                            <li>Share personal information about others without consent</li>
                            <li>Engage in any illegal activities</li>
                            <li>Distribute malware, viruses, or harmful software</li>
                            <li>Attempt to hack, phish, or scam other users</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Be Honest</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Authenticity is important to us. This means:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Don&apos;t impersonate others or create fake accounts</li>
                            <li>Don&apos;t spread misinformation or fake news</li>
                            <li>Be transparent about your identity and intentions</li>
                            <li>Don&apos;t engage in deceptive practices</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Respect Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Give credit where credit is due:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Don&apos;t share copyrighted content without permission</li>
                            <li>Respect trademarks and brand identities</li>
                            <li>Credit original creators when sharing their work</li>
                            <li>Don&apos;t plagiarize or claim others&apos; work as your own</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. No Spam or Self-Promotion</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Keep conversations meaningful:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Don&apos;t send unsolicited advertisements or promotions</li>
                            <li>Avoid excessive self-promotion</li>
                            <li>Don&apos;t post repetitive or irrelevant content</li>
                            <li>Respect channel topics and stay on-topic</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Respect Server Rules</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Each server may have its own specific rules:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Follow the rules set by server administrators</li>
                            <li>Respect moderator decisions</li>
                            <li>Understand that different communities have different standards</li>
                            <li>If you disagree with a rule, discuss it respectfully with moderators</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Protect Minors</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We have zero tolerance for content that sexualizes, endangers, or exploits minors:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Never share content that sexualizes minors</li>
                            <li>Don&apos;t engage in predatory behavior toward minors</li>
                            <li>Report any concerning behavior immediately</li>
                            <li>Age-restricted content must be clearly marked</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Reporting Violations</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you see something that violates these guidelines:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Use the report feature to flag inappropriate content</li>
                            <li>Contact server moderators for server-specific issues</li>
                            <li>Reach out to our support team for serious violations</li>
                            <li>Don&apos;t engage with or retaliate against violators</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Consequences</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Violations of these guidelines may result in:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Content removal</li>
                            <li>Temporary suspension</li>
                            <li>Permanent account termination</li>
                            <li>Reporting to law enforcement (for illegal activities)</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            The severity of the consequence depends on the nature and frequency of the violation.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Updates to Guidelines</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may update these guidelines from time to time to reflect changes in our community or legal requirements. We&apos;ll notify users of significant changes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have questions about these guidelines or need to report a violation, please contact us at:
                        </p>
                        <p className="text-gray-700">
                            Email: <a href="mailto:support@tenord.com" className="text-[#5865F2] hover:underline">support@tenord.com</a>
                        </p>
                    </section>

                    <div className="bg-blue-50 border-l-4 border-[#5865F2] p-6 mt-8">
                        <p className="text-gray-800 font-semibold mb-2">Remember:</p>
                        <p className="text-gray-700">
                            These guidelines exist to make Tenord a welcoming place for everyone. By using our platform, you agree to follow these guidelines and help us maintain a positive community.
                        </p>
                    </div>
                </div>
            </main>

            
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-4xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
                    © 2024 Tenord. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
