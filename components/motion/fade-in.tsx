"use client"

import * as React from "react"
import { motion, useReducedMotion, type Transition } from "framer-motion"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
}

function FadeIn({ children, className, delay = 0, duration = 0.5, once = true }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion()

  const transition: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration, delay, ease: "easeOut" }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once, margin: "-10%" }}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

export { FadeIn }
