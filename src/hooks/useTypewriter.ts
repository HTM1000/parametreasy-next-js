import { useState, useEffect } from "react"

interface UseTypewriterOptions {
  text: string
  speed?: number
  charsPerStep?: number
  onComplete?: () => void
}

export function useTypewriter({
  text,
  speed = 3,
  charsPerStep = 15,
  onComplete
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplayedText("")
      setIsTyping(false)
      return
    }

    setIsTyping(true)
    setDisplayedText("")
    let currentIndex = 0

    const typeWriter = () => {
      if (currentIndex < text.length) {
        const charsToAdd = Math.min(charsPerStep, text.length - currentIndex)
        setDisplayedText(text.slice(0, currentIndex + charsToAdd))
        currentIndex += charsToAdd
        setTimeout(typeWriter, speed)
      } else {
        setIsTyping(false)
        onComplete?.()
      }
    }

    setTimeout(typeWriter, 50)
  }, [text, speed, charsPerStep, onComplete])

  return {
    displayedText,
    isTyping
  }
}