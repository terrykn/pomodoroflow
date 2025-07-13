import { ChevronDown, CirclePlus, Pen, Trash, Check } from "@tamagui/lucide-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, H5, Input, Paragraph, Sheet, XStack, YStack, ScrollView } from "tamagui";

const INITIAL_FOCUS_OPTIONS = [
    { value: "Focus" },
    { value: "Work" },
    { value: "Study" },
];


export default function EditTask({ selectedTask, setSelectedTask }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState(INITIAL_FOCUS_OPTIONS);
    const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
    const [newTaskValue, setNewTaskValue] = useState("")

    const handleDeletePress = (value: string) => {
        if (confirmingDelete === value) {
            setOptions((prev) => prev.filter((opt) => opt.value !== value));
            setConfirmingDelete(null);
            if (selectedTask === value) {
                setSelectedTask("");
            }
        } else {
            setConfirmingDelete(value);
        }
    };

    const handleCreatePress = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return;

        // Avoid duplicates
        if (options.find((opt) => opt.value.toLowerCase() === trimmed.toLowerCase())) return;

        setOptions([...options, { value: trimmed }]);
        setNewTaskValue("");
    };

    return (
        <>
            <BlurView intensity={50} tint="dark" style={{ borderRadius: 16, overflow: "hidden" }}>
                <Button
                    chromeless
                    bg="rgba(255, 255, 255, 0.03)"
                    borderRadius={16}
                    onPress={() => setOpen(true)}
                >
                    <XStack items="center" gap="$2">
                        <Paragraph>{selectedTask}</Paragraph>
                        <Pen size={16} />
                    </XStack>
                </Button>
            </BlurView>

            <Sheet
                open={open}
                onOpenChange={setOpen}
                snapPoints={[90]}
                dismissOnSnapToBottom
                disableDrag
                modal
            >
                <Sheet.Overlay />
                <Sheet.Handle />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <YStack p="$4" gap="$3">
                        <H5>Edit Task</H5>

                        <XStack justify="space-between" width="100%">
                            <Input
                                bg="$black1"
                                borderRadius="$6"
                                borderWidth={1}
                                borderColor="$black4"
                                width="83%"
                                placeholder="Enter new task..."
                                value={newTaskValue}
                                onChangeText={setNewTaskValue}
                            />
                            <Button
                                borderRadius="$6"
                                variant="outlined"
                                borderColor="$black4"
                                borderWidth={1}
                                p={12}
                                onPress={() => handleCreatePress(newTaskValue)}
                            >
                                <CirclePlus color="$green8" />
                            </Button>
                        </XStack>


                        <Paragraph>Select a task for this session.</Paragraph>

                        <ScrollView width="100%" maxHeight="60%">
                            <YStack gap="$2">
                                {options.map((opt) => (
                                    <XStack key={opt.value} justify="space-between" width="100%">
                                        <Button
                                            onPress={() => {
                                                setSelectedTask(opt.value);
                                                setConfirmingDelete(null);
                                            }}
                                            borderColor="$black4"
                                            borderWidth={1}
                                            borderRadius="$6"
                                            items="center"
                                            themeInverse={selectedTask === opt.value}
                                            variant={selectedTask === opt.value ? "active" : "outlined"}
                                            width="83%"
                                            justify="flex-start"
                                        >
                                            <Paragraph>{opt.value}</Paragraph>
                                        </Button>

                                        <Button
                                            borderRadius="$6"
                                            variant="outlined"
                                            borderColor="$black4"
                                            borderWidth={1}
                                            p={12}
                                            onPress={() => handleDeletePress(opt.value)}
                                        >
                                            {confirmingDelete === opt.value ? (
                                                <Check color="$green8" />
                                            ) : (
                                                <Trash color="$red7" />
                                            )}
                                        </Button>
                                    </XStack>
                                ))}
                            </YStack>
                        </ScrollView>

                        <Button
                            self="center"
                            size="$5"
                            circular
                            onPress={() => setOpen(false)}
                            variant="outlined"
                            borderWidth={1}
                            borderColor="$black4"
                            mt="$4"
                        >
                            <ChevronDown />
                        </Button>
                    </YStack>
                </TouchableWithoutFeedback>
            </Sheet>
        </>
    );
}