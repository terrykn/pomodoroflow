import { Button, XStack, YStack, H2, Paragraph, H1 } from 'tamagui'
import { Play, Pause, RotateCcw, Circle, CheckCircle } from '@tamagui/lucide-icons'
import { useState, useRef, useEffect } from 'react'

type CountdownProps = {
    focusMinutes: number
    shortBreakMinutes: number
    longBreakMinutes: number
    rounds: number
    fontFamily?: string
}

type Phase = 'focus' | 'short' | 'long'

export default function Countdown({
    focusMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    rounds,
    fontFamily = 'System',
}: CountdownProps) {
    const [phase, setPhase] = useState<Phase>('focus')
    const [currentRound, setCurrentRound] = useState(1)
    const [isRunning, setIsRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(focusMinutes * 60)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (phase === 'focus') setTimeLeft(focusMinutes * 60)
        else if (phase === 'short') setTimeLeft(shortBreakMinutes * 60)
        else setTimeLeft(longBreakMinutes * 60)
        setIsRunning(false)
        // eslint-disable-next-line
    }, [phase, focusMinutes, shortBreakMinutes, longBreakMinutes])

    useEffect(() => {
        if (!isRunning) return
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev > 0) return prev - 1
                clearInterval(timerRef.current!)
                setIsRunning(false)

                if (phase === 'focus') {
                    if (currentRound < rounds) {
                        setPhase('short')
                    } else {
                        setPhase('long')
                    }
                } else if (phase === 'short') {
                    setCurrentRound(r => r + 1)
                    setPhase('focus')
                } else if (phase === 'long') {
                    setCurrentRound(1)
                    setPhase('focus')
                }
                return 0
            })
        }, 1000)
        return () => clearInterval(timerRef.current!)
        // eslint-disable-next-line
    }, [isRunning, phase, currentRound, rounds])

    function formatTime(sec: number) {
        const h = Math.floor(sec / 3600)
        const m = Math.floor((sec % 3600) / 60)
        const s = sec % 60
        return [
            h > 0 ? h.toString().padStart(2, '0') : null,
            m.toString().padStart(2, '0'),
            s.toString().padStart(2, '0'),
        ].filter(Boolean).join(':')
    }

    function handleStartPause() {
        setIsRunning(r => !r)
    }

    function handleReset() {
        setIsRunning(false)
        setCurrentRound(1)
        setPhase('focus')
        setTimeLeft(focusMinutes * 60)
    }

    function getPhaseLabel() {
        if (phase === 'focus') return 'Focus'
        if (phase === 'short') return 'Short Break'
        return 'Long Break'
    }

    function renderRoundCircles() {
        const filled = phase === 'long' ? rounds : Math.min(currentRound - (phase === 'focus' ? 1 : 0), rounds)
        return (
            <XStack gap="$2" mb="$3">
                {Array.from({ length: rounds }).map((_, i) =>
                    i < filled ? (
                        <CheckCircle key={i} size={20} />
                    ) : (
                        <Circle key={i} size={20} />
                    )
                )}
            </XStack>
        )
    }

    return (
        <YStack items="center" gap="$3">
            <Paragraph style={{ fontFamily }}>{getPhaseLabel()}</Paragraph>
            <H1 style={{ fontFamily }}>{formatTime(timeLeft)}</H1>
            {renderRoundCircles()}
            <XStack gap="$2">
                <Button onPress={handleStartPause}>{isRunning ? <Pause /> : <Play />}</Button>
                <Button onPress={handleReset}><RotateCcw /></Button>
            </XStack>
        </YStack>
    )
}