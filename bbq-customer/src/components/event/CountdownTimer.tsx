'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  eventDate: string // ISO date string
}

export function CountdownTimer({ eventDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  })

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const eventTime = new Date(eventDate).getTime()
      const timeDiff = eventTime - now

      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

        setTimeLeft({ days, hours, minutes })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 })
      }
    }

    // Update immediately
    updateCountdown()

    // Update every minute
    const interval = setInterval(updateCountdown, 60000)

    return () => clearInterval(interval)
  }, [eventDate])

  return (
    <div className="countdown-timer">
      <div className="countdown-unit">
        <span className="countdown-number">
          {timeLeft.days.toString().padStart(2, '0')}
        </span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-number">
          {timeLeft.hours.toString().padStart(2, '0')}
        </span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-number">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </span>
        <span className="countdown-label">Minutes</span>
      </div>
    </div>
  )
}