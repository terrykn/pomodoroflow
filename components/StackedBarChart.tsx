import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from '@tamagui/lucide-icons'
import { BlurView } from 'expo-blur'
import React, { useState, useMemo } from 'react'
import { View, Text, YStack, XStack, Button, H5, ScrollView } from 'tamagui'

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

type WeekTask = {
  name: string
  timeSpent: number
  date: string // ISO format
}

const colorPalette = [
  '#9ACD32', '#FFA07A', '#87CEFA', '#BA55D3', '#FFB6C1', '#40E0D0',
  '#FFD700', '#FF69B4', '#7B68EE', '#20B2AA', '#FF6347', '#4682B4',
  '#32CD32', '#D2691E', '#6495ED', '#DC143C', '#00CED1', '#FF8C00',
  '#6A5ACD', '#008080',
]

const getStartOfWeek = (date: Date) => {
  const day = date.getDay()
  const diff = date.getDate() - day
  return new Date(date.setDate(diff))
}

const buildFullWeek = (startDate: Date): Date[] =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    return d
  })

const groupTasksByDate = (tasks: WeekTask[], weekDates: Date[]): WeekTask[][] => {
  return weekDates.map((date) => {
    const dayStr = date.toISOString().split('T')[0]
    return tasks.filter(task => task.date.startsWith(dayStr))
  })
}

const getTimeSpentPerTask = (tasks: WeekTask[]) => {
  const taskMap: Record<string, number> = {}
  for (const task of tasks) {
    taskMap[task.name] = (taskMap[task.name] || 0) + task.timeSpent
  }
  return Object.entries(taskMap)
    .map(([name, time]) => ({ name, time }))
    .sort((a, b) => b.time - a.time)
}

const formatMinutes = (mins: number): string => {
  if (mins < 1) {
    // Show seconds if less than 1 minute
    const seconds = Math.round(mins * 60)
    return `${seconds}s`
  }
  const hours = Math.floor(mins / 60)
  const minutes = Math.floor(mins % 60)
  return `${hours > 0 ? `${hours}hr ` : ''}${minutes}min`
}

const calcPercentageChange = (current: number, previous: number) => {
  if (previous === 0 && current === 0) return 0
  if (previous === 0) return 100
  return ((current - previous) / previous) * 100
}

type StackedBarChartProps = {
  thisWeekTasks: WeekTask[]
  lastWeekTasks: WeekTask[]
}

const Badge = ({
  percentChange,
}: {
  percentChange: number
}) => {
  const isUp = percentChange >= 0
  const absPercent = Math.abs(percentChange).toFixed(0)
  const color = isUp ? '#4CAF50' : '#F44336' // green for up, red for down
  return (
    <XStack
      ai="center"
      gap={2}
      px={6}
      py={2}
      borderRadius={9}
      bg={color + '33'}
      height="auto"
      items="center"
      mt="$4"
      mb="$2"
    >
      {isUp ? (
        <ChevronUp color={color} size={14} />
      ) : (
        <ChevronDown color={color} size={14} />
      )}
      <Text fontSize={12} fontWeight="600" color={color}>
        {absPercent}%
      </Text>
    </XStack>
  )
}

export const StackedBarChart = ({ thisWeekTasks, lastWeekTasks }: StackedBarChartProps) => {
  const [showLastWeek, setShowLastWeek] = useState(false)

  const referenceDate = thisWeekTasks[0]
    ? new Date(thisWeekTasks[0].date)
    : new Date()

  const startOfThisWeek = getStartOfWeek(new Date(referenceDate))
  const thisWeekDates = buildFullWeek(startOfThisWeek)

  const startOfLastWeek = new Date(startOfThisWeek)
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7)
  const lastWeekDates = buildFullWeek(startOfLastWeek)

  const thisWeekGrouped = groupTasksByDate(thisWeekTasks, thisWeekDates)
  const lastWeekGrouped = groupTasksByDate(lastWeekTasks, lastWeekDates)

  const getMaxBarHeight = (weeklyTasks: WeekTask[][]): number => {
    return weeklyTasks.reduce((max, dayTasks) => {
      const total = dayTasks.reduce((sum, task) => sum + task.timeSpent, 0)
      return Math.max(max, total)
    }, 0) || 1
  }

  const activeDates = showLastWeek ? lastWeekDates : thisWeekDates
  const activeGrouped = showLastWeek ? lastWeekGrouped : thisWeekGrouped
  const activeTasks = showLastWeek ? lastWeekTasks : thisWeekTasks

  const maxHeight = getMaxBarHeight(activeGrouped)
  const barMaxHeightPx = 120

  const monthName = activeDates[0].toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  })

  const taskColorMap = useMemo(() => {
    const uniqueTasks = [...new Set(activeTasks.map(t => t.name))]
    const map: Record<string, string> = {}
    uniqueTasks.forEach((name, index) => {
      map[name] = colorPalette[index % colorPalette.length]
    })
    return map
  }, [activeTasks])

  // This week totals
  const totalTimeThisWeek = thisWeekGrouped.reduce((sum, dayTasks) => {
    return sum + dayTasks.reduce((daySum, task) => daySum + task.timeSpent, 0)
  }, 0)
  const dailyAverageThisWeek = totalTimeThisWeek / 7

  // Last week totals
  const totalTimeLastWeek = lastWeekGrouped.reduce((sum, dayTasks) => {
    return sum + dayTasks.reduce((daySum, task) => daySum + task.timeSpent, 0)
  }, 0)
  const dailyAverageLastWeek = totalTimeLastWeek / 7

  // Calculate percentage changes comparing this week vs last week
  const dailyAvgChange = calcPercentageChange(dailyAverageThisWeek, dailyAverageLastWeek)

  // Displayed values depend on which week is active
  const totalTimeForWeek = showLastWeek ? totalTimeLastWeek : totalTimeThisWeek
  const dailyAverageTime = showLastWeek ? dailyAverageLastWeek : dailyAverageThisWeek

  return (
    <YStack gap="$2">
      <XStack mb="$2" justify="space-between" items="center">
        <Text fontSize={20} fontWeight={300}>{monthName}</Text>
        <BlurView intensity={50} tint="dark" style={{ borderRadius: 35, overflow: 'hidden' }}>
          <Button
            circular
            borderWidth={1}
            chromeless
            bg="rgba(255, 255, 255, 0.03)"
            borderColor="rgba(255,255,255,0.1)"
            onPress={() => setShowLastWeek(!showLastWeek)}
          >
            {showLastWeek ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </BlurView>
      </XStack>

      <XStack justify="space-between" px={10}>
        {daysOfWeek.map((day, index) => (
          <Text key={`day-${index}`} fontWeight="600" fontSize={12} width={20} textAlign="center">
            {day}
          </Text>
        ))}
      </XStack>

      <XStack justify="space-between" px={10} mb={6}>
        {activeDates.map((date, index) => (
          <Text key={`date-${index}`} fontSize={12} color="#666" width={20} textAlign="center">
            {date.getDate()}
          </Text>
        ))}
      </XStack>

      <XStack justify="space-between" px={10}>
        {activeGrouped.map((tasksThisDay, dayIndex) => {
          const totalHeight = tasksThisDay.reduce((sum, t) => sum + t.timeSpent, 0)
          const barHeight = (totalHeight / maxHeight) * barMaxHeightPx

          return (
            <YStack key={dayIndex} items="center" justify="flex-end" height={barMaxHeightPx} width={20}>
              <View
                height={barHeight}
                width="100%"
                borderTopLeftRadius={6}
                borderTopRightRadius={6}
                borderBottomLeftRadius={6}
                borderBottomRightRadius={6}
                overflow="hidden"
                bg="#ddd"
              >
                <YStack style={{ flex: 1 }} justify="flex-end">
                  {tasksThisDay.map((task, i) => {
                    const height = (task.timeSpent / totalHeight) * barHeight
                    const color = taskColorMap[task.name]
                    return (
                      <View
                        key={`bar-${i}`}
                        width="100%"
                        height={height}
                        bg={color}
                      />
                    )
                  })}
                </YStack>
              </View>
            </YStack>
          )
        })}
      </XStack>

      <XStack mt="$4" gap="$2" justify="space-between" items="center">
        <View flex={1} bg="$black2" p="$3" borderRadius="$7" flexDirection="row" alignItems="center">
          <YStack>
            <Text fontSize={14} fontWeight={300}>Daily Average</Text>
            <H5>{formatMinutes(Math.round(dailyAverageTime))}</H5>
          </YStack>
        </View>
        <View flex={1} bg="$black2" p="$3" borderRadius="$7" flexDirection="row" alignItems="center">
          <YStack>
            <Text fontSize={14} fontWeight={300}>{showLastWeek ? 'Last Week' : 'This Week'}</Text>
            <H5>{formatMinutes(totalTimeForWeek)}</H5>
          </YStack>
        </View>
      </XStack>

      <XStack gap="$2" items="center" >
        <Text fontSize={20} fontWeight={300} mt="$4" mb="$2">Time Spent</Text>
        {!showLastWeek && <Badge percentChange={dailyAvgChange} />}
      </XStack>
      
      <YStack gap="$2" height="37%">
        <ScrollView style={{ maxHeight: '100%' }} showsVerticalScrollIndicator={false}>
          {getTimeSpentPerTask(activeTasks).map((task, index) => (
            <View key={index} bg="$black2" p="$4" borderRadius="$6" mb="$2">
              <XStack justify="space-between" alignItems="center">
                <XStack alignItems="center" gap="$2">
                  <View
                    width={12}
                    height={12}
                    borderRadius={6}
                    backgroundColor={taskColorMap[task.name]}
                  />
                  <Text fontSize={14}>{task.name}</Text>
                </XStack>
                <Text fontSize={14} color="#999">{formatMinutes(task.time)}</Text>
              </XStack>
            </View>
          ))}
        </ScrollView>
      </YStack>
    </YStack>
  )
}
