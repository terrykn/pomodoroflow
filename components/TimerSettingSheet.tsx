import { useState, useEffect } from 'react'
import {
    H5,
    Input,
    ListItem,
    Paragraph,
    XStack,
    YStack,
    Sheet,
    Button,
} from 'tamagui'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { ChevronDown } from '@tamagui/lucide-icons'

export default function TimerSettingSheet({
    open,
    onOpenChange,
    focusMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    rounds,
    setFocusMinutes,
    setShortBreakMinutes,
    setLongBreakMinutes,
    setRounds,
}) {
    const [focusInput, setFocusInput] = useState(String(focusMinutes))
    const [shortInput, setShortInput] = useState(String(shortBreakMinutes))
    const [longInput, setLongInput] = useState(String(longBreakMinutes))
    const [roundsInput, setRoundsInput] = useState(String(rounds))

    useEffect(() => {
        setFocusInput(String(focusMinutes))
        setShortInput(String(shortBreakMinutes))
        setLongInput(String(longBreakMinutes))
        setRoundsInput(String(rounds))
    }, [focusMinutes, shortBreakMinutes, longBreakMinutes, rounds])

    const focusOptions = [25, 45]
    const shortOptions = [5, 10]
    const longOptions = [15, 30]
    const roundsOptions = [4, 6, 8]

    return (
        <Sheet snapPoints={[90]} open={open} onOpenChange={onOpenChange} dismissOnSnapToBottom modal>
            <Sheet.Overlay />
            <Sheet.Handle />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <YStack p="$4" gap="$2" flex={1}>
                    <H5>Timer Settings</H5>

                    {/* Focus */}

                    <XStack width="100%" mt="$2">
                        <Paragraph>Focus</Paragraph>
                    </XStack>
                    <XStack width="100%" gap="$2" mb="$4" items="center">
                        <Input
                            keyboardType="numeric"
                            value={focusInput}
                            onChangeText={(val) => {
                                setFocusInput(val)
                                const num = parseInt(val)
                                if (!isNaN(num)) setFocusMinutes(num)
                            }}
                            borderRadius="$6"
                        />
                        {focusOptions.map((opt) => (
                            <Button
                                key={`focus-${opt}`}
                                onPress={() => {
                                    setFocusMinutes(opt)
                                    setFocusInput(String(opt))
                                }}
                                size="$4"
                                borderRadius="$6"
                                borderWidth={1}
                                borderColor="$black4"
                                themeInverse={focusMinutes === opt}
                                variant={focusMinutes === opt ? "active" : "outlined"}
                            >
                                <Paragraph>{opt} minutes</Paragraph>
                            </Button>
                        ))}
                    </XStack>


                    {/* Short Break */}

                    <XStack width="100%">
                        <Paragraph>Short Break</Paragraph>
                    </XStack>
                    <XStack width="100%" gap="$2" mb="$4" items="center">
                        <Input
                            keyboardType="numeric"
                            value={shortInput}
                            onChangeText={(val) => {
                                setShortInput(val)
                                const num = parseInt(val)
                                if (!isNaN(num)) setShortBreakMinutes(num)
                            }}
                            borderRadius="$6"
                        />
                        {shortOptions.map((opt) => (
                            <Button
                                key={`short-${opt}`}
                                onPress={() => {
                                    setShortBreakMinutes(opt)
                                    setShortInput(String(opt))
                                }}
                                size="$4"
                                borderRadius="$6"
                                borderWidth={1}
                                borderColor="$black4"
                                themeInverse={shortBreakMinutes === opt}
                                variant={shortBreakMinutes === opt ? "active" : "outlined"}
                            >
                                <Paragraph>{opt} minutes</Paragraph>
                            </Button>
                        ))}
                    </XStack>


                    {/* Long Break */}

                    <XStack width="100%">
                        <Paragraph>Long Break</Paragraph>
                    </XStack>
                    <XStack width="100%" gap="$2" mb="$4" items="center">
                        <Input
                            keyboardType="numeric"
                            value={longInput}
                            onChangeText={(val) => {
                                setLongInput(val)
                                const num = parseInt(val)
                                if (!isNaN(num)) setLongBreakMinutes(num)
                            }}
                            borderRadius="$6"
                        />
                        {longOptions.map((opt) => (
                            <Button
                                key={`long-${opt}`}
                                onPress={() => {
                                    setLongBreakMinutes(opt)
                                    setLongInput(String(opt))
                                }}
                                size="$4"
                                borderRadius="$6"
                                borderWidth={1}
                                borderColor="$black4"
                                themeInverse={longBreakMinutes === opt}
                                variant={longBreakMinutes === opt ? "active" : "outlined"}
                            >
                                <Paragraph>{opt} minutes</Paragraph>
                            </Button>
                        ))}
                    </XStack>


                    {/* Rounds */}

                    <XStack width="100%">
                        <Paragraph>Rounds to Long Break</Paragraph>
                    </XStack>
                    <XStack width="100%" gap="$2" items="center">
                        <Input
                            keyboardType="numeric"
                            value={roundsInput}
                            onChangeText={(val) => {
                                setRoundsInput(val)
                                const num = parseInt(val)
                                if (!isNaN(num) && num >= 1 && num <= 12) setRounds(num)
                            }}
                            borderRadius="$6"
                        />
                        {roundsOptions.map((opt) => (
                            <Button
                                key={`rounds-${opt}`}
                                onPress={() => {
                                    setRounds(opt)
                                    setRoundsInput(String(opt))
                                }}
                                size="$4"
                                borderRadius="$6"
                                borderWidth={1}
                                borderColor="$black4"
                                themeInverse={rounds === opt}
                                variant={rounds === opt ? "active" : "outlined"}
                            >
                                <Paragraph>{opt}</Paragraph>
                            </Button>
                        ))}
                    </XStack>
                    <Button
                        self="center"
                        size="$5"
                        circular
                        onPress={() => onOpenChange(false)}
                        variant="outlined"
                        borderWidth={1}
                        borderColor="$black4"
                        mt="$6"
                    >
                        <ChevronDown />
                    </Button>

                </YStack>
            </TouchableWithoutFeedback>
        </Sheet>
    )
}
