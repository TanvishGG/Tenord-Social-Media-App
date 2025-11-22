"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    function MenuIcon() {
        return (
            <motion.div
                onClick={() => setIsOpen(!isOpen)}
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                whileTap={{ scale: 0.9, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)", backgroundColor: "rgba(255, 255, 255, 0.01)" }}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)", backgroundColor: "rgba(255, 255, 255, 0.005)" }}
                className="text-white z-10 block md:hidden cursor-pointer hover:text-gray-300 bg-white/5 p-2 rounded-xl shadow-sm shadow-white/20 backdrop-blur-[5px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </motion.div>
        )
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="flex h-16 p-3 w-full backdrop-blur-[5px] sticky bg-white/10 bg-blend-color-burn rounded-xl z-20">
            <div className="flex items-center justify-between w-full">
                <Link href="/" legacyBehavior passHref>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-rubik font-bold text-white no-underline cursor-pointer">
                        Tenord
                    </motion.a>
                </Link>
                <ul className="flex items-center space-x-4">
                    <HeaderButton href="/login" name="Login" />
                    <HeaderButton href="/privacy-policy" name="Privacy" />
                    <HeaderButton href="/terms-and-conditions" name="Terms" />
                    <HeaderButton href="/support" name="Support" />
                    <MenuIcon />
                </ul>
            </div>            {isOpen && <motion.div
                className="fixed flex flex-col top-19 right-0 rounded-xl z-30 backdrop-blur-xl gap-2 bg-white/10 border border-white/40 p-4"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
            >
                <MenuButton href="/login" name="Login" />
                <MenuButton href="/privacy-policy" name="Privacy" />
                <MenuButton href="/terms-and-conditions" name="Terms" />
                <MenuButton href="/support" name="Support" />
            </motion.div>}
        </motion.div>

    )
}

function MenuButton({ href, name }: { href: string; name: string }) {
    return (
        <Link href={href} legacyBehavior passHref>
            <motion.a
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                whileTap={{ scale: 0.9, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)", backgroundColor: "rgba(255, 255, 255, 0.01)" }}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)", backgroundColor: "rgba(255, 255, 255, 0.005)" }}
                className="text-white block md:hidden hover:text-gray-300 bg-white/5 border border-white/20 p-2 rounded-xl shadow-sm shadow-white/20 backdrop-blur-[5px] cursor-pointer">
                {name}
            </motion.a>
        </Link>

    )

}
function HeaderButton({ href, name }: { href: string; name: string }) {
    return (
        <Link href={href} legacyBehavior passHref>
            <motion.a
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                whileTap={{ scale: 0.9, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)", backgroundColor: "rgba(255, 255, 255, 0.01)" }}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)", backgroundColor: "rgba(255, 255, 255, 0.005)" }}
                className="text-white hidden md:block hover:text-gray-300 bg-white/5 p-2 rounded-xl shadow-sm shadow-white/20 backdrop-blur-[5px] cursor-pointer">
                {name}
            </motion.a>
        </Link>
    )
}

