import { useState } from "react"
import { Sheet, Button, YStack, H5, Paragraph, XStack } from "tamagui"
import { Check } from "@tamagui/lucide-icons"

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
            <Button
                circular
                onPress={() => setOpen(true)}
                disabled={isDisabled}
            >
                <Check />
            </Button>
            <Sheet
                open={open}
                onOpenChange={setOpen}
                snapPoints={[40]}
                dismissOnSnapToBottom
                modal
            >
                <Sheet.Overlay />
                <Sheet.Handle />
                <YStack p="$4" gap="$3">
                    <H5>End Session</H5>
                    <Paragraph>Are you finished with your session?</Paragraph>
                    <XStack gap="$2" justify="flex-end">
                        <Button
                            onPress={() => setOpen(false)}
                            variant="outlined"
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