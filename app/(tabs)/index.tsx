import { useState, useEffect } from 'react'
import { YStack, Button, XStack, Paragraph } from 'tamagui'
import { ActivityIndicator } from 'react-native' // For loading spinner
import Countdown from 'components/Countdown'
import MusicSheet from 'components/MusicSheet'
import ThemeSheet from 'components/ThemeSheet'
import TimerSettingSheet from 'components/TimerSettingSheet'
import { Music, Settings2 } from '@tamagui/lucide-icons'
import { useWindowDimensions } from 'react-native'
import { LiquidGaugeModified } from 'components/LiquidGaugeModified'

import { saveToStorage, loadFromStorage, STORAGE_KEYS } from 'utils/storage'

const DEFAULT = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  rounds: 4,
  fontFamily: 'monospace',
  focusMusic: null,
  breakMusic: null,
}

export const DEFAULT_TASK: Task = {
  name: 'Focus',
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  rounds: 4,
}

export type Task = {
  name: string
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  rounds: number
}

export default function TabFocusScreen() {
  const [focusMinutes, setFocusMinutes] = useState(DEFAULT.focusMinutes)
  const [shortBreakMinutes, setShortBreakMinutes] = useState(DEFAULT.shortBreakMinutes)
  const [longBreakMinutes, setLongBreakMinutes] = useState(DEFAULT.longBreakMinutes)
  const [rounds, setRounds] = useState(DEFAULT.rounds)

  const [musicOpen, setMusicOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [timerSettingOpen, setTimerSettingOpen] = useState(false)

  const [progress, setProgress] = useState(0)

  const [tasks, setTasks] = useState<Task[]>([DEFAULT_TASK])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [focusMusic, setFocusMusic] = useState<string | null>(null)
  const [breakMusic, setBreakMusic] = useState<string | null>(null)

  const [storageLoaded, setStorageLoaded] = useState(false)

  const { width, height } = useWindowDimensions()

  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const storedTasks = await loadFromStorage<Task[]>(STORAGE_KEYS.TASKS)
        const storedSelectedTask = await loadFromStorage<Task>(STORAGE_KEYS.SELECTED_TASK)
        const storedFocusMusic = await loadFromStorage<string | null>(STORAGE_KEYS.FOCUS_MUSIC)
        const storedBreakMusic = await loadFromStorage<string | null>(STORAGE_KEYS.BREAK_MUSIC)

        setTasks(storedTasks && storedTasks.length > 0 ? storedTasks : [DEFAULT_TASK])
        setSelectedTask(storedSelectedTask || DEFAULT_TASK)
        setFocusMusic(storedFocusMusic !== undefined ? storedFocusMusic : DEFAULT.focusMusic)
        setBreakMusic(storedBreakMusic !== undefined ? storedBreakMusic : DEFAULT.breakMusic)
      } catch (error) {
        setTasks([DEFAULT_TASK])
        setSelectedTask(DEFAULT_TASK)
        setFocusMusic(DEFAULT.focusMusic)
        setBreakMusic(DEFAULT.breakMusic)
      } finally {
        setStorageLoaded(true) // signal that loading is done
      }
    }

    loadPersistedData()
  }, [])

  useEffect(() => {
    if (storageLoaded && selectedTask) {
      setFocusMinutes(selectedTask.focusMinutes)
      setShortBreakMinutes(selectedTask.shortBreakMinutes)
      setLongBreakMinutes(selectedTask.longBreakMinutes)
      setRounds(selectedTask.rounds)
    }
  }, [storageLoaded, selectedTask])

  useEffect(() => {
    if (selectedTask) saveToStorage(STORAGE_KEYS.SELECTED_TASK, selectedTask)
  }, [selectedTask])

  useEffect(() => {
    if (tasks) saveToStorage(STORAGE_KEYS.TASKS, tasks)
  }, [tasks])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FOCUS_MUSIC, focusMusic)
  }, [focusMusic])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BREAK_MUSIC, breakMusic)
  }, [breakMusic])

  // Show loading spinner until storage is loaded and states are ready
  if (!storageLoaded || !tasks || !selectedTask) {
    return (
      <YStack flex={1} justify="center" items="center" bg="$background">
        <ActivityIndicator size="large" color="$white3" />
      </YStack>
    )
  }

  return (
    <>
      {/* Liquid Gauge Background */}
      <YStack
        bg="$background"
        items="center"
        justify="center"
        z={-2}
        height={height}
        width={width}
        position="absolute"
      >
        <LiquidGaugeModified
          height={height}
          width={width}
          value={progress * 100}
          config={{
            minValue: 0,
            maxValue: 100,
            circleThickness: 0,
            circleFillGap: 0,
            circleColor: 'transparent',
            waveHeight: 0.023,
            waveCount: 1.2,
            waveRiseTime: 1400,
            waveAnimateTime: 6000,
            waveRise: true,
            waveHeightScaling: true,
            waveAnimate: true,
            waveColor: 'rgba(20, 91, 232, 1)',
            waveOffset: 0.2,
            textSuffix: '',
            textSize: 0,
          }}
        />
      </YStack>

      {/* UI Controls */}
      <XStack pt="$9" bg="transparent" position="absolute" r={0}>
        <Button circular bg="transparent" onPress={() => setMusicOpen(true)}>
          <Music />
        </Button>
        {/* Uncomment if theme selection is desired */}
        {/* <Button circular bg="transparent" onPress={() => setThemeOpen(true)}>
          <Paintbrush />
        </Button> */}
        <Button circular bg="transparent" onPress={() => setTimerSettingOpen(true)} mr="$4">
          <Settings2 />
        </Button>
      </XStack>

      {/* Main Content */}
      <YStack flex={1} items="center" justify="center" gap="$6" bg="transparent">
        <Countdown
          focusMinutes={focusMinutes}
          shortBreakMinutes={shortBreakMinutes}
          longBreakMinutes={longBreakMinutes}
          rounds={rounds}
          focusMusic={focusMusic}
          breakMusic={breakMusic}
          onProgressChange={setProgress}
          tasks={tasks}
          setTasks={setTasks}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />

        <MusicSheet
          open={musicOpen}
          onOpenChange={setMusicOpen}
          focusMusic={focusMusic}
          breakMusic={breakMusic}
          setFocusMusic={setFocusMusic}
          setBreakMusic={setBreakMusic}
        />
        <ThemeSheet open={themeOpen} onOpenChange={setThemeOpen} />
        <TimerSettingSheet
          open={timerSettingOpen}
          onOpenChange={setTimerSettingOpen}
          focusMinutes={focusMinutes}
          shortBreakMinutes={shortBreakMinutes}
          longBreakMinutes={longBreakMinutes}
          rounds={rounds}
          setFocusMinutes={setFocusMinutes}
          setShortBreakMinutes={setShortBreakMinutes}
          setLongBreakMinutes={setLongBreakMinutes}
          setRounds={setRounds}
        />
      </YStack>
    </>
  )
}
