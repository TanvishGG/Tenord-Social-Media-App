"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MessageCircle, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </motion.button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Support Center</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700/50 rounded-lg p-6">
              <Mail className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Support</h3>
              <p className="text-gray-300 mb-4">
                Get help from our support team via email. We typically respond within 24 hours.
              </p>
              <a
                href="mailto:support@tenord.com"
                className="text-blue-400 hover:text-blue-300"
              >
                support@tenord.com
              </a>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-6">
              <MessageCircle className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Community Help</h3>
              <p className="text-gray-300 mb-4">
                Join our community forums to get help from other users and share your experiences.
              </p>
              <span className="text-gray-400">Coming soon</span>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-6">
            <HelpCircle className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">How do I create an account?</h4>
                <p className="text-gray-300">
                  Click the &quot;Sign me up!&quot; button on our homepage and fill out the registration form.
                </p>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">How do I join a channel?</h4>
                <p className="text-gray-300">
                  You can join existing channels or create your own. Ask for an invite link from channel members.
                </p>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Is Tenord free to use?</h4>
                <p className="text-gray-300">
                  Yes, Tenord is completely free to use with no hidden fees or premium features.
                </p>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">How do I report a problem?</h4>
                <p className="text-gray-300">
                  Contact our support team at support@tenord.com with details about the issue.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}