import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-gray-600 mb-8">Last updated: November 22, 2024</p>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            By accessing and using Tenord, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Permission is granted to temporarily use Tenord for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or for any public display</li>
                            <li>Attempt to reverse engineer any software contained on Tenord</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                            <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Content</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post on or through the service, including its legality, reliability, and appropriateness.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            By posting content on or through the service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Uses</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>In any way that violates any applicable national or international law or regulation</li>
                            <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                            <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                            <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the service</li>
                            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            The service and its original content (excluding content provided by users), features and functionality are and will remain the exclusive property of Tenord and its licensors. The service is protected by copyright, trademark, and other laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you wish to terminate your account, you may simply discontinue using the service or contact us to request account deletion.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            In no event shall Tenord, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimer</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Your use of the service is at your sole risk. The service is provided on an &#34;AS IS&#34; and &#34;AS AVAILABLE&#34; basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <p className="text-gray-700">
                            Email: <a href="mailto:legal@tenord.com" className="text-[#5865F2] hover:underline">legal@tenord.com</a>
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-4xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
                    © 2024 Tenord. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
