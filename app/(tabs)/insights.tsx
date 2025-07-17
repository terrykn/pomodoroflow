import { Text, View, Button, H5, Paragraph, YStack, XStack } from 'tamagui'
import { useRouter } from 'expo-router'
import { StackedBarChart } from 'components/StackedBarChart'
import { H6 } from 'tamagui'

import { useEffect, useState } from 'react'
import { STORAGE_KEYS, loadFromStorage, TaskSession } from 'utils/storage'

import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'

import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'

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

  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "47231083979-a3ihlpdljqb3shijgqtub9081u5tgr3k.apps.googleusercontent.com"
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUserInfo(user);
    } catch (err) {
      setError(err)
    }
  }

  const logOut = () => {
    setUserInfo(null);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  }

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

  return (
    <View flex={1} p="$4" bg="$background">
      {userInfo && <Text>{JSON.stringify(userInfo.user)}</Text>}
      {userInfo ? (
        <View flex={1} p="$4" bg="$background">
          <Button onPress={logOut}>Log Out</Button>
          <YStack gap="$4" pt="$8">
            <StackedBarChart lastWeekTasks={lastWeekTasks} thisWeekTasks={thisWeekTasks} />
          </YStack>
        </View>
      ) : (
        <View flex={1} p="$4" bg="$background">
          <Text>Login to Track Insights</Text>
          <GoogleSigninButton size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Dark} onPress={signIn} />
        </View>
      )}
    </View>
  )
}