import React, { useEffect, useState } from 'react'

const SpinnerTop = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let currentProgress = 0
        let isLoading = true

        // Track simulated progress
        const updateProgress = () => {
            if (!isLoading) return

            currentProgress += 0.5
            if (currentProgress <= 80) {
                setProgress(currentProgress)
            }
        }

        // Update every 10ms for smooth animation
        const interval = setInterval(updateProgress, 10)

        // Track actual page load progress
        const trackPageLoad = () => {
            if (document.readyState === 'complete') {
                isLoading = false
                clearInterval(interval)
                setProgress(100)

                // Ensure progress bar reaches 100% even if load is fast
                setTimeout(() => {
                    currentProgress = 0
                    setProgress(0)
                }, 200)
            }
        }

        // Ensure progress bar reaches 100% even if load is fast
        const ensureComplete = () => {
            if (currentProgress < 100) {
                setProgress(100)
                setTimeout(() => {
                    currentProgress = 0
                    setProgress(0)
                }, 200)
            }
        }

        // Listen for page load events
        window.addEventListener('load', trackPageLoad)
        document.addEventListener('readystatechange', trackPageLoad)

        // Ensure progress bar reaches 100% after 1 second
        const timeout = setTimeout(ensureComplete, 1000)

        return () => {
            isLoading = false
            clearInterval(interval)
            clearTimeout(timeout)
            window.removeEventListener('load', trackPageLoad)
            document.removeEventListener('readystatechange', trackPageLoad)
        }
    }, [])

    return (
        <div className="relative min-h-[4px] w-full">
            <div
                className="absolute top-0 left-0 h-1 bg-[#1a1a1a] transition-all duration-300 ease-out"
                style={{
                    width: `${progress}%`
                }}
                role="progressbar"
                aria-label="Loading"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <span className="sr-only">Loading {Math.round(progress)}%</span>
            </div>
        </div>
    )
}

export default SpinnerTop
