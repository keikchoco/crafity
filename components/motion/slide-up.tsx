"use client"

import * as React from "react"
import { motion, useReducedMotion, type Transition } from "framer-motion"

interface SlideUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
}

function SlideUp({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 24,
  once = true,
}: SlideUpProps) {
  const shouldReduceMotion = useReducedMotion()

  const transition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration, delay, ease: "easeOut" }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10%" }}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

export { SlideUp }
