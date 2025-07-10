import { Button, XStack, YStack, Paragraph, H1 } from 'tamagui'
import { Play, Pause, Circle, CheckCircle, Check } from '@tamagui/lucide-icons'
import { useState, useRef, useEffect } from 'react'
import ResetSheet from './ResetSheet'
import { Audio } from 'expo-av'

type CountdownProps = {
    focusMinutes: number
    shortBreakMinutes: number
    longBreakMinutes: number
    rounds: number
    fontFamily?: string
}

type Phase = 'focus' | 'short' | 'long'

const AUDIO_MAP: Record<string, any> = {
    'morning-forest.mp3': require('../assets/audio/morning-forest.mp3'),
    'night-forest.mp3': require('../assets/audio/night-forest.mp3'),
    'night-lofi-2.mp3': require('../assets/audio/night-lofi-2.mp3'),
    'night-lofi-3.mp3': require('../assets/audio/night-lofi-3.mp3'),
    'night-lofi-4.mp3': require('../assets/audio/night-lofi-4.mp3'),
    'night-lofi-5.mp3': require('../assets/audio/night-lofi-5.mp3'),
    'night-lofi-6.mp3': require('../assets/audio/night-lofi-6.mp3'),
    'night-lofi-7.mp3': require('../assets/audio/night-lofi-7.mp3'),
    'ocean-waves.mp3': require('../assets/audio/ocean-waves.mp3'),
    'rain.mp3': require('../assets/audio/rain.mp3'),
    'soothing-instrumental-1.mp3': require('../assets/audio/soothing-instrumental-1.mp3'),
    'soothing-instrumental-2.mp3': require('../assets/audio/soothing-instrumental-2.mp3'),
    'soothing-instrumental-3.mp3': require('../assets/audio/soothing-instrumental-3.mp3'),
    'soothing-instrumental-4.mp3': require('../assets/audio/soothing-instrumental-4.mp3'),
}

const FONT_SIZE_MAP: Record<string, number> = {
  Inter: 78,
  InterBold: 74,
  CherryCreamSoda: 67,
  Jersey15: 91,
  SairaStencilOne: 58,
  SpicyRice: 66,
  monospace: 73, 
  WDXL: 78,
}

export default function Countdown({
    focusMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    rounds,
    fontFamily = 'Inter',
    focusMusic,
    breakMusic,
}: CountdownProps & { focusMusic?: string | null; breakMusic?: string | null }) {
    const [phase, setPhase] = useState<Phase>('focus')
    const [currentRound, setCurrentRound] = useState(1)
    const [isRunning, setIsRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(focusMinutes * 60)
    const [musicIndex, setMusicIndex] = useState(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const soundRef = useRef<Audio.Sound | null>(null)

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

    // Focus phase music effect
    useEffect(() => {
        if (phase !== 'focus' || !isRunning) return

        let isMounted = true

        async function playMusic() {
            if (soundRef.current) {
                await soundRef.current.unloadAsync()
                soundRef.current = null
            }

            const files = getAudioFiles(focusMusic ?? null)
            if (!files.length) return

            let idx = musicIndex
            if (idx >= files.length) idx = 0

            const audioModule = AUDIO_MAP[files[idx]]
            if (!audioModule) return

            const { sound } = await Audio.Sound.createAsync(
                audioModule,
                { shouldPlay: true, isLooping: false }
            )
            soundRef.current = sound

            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (!isMounted) return
                if (status.isLoaded && status.didJustFinish) {
                    let nextIdx = idx + 1
                    if (nextIdx >= files.length) nextIdx = 0
                    setMusicIndex(nextIdx)
                }
            })
        }

        playMusic()

        return () => {
            isMounted = false
            if (soundRef.current) {
                soundRef.current.unloadAsync()
                soundRef.current = null
            }
        }
        // Only depend on focusMusic when in focus phase
    }, [phase, focusMusic, musicIndex, isRunning])

    // Break phase music effect
    useEffect(() => {
        if ((phase !== 'short' && phase !== 'long') || !isRunning) return

        let isMounted = true

        async function playMusic() {
            if (soundRef.current) {
                await soundRef.current.unloadAsync()
                soundRef.current = null
            }

            const files = getAudioFiles(breakMusic ?? null)
            if (!files.length) return

            let idx = musicIndex
            if (idx >= files.length) idx = 0

            const audioModule = AUDIO_MAP[files[idx]]
            if (!audioModule) return

            const { sound } = await Audio.Sound.createAsync(
                audioModule,
                { shouldPlay: true, isLooping: false }
            )
            soundRef.current = sound

            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (!isMounted) return
                if (status.isLoaded && status.didJustFinish) {
                    let nextIdx = idx + 1
                    if (nextIdx >= files.length) nextIdx = 0
                    setMusicIndex(nextIdx)
                }
            })
        }

        playMusic()

        return () => {
            isMounted = false
            if (soundRef.current) {
                soundRef.current.unloadAsync()
                soundRef.current = null
            }
        }
        // Only depend on breakMusic when in break phase
    }, [phase, breakMusic, musicIndex, isRunning])

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

    function handleDialogFinish() {
        setIsRunning(false)
        setCurrentRound(1)
        setPhase('focus')
        setTimeLeft(focusMinutes * 60)
        if (soundRef.current) {
            soundRef.current.stopAsync()
            soundRef.current.unloadAsync()
            soundRef.current = null
        }
    }

    function getPhaseLabel() {
        if (phase === 'focus') return 'Focus'
        if (phase === 'short') return 'Short Break'
        return 'Long Break'
    }

    function renderRoundCircles() {
        const filled = phase === 'long' ? rounds : Math.min(currentRound - (phase === 'focus' ? 1 : 0), rounds)
        return (
            <XStack gap="$2" mb="$4">
                {Array.from({ length: rounds }).map((_, i) =>
                    i < filled ? (
                        <CheckCircle key={`check-${i}`} size={20} />
                    ) : (
                        <Circle key={`circle-${i}`} size={20} />
                    )
                )}
            </XStack>
        )
    }

    function getAudioFiles(option: string | null) {
        if (!option) return []
        if (option === 'morning-forest') return ['morning-forest.mp3']
        if (option === 'night-forest') {
            return [
                'night-forest.mp3',
                'night-lofi-2.mp3',
                'night-lofi-3.mp3',
                'night-lofi-4.mp3',
                'night-lofi-5.mp3',
                'night-lofi-6.mp3',
                'night-lofi-7.mp3',
            ]
        }
        if (option === 'ocean-waves') return ['ocean-waves.mp3']
        if (option === 'rain') return ['rain.mp3']
        if (option === 'soothing-instrumental') {
            return [
                'soothing-instrumental-1.mp3',
                'soothing-instrumental-2.mp3',
                'soothing-instrumental-3.mp3',
                'soothing-instrumental-4.mp3',
            ]
        }
        if (option === 'night-lofi') {
            return [
                'night-lofi-2.mp3',
                'night-lofi-3.mp3',
                'night-lofi-4.mp3',
                'night-lofi-5.mp3',
                'night-lofi-6.mp3',
                'night-lofi-7.mp3',
            ]
        }
        return []
    }

    const baseFontSize = 60
    const adjustedFontSize = FONT_SIZE_MAP[fontFamily] ?? baseFontSize

    useEffect(() => {
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        })
    }, [])

    useEffect(() => {
        if (soundRef.current) {
            if (isRunning) {
                soundRef.current.playAsync()
            } else {
                soundRef.current.pauseAsync()
            }
        }
    }, [isRunning])

    return (
        <YStack width="100%" items="center" gap="$2">
            <Paragraph>{getPhaseLabel()}</Paragraph>
            <H1 mt="$2" style={{ fontFamily, fontSize: adjustedFontSize }}>{formatTime(timeLeft)}</H1>
            {renderRoundCircles()}
            <XStack gap="$2">
                <Button onPress={handleStartPause}>{isRunning ? <Pause /> : <Play />}</Button>
                <ResetSheet onFinish={handleDialogFinish} timeLeft={timeLeft} initialTime={focusMinutes * 60} />
            </XStack>
        </YStack>
    )
}