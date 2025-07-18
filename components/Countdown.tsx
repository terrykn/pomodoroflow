import { Button, XStack, YStack, Paragraph, H1, Text } from 'tamagui'
import { Play, Pause, Circle, CheckCircle, Check, SkipForward } from '@tamagui/lucide-icons'
import { useState, useRef, useEffect } from 'react'
import ResetSheet from './ResetSheet'
import { Audio } from 'expo-av'
import { BlurView } from 'expo-blur'
import { Vibration } from 'react-native'
import EditTask from './EditTask'
import { Task } from 'app/(tabs)'
import { saveTaskSession } from 'utils/storage'

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

    const [focusTimeSpent, setFocusTimeSpent] = useState(0)

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
        if (!isRunning || phase !== 'focus') return;

        const interval = setInterval(() => {
            setFocusTimeSpent(prev => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [isRunning, phase])

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
            Vibration.vibrate(200);

            if (phase === 'focus') {
                if (currentRound < rounds) {
                    setCurrentRound((r) => r + 1);
                    setPhase('short');
                } else {
                    setCurrentRound((r) => r + 1);
                    setPhase('long');
                }
            } else if (phase === 'short' || phase === 'long') {
                setPhase('focus');
            }
        }
    }, [timeLeft]);

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

    async function handleSkip() {
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
        } else if (phase === 'short' || phase === 'long') {
            setPhase('focus')
        }
    }

    async function saveFocusSession() {
        if (selectedTask && focusTimeSpent > 0) {
            const nowUTC = new Date();
            const session = {
                name: selectedTask.name,
                timeSpent: focusTimeSpent / 60, // convert to minutes
                date: nowUTC,
            };

            try {
                await saveTaskSession(session);
                console.log(
                    `Task saved successfully on finish: name=${session.name}, timeSpent=${session.timeSpent}, date=${session.date.toISOString()}`
                );
            } catch (error) {
                console.error('Failed to save task session on finish:', error);
            }
        }
    }

    function handleDialogFinish() {
        setIsRunning(false);
        console.log("Clicked finish")
        saveFocusSession();

        setCurrentRound(0);
        setPhase('focus');
        setTimeLeft(focusMinutes * 60);
        setFocusTimeSpent(0); // reset tracked time

        if (soundRef.current) {
            soundRef.current.stopAsync();
            soundRef.current.unloadAsync();
            soundRef.current = null;
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
        let isMounted = true;

        async function loadAndPlayMusic() {
            // stop & unload existing sound if any
            if (soundRef.current) {
                try {
                    await soundRef.current.stopAsync();
                    await soundRef.current.unloadAsync();
                } catch (e) {
                    console.warn('Error stopping/unloading audio:', e);
                }
                soundRef.current = null;
            }

            // determine which music to play
            const musicOption = phase === 'focus' ? focusMusic : breakMusic;
            const files = getAudioFiles(musicOption ?? null);
            if (!files.length) return;

            const audioModule = AUDIO_MAP[files[0]]; // always start from 0
            if (!audioModule) return;

            const { sound } = await Audio.Sound.createAsync(audioModule, {
                shouldPlay: isRunning,
                isLooping: false,
            });

            soundRef.current = sound;

            sound.setOnPlaybackStatusUpdate((status) => {
                if (!isMounted || !status.isLoaded) return;

                if (status.didJustFinish) {
                    if (phase === 'focus') {
                        setFocusMusicIndex(0);
                        setFocusMusicPosition(0);
                    } else {
                        setBreakMusicIndex(0);
                        setBreakMusicPosition(0);
                    }
                }
            });
        }

        if (isRunning) {
            loadAndPlayMusic();
        }

        return () => {
            isMounted = false;
        };
    }, [phase, focusMusic, breakMusic, isRunning]);

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