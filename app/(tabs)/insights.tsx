import { Text, View, Button, H5, Paragraph, YStack, XStack } from 'tamagui'
import { useRouter } from 'expo-router'
import { StackedBarChart } from 'components/StackedBarChart'
import { H6 } from 'tamagui'

import { useEffect, useState } from 'react'
import { STORAGE_KEYS, loadFromStorage, TaskSession } from 'utils/storage'

import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'

export type WeekTask = {
  name: string
  timeSpent: number
  date: string // ISO date string like '2025-07-13'
}

export default function TabInsightsScreen() {
  const isLoggedIn = true // Replace with your auth state
  const router = useRouter()


  const [thisWeekTasks, setThisWeekTasks] = useState<WeekTask[]>([])
  const [lastWeekTasks, setLastWeekTasks] = useState<WeekTask[]>([])

  useFocusEffect(
    useCallback(() => {
      async function loadTasks() {
        const sessions = await loadFromStorage<TaskSession[]>(STORAGE_KEYS.TASK_SESSIONS) || []
        console.log("🔥 Task session data loaded:", sessions)

        const now = new Date()
        const thisWeekStart = new Date(now)
        thisWeekStart.setDate(now.getDate() - now.getDay())

        const lastWeekStart = new Date(thisWeekStart)
        lastWeekStart.setDate(thisWeekStart.getDate() - 7)
        const lastWeekEnd = new Date(thisWeekStart)

        const thisWeek: WeekTask[] = []
        const lastWeek: WeekTask[] = []

        for (const session of sessions) {
          const sessionDate = new Date(session.date)
          const roundedTimeSpent = Math.round(session.timeSpent)

          const roundedSession = {
            ...session,
            timeSpent: roundedTimeSpent,
          }

          if (sessionDate >= thisWeekStart) {
            thisWeek.push(roundedSession)
          } else if (sessionDate >= lastWeekStart && sessionDate < lastWeekEnd) {
            lastWeek.push(roundedSession)
          }
        }

        setThisWeekTasks(thisWeek)
        setLastWeekTasks(lastWeek)
      }

      loadTasks()
    }, [])
  )

  if (!isLoggedIn) {
    return (
      <View flex={1} items="center" justify="center" bg="$background">
        <H6>Login to track insights</H6>
        <Button onPress={() => router.push('/login')}>Login</Button>
      </View>
    )
  }

  return (
    <View flex={1} p="$4" bg="$background">
      <YStack gap="$4" pt="$8">
        <StackedBarChart lastWeekTasks={lastWeekTasks} thisWeekTasks={thisWeekTasks} />
      </YStack>
    </View>
  )
}