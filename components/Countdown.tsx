import { Button, XStack, YStack, Paragraph, H1 } from 'tamagui'
import { Play, Pause, Circle, CheckCircle, Check, SkipForward } from '@tamagui/lucide-icons'
import { useState, useRef, useEffect } from 'react'
import ResetSheet from './ResetSheet'
import { Audio } from 'expo-av'
import { BlurView } from 'expo-blur'
import { Vibration } from 'react-native'
import EditTask from './EditTask'
import { Task } from 'app/(tabs)'

type CountdownProps = {
    focusMinutes: number
    shortBreakMinutes: number
    longBreakMinutes: number
    rounds: number
    focusMusic?: string | null
    breakMusic?: string | null
    onProgressChange?: (progress: number) => void
    tasks: Task[]
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
    selectedTask: Task | null
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>
}

type Phase = 'focus' | 'short' | 'long'

const AUDIO_MAP: Record<string, any> = {
    'microwave-ding.mp3': require('../assets/audio/microwave-ding.mp3'),
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

export default function Countdown({
    focusMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    rounds,
    focusMusic,
    breakMusic,
    onProgressChange,
    tasks,
    setTasks,
    selectedTask,
    setSelectedTask,
}: CountdownProps) {

    const [phase, setPhase] = useState<Phase>('focus')
    const [currentRound, setCurrentRound] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(focusMinutes * 60)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const soundRef = useRef<Audio.Sound | null>(null)

    const [focusMusicIndex, setFocusMusicIndex] = useState(0)
    const [focusMusicPosition, setFocusMusicPosition] = useState(0)
    const [breakMusicIndex, setBreakMusicIndex] = useState(0)
    const [breakMusicPosition, setBreakMusicPosition] = useState(0)

    useEffect(() => {
        async function stopAndResetAudio() {
            if (soundRef.current) {
                const status = await soundRef.current.getStatusAsync();
                if (status.isLoaded) {
                    await soundRef.current.stopAsync();
                    await soundRef.current.unloadAsync();
                }
                soundRef.current = null;
            }
        }

        stopAndResetAudio();
    }, [phase]);

    useEffect(() => {
        if (phase === 'focus') setTimeLeft(focusMinutes * 60)
        else if (phase === 'short') setTimeLeft(shortBreakMinutes * 60)
        else setTimeLeft(longBreakMinutes * 60)
        setIsRunning(false)
        // eslint-disable-next-line
    }, [phase, focusMinutes, shortBreakMinutes, longBreakMinutes])

    useEffect(() => {
        if (!isRunning) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const next = prev - 1;
                return next >= 0 ? next : 0;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    useEffect(() => {
        async function controlSound() {
            if (!soundRef.current) return

            if (isRunning) {
                await soundRef.current.playAsync()
            } else {
                const status = await soundRef.current.getStatusAsync()
                if (status.isLoaded) {
                    const currentPosition = status.positionMillis
                    if (phase === 'focus') {
                        setFocusMusicPosition(currentPosition)
                    } else if (phase === 'short' || phase === 'long') {
                        setBreakMusicPosition(currentPosition)
                    }
                    await soundRef.current.pauseAsync()
                }
            }
        }
        controlSound()
    }, [isRunning, phase])

    // Separate effect to handle timeLeft changes:
    useEffect(() => {
        if (!isRunning) return;

        const total =
            phase === 'focus'
                ? focusMinutes * 60
                : phase === 'short'
                    ? shortBreakMinutes * 60
                    : longBreakMinutes * 60;

        const progress = Math.max(0, 1 - timeLeft / total);
        onProgressChange?.(progress);

        if (timeLeft === 0) {
            setIsRunning(false);
            playDingSound();
            Vibration.vibrate(200)

            if (phase === 'focus') {
                if (currentRound < rounds) {
                    setCurrentRound(r => r + 1);
                    setPhase('short');
                } else {
                    setCurrentRound(r => r + 1);
                    setPhase('long');
                }
            } else if (phase === 'short' || phase === 'long') {
                setPhase('focus');
            }
        }
    }, [timeLeft]);


    // Focus phase music effect
    useEffect(() => {
        if (phase !== 'focus' || !isRunning) return

        let isMounted = true

        async function playMusic() {
            if (soundRef.current) {
                const status = await soundRef.current.getStatusAsync()
                if (status.isLoaded) {
                    await soundRef.current.setPositionAsync(focusMusicPosition)
                    await soundRef.current.playAsync()
                    return
                } else {
                    await soundRef.current.unloadAsync()
                    soundRef.current = null
                }
            }

            const files = getAudioFiles(focusMusic ?? null)
            if (!files.length) return

            let idx = focusMusicIndex
            if (idx >= files.length) idx = 0

            const audioModule = AUDIO_MAP[files[idx]]
            if (!audioModule) return

            const { sound } = await Audio.Sound.createAsync(audioModule, {
                shouldPlay: true,
                isLooping: false,
            })
            soundRef.current = sound

            sound.setOnPlaybackStatusUpdate((status) => {
                if (!isMounted) return
                if (status.isLoaded && status.didJustFinish) {
                    let nextIdx = idx + 1
                    if (nextIdx >= files.length) nextIdx = 0
                    setFocusMusicIndex(nextIdx)
                    setFocusMusicPosition(0)
                }
            })
        }

        playMusic()

        return () => {
            isMounted = false
        }
    }, [phase, focusMusic, focusMusicIndex, isRunning, focusMusicPosition])

    // Break phase music effect
    useEffect(() => {
        if ((phase !== 'short' && phase !== 'long') || !isRunning) return

        let isMounted = true

        async function playMusic() {
            if (soundRef.current) {
                const status = await soundRef.current.getStatusAsync()
                if (status.isLoaded) {
                    await soundRef.current.setPositionAsync(breakMusicPosition)
                    await soundRef.current.playAsync()
                    return
                } else {
                    await soundRef.current.unloadAsync()
                    soundRef.current = null
                }
            }

            const files = getAudioFiles(breakMusic ?? null)
            if (!files.length) return

            let idx = breakMusicIndex
            if (idx >= files.length) idx = 0

            const audioModule = AUDIO_MAP[files[idx]]
            if (!audioModule) return

            const { sound } = await Audio.Sound.createAsync(audioModule, {
                shouldPlay: true,
                isLooping: false,
            })
            soundRef.current = sound

            sound.setOnPlaybackStatusUpdate((status) => {
                if (!isMounted) return
                if (status.isLoaded && status.didJustFinish) {
                    let nextIdx = idx + 1
                    if (nextIdx >= files.length) nextIdx = 0
                    setBreakMusicIndex(nextIdx)
                    setBreakMusicPosition(0)
                }
            })
        }

        playMusic()

        return () => {
            isMounted = false
        }
    }, [phase, breakMusic, breakMusicIndex, isRunning, breakMusicPosition])

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync()
                soundRef.current = null
            }
        }
    }, [])

    async function playDingSound() {
        try {
            const { sound } = await Audio.Sound.createAsync(
                AUDIO_MAP['microwave-ding.mp3'],
                { shouldPlay: true }
            )

            await sound.playAsync()
            sound.setOnPlaybackStatusUpdate((status) => {
                if (!status.isLoaded) return
                if (status.didJustFinish) {
                    sound.unloadAsync()
                }
            })
        } catch (e) {
            console.error('Failed to play ding sound', e)
        }
    }

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

    function handleSkip() {
        setIsRunning(false)
        clearInterval(timerRef.current!)

        if (phase === 'focus') {
            if (currentRound < rounds) {
                setCurrentRound(r => r + 1)
                setPhase('short')
            } else {
                setCurrentRound(r => r + 1)
                setPhase('long')
            }
        } else if (phase === 'short') {

            setPhase('focus')
        } else if (phase === 'long') {

            setPhase('focus')
        }
    }

    function handleDialogFinish() {
        setIsRunning(false)
        setCurrentRound(0)
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
        const filled = Math.min(currentRound, rounds)

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

    useEffect(() => {
        setIsRunning(false)

        if (phase === 'focus') {
            setTimeLeft(focusMinutes * 60)
        } else if (phase === 'short') {
            setTimeLeft(shortBreakMinutes * 60)
        } else if (phase === 'long') {
            setTimeLeft(longBreakMinutes * 60)
        }
    }, [selectedTask])

    return (
        <YStack width="100%" items="center" gap="$2">
            {phase === "focus" ? (
                <EditTask
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                    tasks={tasks}
                    setTasks={setTasks}
                />
            ) : (
                <Paragraph>{getPhaseLabel()}</Paragraph>
            )}
            <H1 mt="$4" style={{ fontSize: 78, fontWeight: 100 }}>{formatTime(timeLeft)}</H1>
            {renderRoundCircles()}
            <XStack gap="$2" items="center">
                <ResetSheet onFinish={handleDialogFinish} timeLeft={timeLeft} initialTime={focusMinutes * 60} />
                <BlurView intensity={50} tint="dark" style={{ borderRadius: 35, overflow: 'hidden' }}>
                    <Button
                        circular
                        size={70}
                        chromeless
                        bg="rgba(255, 255, 255, 0.03)"
                        borderColor="rgba(255,255,255,0.1)"
                        borderWidth={1}
                        onPress={handleStartPause}
                    >
                        {isRunning ? <Pause /> : <Play />}
                    </Button>
                </BlurView>
                <BlurView intensity={50} tint="dark" style={{ borderRadius: 35, overflow: 'hidden' }}>
                    <Button
                        circular
                        chromeless
                        bg="rgba(255, 255, 255, 0.03)"
                        borderColor="rgba(255,255,255,0.1)"
                        borderWidth={1}
                        onPress={handleSkip}
                    >
                        <SkipForward />
                    </Button>
                </BlurView>
            </XStack>
        </YStack>
    )
}