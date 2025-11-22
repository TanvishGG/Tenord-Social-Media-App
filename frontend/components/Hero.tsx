"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
function shuffleArray<T>(source: T[]): T[] {
    const array = [...source]
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


export default function Hero() {
    const [values, setValues] = useState(["Channels", "Dms", "Privacy", "Invites", "Encryption","Free to Use", "Open Source", "Rich Profiles", "Clean UI"]);
    const [xValues] = useState(["0%","15%", "30%", "45%", "60%", "75%"]);
    const [delays, setDelays] = useState([2, 3, 5, 7, 11, 13, 2.5, 3.5, 5.5]);
    useEffect(() => {
        setValues(shuffleArray(values));
        setDelays(shuffleArray(delays));
        const interval = setInterval(() => {
            setDelays(shuffleArray(delays));
        }, 10000);
        return () => {
            clearInterval(interval);
        }
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            whileHover={{ boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)" }}
            className="mt-3 z-1 grid min-h-[50vh] grid-cols-1 sm:grid-cols-2 bg-white/10 rounded-xl backdrop-blur-[5px] w-full h-full p-4">
            <div className="w-full flex flex-col items-center justify-center">
                <motion.h1
                    whileHover={{ color: "cyan" }}
                    whileInView={{ opacity: 1 }}
                    className="text-5xl text-white text-center m-3">Tenord</motion.h1>
                <p className="text-white">Connect beyond the screen, where conversations come alive.</p>
                <Link href="/register">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        whileTap={{ scale: 0.9, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)", backgroundColor: "rgba(255, 255, 255, 0.01)" }}
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)", backgroundColor: "rgba(255, 255, 255, 0.01)" }}
                        className="text-white p-3 rounded-xl bg-white/20 my-3 cursor-pointer">Sign me up!</motion.div>
                </Link>
            </div>
            <motion.div
                className="relative w-full h-full flex min-h-[30vh] overflow-hidden"
            >
                {
                    values.map((x, index) => (
                        <motion.p
                            key={`${x}-${index}`}
                            initial={{ opacity: 1, bottom: 0, left: xValues[index % xValues.length] }}
                            whileInView={{ opacity: [0, 0.3, 0.5, 0.7, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0], transform: "translateY(-30vh)"  }}
                            transition={{ 
                                duration: 3, 
                                delay: delays[index % delays.length] * 0.5,
                                ease: "easeInOut", 
                                repeat: Infinity, 
                                repeatType: "loop" 
                            }}
                            className="p-3 bg-black/10 bg-blend-color shadow-sm shadow-white/20 absolute backdrop-blur-[3px] border-r-2 border-white/20 rounded-xl w-fit"
                        >{x}</motion.p>
                    ))
                }
            </motion.div>
        </motion.div>
    )
}