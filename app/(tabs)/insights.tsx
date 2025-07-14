import { Text, View, Button, H5, Paragraph, YStack, XStack } from 'tamagui'
import { useRouter } from 'expo-router'
import { StackedBarChart } from 'components/StackedBarChart'
import { H6 } from 'tamagui'

export type WeekTask = {
  name: string
  timeSpent: number
  date: string // ISO date string like '2025-07-13'
}

export default function TabInsightsScreen() {
  const isLoggedIn = true // Replace with your auth state
  const router = useRouter()

  const thisWeekTasks: WeekTask[] = [
    { name: 'Write Report', timeSpent: 90, date: '2025-07-13' },
    { name: 'Journaling', timeSpent: 42, date: '2025-07-13' },
    { name: 'Studying', timeSpent: 62, date: '2025-07-13' },
    { name: 'Read Book', timeSpent: 60, date: '2025-07-12' },
    { name: 'Write Report', timeSpent: 45, date: '2025-07-12' },
    { name: 'Mediation', timeSpent: 45, date: '2025-07-12' },
    { name: 'Plan Meeting', timeSpent: 30, date: '2025-07-11' },
  ]

  const lastWeekTasks: WeekTask[] = [
    { name: 'Read Book', timeSpent: 30, date: '2025-07-06' },
    { name: 'Write Report', timeSpent: 120, date: '2025-07-05' },
    { name: 'Design Slides', timeSpent: 60, date: '2025-07-04' },
    { name: 'Mediation', timeSpent: 45, date: '2025-07-04' },
  ]

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