import '../tamagui-web.css'

import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from './Provider'
import { useTheme, PortalProvider } from 'tamagui'
import { Audio } from 'expo-av'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('../assets/fonts/Inter/Inter-VariableFont_opsz,wght.ttf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    CherryCreamSoda: require('../assets/fonts/Cherry_Cream_Soda/CherryCreamSoda-Regular.ttf'),
    Jersey15: require('../assets/fonts/Jersey_15/Jersey15-Regular.ttf'),
    SairaStencilOne: require('../assets/fonts/Saira_Stencil_One/SairaStencilOne-Regular.ttf'),
    SpicyRice: require('../assets/fonts/Spicy_Rice/SpicyRice-Regular.ttf'),
    WDXL: require('../assets/fonts/WDXL_Lubrifont_JP_N/WDXLLubrifontJPN-Regular.ttf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return (
    <PortalProvider>
      <Providers>
        <RootLayoutNav />
      </Providers>
    </PortalProvider>
  )
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const theme = useTheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  )
}
