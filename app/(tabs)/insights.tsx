import { Text, View, Button, H5, Paragraph, YStack, XStack } from 'tamagui'
import { useRouter } from 'expo-router'
import { StackedBarChart } from 'components/StackedBarChart'
import { H6 } from 'tamagui'

import { useEffect, useState } from 'react'
import { STORAGE_KEYS, loadFromStorage, TaskSession } from 'utils/storage'
import ClearStorageButton from 'components/ClearStorageButton'

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
        thisWeekStart.setHours(0, 0, 0, 0)
        thisWeekStart.setDate(now.getDate() - now.getDay()) // Sunday start

        const lastWeekStart = new Date(thisWeekStart)
        lastWeekStart.setDate(thisWeekStart.getDate() - 7)
        const lastWeekEnd = new Date(thisWeekStart)

        // map to aggregate by 'name + localDateString'
        const thisWeekMap = new Map<string, WeekTask>()
        const lastWeekMap = new Map<string, WeekTask>()

        for (const session of sessions) {
          // session.date is ISO string saved in UTC, e.g. "2025-07-18T22:39:35.016Z"
          const sessionDate = new Date(session.date)

          // (local timezone)
          const localYear = sessionDate.getFullYear()
          const localMonth = sessionDate.getMonth()
          const localDay = sessionDate.getDate()

          // construct a Date at local midnight of that date
          const localMidnightDate = new Date(localYear, localMonth, localDay)

          // format YYYY-MM-DD
          const localDateString = localMidnightDate.toISOString().split('T')[0]

          // key for aggregation: task name + date string
          const key = `${session.name}_${localDateString}`

          // decide which week bucket the session belongs to
          const targetMap =
            localMidnightDate >= thisWeekStart ? thisWeekMap :
              localMidnightDate >= lastWeekStart && localMidnightDate < lastWeekEnd ? lastWeekMap :
                null

          if (!targetMap) continue

          if (targetMap.has(key)) {
            // add timeSpent if task already exists for that date
            targetMap.get(key)!.timeSpent += session.timeSpent
          } else {
            targetMap.set(key, {
              name: session.name,
              timeSpent: session.timeSpent,
              date: localDateString,
            })
          }
        }
        setThisWeekTasks(Array.from(thisWeekMap.values()))
        setLastWeekTasks(Array.from(lastWeekMap.values()))
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