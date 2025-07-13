import { useState } from "react"
import { Sheet, Button, YStack, H5, Paragraph, XStack } from "tamagui"
import { Check } from "@tamagui/lucide-icons"
import { BlurView } from "expo-blur"

type ResetSheetProps = {
    onFinish: () => void
    timeLeft: number
    initialTime: number
}

export default function ResetSheet({ onFinish, timeLeft, initialTime }: ResetSheetProps) {
    const [open, setOpen] = useState(false)
    const isDisabled = timeLeft === initialTime

    return (
        <>
            <BlurView intensity={50} tint="dark" style={{ borderRadius: 35, overflow: 'hidden' }}>
                <Button
                    circular
                    chromeless
                    bg="rgba(255, 255, 255, 0.03)"
                    borderColor="rgba(255,255,255,0.1)"
                    borderWidth={1}
                    onPress={() => setOpen(true)}
                    disabled={isDisabled}
                >
                    <Check />
                </Button>    
            </BlurView>
            
            <Sheet
                open={open}
                onOpenChange={setOpen}
                snapPoints={[30]}
                dismissOnSnapToBottom
                modal
            >
                <Sheet.Overlay />
                <Sheet.Handle />
                <YStack p="$4" gap="$3">
                    <H5>End Session</H5>
                    <Paragraph>Do you want to finish this session?</Paragraph>
                    <XStack gap="$2" justify="flex-end">
                        <Button
                            onPress={() => setOpen(false)}
                            variant="outlined"
                            borderColor="rgba(255,255,255,0.1)"
                            borderWidth={1}
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={() => {
                                setOpen(false)
                                onFinish()
                            }}
                        >
                            Finish
                        </Button>
                    </XStack>
                </YStack>
            </Sheet>
        </>
    )
}