import { Sheet, YStack, H5 } from "tamagui"

export default function ThemeSheet({
  open,
  onOpenChange,

}) {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange} snapPoints={[90]} dismissOnSnapToBottom modal>
        <Sheet.Overlay />
        <Sheet.Handle />
        <YStack p="$4" gap="$3">
          <H5>Select Theme</H5>

        </YStack>
      </Sheet>
    </>
  )
}