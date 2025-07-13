import { useState, useEffect } from 'react'
import { YStack, Button, XStack, Paragraph } from 'tamagui'
import Countdown from 'components/Countdown'
import MusicSheet from 'components/MusicSheet'
import ThemeSheet from 'components/ThemeSheet'
import { Music, Paintbrush, Settings2 } from '@tamagui/lucide-icons'
import TimerSettingSheet from 'components/TimerSettingSheet'
import { useWindowDimensions } from 'react-native'
import { LiquidGaugeModified } from 'components/LiquidGaugeModified'

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
  const [focusMusic, setFocusMusic] = useState(DEFAULT.focusMusic)
  const [breakMusic, setBreakMusic] = useState(DEFAULT.breakMusic)

  const [musicOpen, setMusicOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [timerSettingOpen, setTimerSettingOpen] = useState(false)

  const [progress, setProgress] = useState(0)

  const [tasks, setTasks] = useState<Task[]>([DEFAULT_TASK])
  const [selectedTask, setSelectedTask] = useState<Task | null>(DEFAULT_TASK)

  const { width, height } = useWindowDimensions()

  useEffect(() => {
    if (selectedTask) {
      setFocusMinutes(selectedTask.focusMinutes)
      setShortBreakMinutes(selectedTask.shortBreakMinutes)
      setLongBreakMinutes(selectedTask.longBreakMinutes)
      setRounds(selectedTask.rounds)
    }
  }, [selectedTask])

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
            waveRiseTime: 1800,
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

      {/* Rest of the UI on top of the Liquid Gauge */}
      <XStack pt="$9" bg="transparent" position="absolute" r={0}>
        <Button circular bg="transparent" onPress={() => setMusicOpen(true)}><Music /></Button>

        {/* still debating if I want people to choose theme */}
        {/*<Button circular bg="transparent" onPress={() => setThemeOpen(true)}><Paintbrush /></Button>*/}

        <Button circular bg="transparent" onPress={() => setTimerSettingOpen(true)} mr="$4"><Settings2 /></Button>
      </XStack>

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
        <ThemeSheet
          open={themeOpen}
          onOpenChange={setThemeOpen}
        />
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
