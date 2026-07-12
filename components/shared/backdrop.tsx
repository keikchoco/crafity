"use client"

import * as React from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

const GRID_SIZE = 56
const ACTIVE_LINE_RATIO = 0.35
const DOUBLE_PULSE_CHANCE = 0

const PULSE_COLORS = [
  "var(--primary)",
  "var(--info)",
  "var(--success)",
  "var(--warning)",
  "var(--chart-2)",
]

interface GridLine {
  id: string
  orientation: "vertical" | "horizontal"
  position: number
}

interface Pulse {
  id: string
  orientation: "vertical" | "horizontal"
  position: number
  color: string
  reverse: boolean
  length: number
  duration: number
  delay: number
  repeatDelay: number
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function buildLines(width: number, height: number): GridLine[] {
  const cols = Math.ceil(width / GRID_SIZE)
  const rows = Math.ceil(height / GRID_SIZE)

  const vertical: GridLine[] = Array.from({ length: cols + 1 }, (_, i) => ({
    id: `v-${i}`,
    orientation: "vertical",
    position: i * GRID_SIZE,
  }))
  const horizontal: GridLine[] = Array.from({ length: rows + 1 }, (_, i) => ({
    id: `h-${i}`,
    orientation: "horizontal",
    position: i * GRID_SIZE,
  }))

  return [...vertical, ...horizontal]
}

function buildPulses(lines: GridLine[], width: number, height: number): Pulse[] {
  if (lines.length === 0) return []

  const activeCount = Math.max(1, Math.round(lines.length * ACTIVE_LINE_RATIO))
  const activeLines = [...lines].sort(() => Math.random() - 0.5).slice(0, activeCount)

  const pulses: Pulse[] = []
  for (const line of activeLines) {
    const generatorCount = Math.random() < DOUBLE_PULSE_CHANCE ? 2 : 1
    for (let i = 0; i < generatorCount; i++) {
      pulses.push({
        id: `${line.id}-${i}`,
        orientation: line.orientation,
        position: line.position,
        color: PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)],
        reverse: Math.random() < 0.5,
        length: line.orientation === "vertical" ? height : width,
        duration: randomBetween(5.5, 6.5),
        delay: randomBetween(0, 6),
        repeatDelay: randomBetween(1.5, 5),
      })
    }
  }

  return pulses
}

const PARALLAX_DISTANCE = 48

function Backdrop() {
  const shouldReduceMotion = useReducedMotion()
  const [size, setSize] = React.useState({ width: 0, height: 0 })

  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 1000], [0, PARALLAX_DISTANCE])

  React.useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const lines = React.useMemo(
    () => (size.width && size.height ? buildLines(size.width, size.height) : []),
    [size.width, size.height],
  )

  const pulses = React.useMemo(
    () => (shouldReduceMotion ? [] : buildPulses(lines, size.width, size.height)),
    [lines, size.width, size.height, shouldReduceMotion],
  )

  return (
    <div className="techy-backdrop" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={shouldReduceMotion ? undefined : { y: parallaxY }}
      >
        <div className="techy-backdrop__glow techy-backdrop__glow--primary" />
        <div className="techy-backdrop__glow techy-backdrop__glow--info" />
        {size.width > 0 && size.height > 0 && (
          <svg className="techy-backdrop__grid -rotate-3" width={size.width} height={size.height}>
            <g className="techy-backdrop__gridlines">
              {lines.map((line) =>
                line.orientation === "vertical" ? (
                  <line key={line.id} x1={line.position} y1={0} x2={line.position} y2={size.height} />
                ) : (
                  <line key={line.id} x1={0} y1={line.position} x2={size.width} y2={line.position} />
                ),
              )}
            </g>

            {pulses.map((pulse) => {
              const from = pulse.reverse ? pulse.length : 0
              const to = pulse.reverse ? 0 : pulse.length
              const transition = {
                duration: pulse.duration,
                delay: pulse.delay,
                repeat: Infinity,
                repeatDelay: pulse.repeatDelay,
                ease: "linear" as const,
              }

              return (
                <motion.circle
                  key={pulse.id}
                  r={2.5}
                  fill={pulse.color}
                  style={{ filter: `drop-shadow(0 0 6px ${pulse.color})` }}
                  initial={
                    pulse.orientation === "vertical"
                      ? { cx: pulse.position, cy: from, opacity: 0 }
                      : { cx: from, cy: pulse.position, opacity: 0 }
                  }
                  animate={
                    pulse.orientation === "vertical"
                      ? { cy: [from, to], opacity: [0, 1, 1, 0], scaleY: [1, 2, 2, 1] }
                      : { cx: [from, to], opacity: [0, 1, 1, 0], scaleX: [1, 2, 2, 1] }
                  }
                  transition={transition}
                />
              )
            })}
          </svg>
        )}
      </motion.div>
    </div>
  )
}

export { Backdrop }
