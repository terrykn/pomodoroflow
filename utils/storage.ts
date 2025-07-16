import AsyncStorage from '@react-native-async-storage/async-storage'
import { Task } from 'app/(tabs)'

export const STORAGE_KEYS = {
    SELECTED_TASK: 'selectedTask',
    TASKS: 'tasks',
    FOCUS_MUSIC: 'focusMusic',
    BREAK_MUSIC: 'breakMusic',
    TASK_SESSIONS: 'taskSessions',
}

export async function saveToStorage<T>(key: string, value: T): Promise<void> {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        console.error('Save error:', e)
        throw e 
    }
}

export async function loadFromStorage<T>(key: string): Promise<T | null> {
    try {
        const raw = await AsyncStorage.getItem(key)
        return raw ? (JSON.parse(raw) as T) : null
    } catch (e) {
        console.error('Load error:', e)
        return null
    }
}

export type TaskSession = {
    name: string
    timeSpent: number
    date: string // yyyy-mm-dd
}

export async function saveTaskSession(session: TaskSession): Promise<void> {
    try {
        const existing = (await loadFromStorage<TaskSession[]>(STORAGE_KEYS.TASK_SESSIONS)) || []

        // Remove sessions older than 2 weeks
        const twoWeeksAgo = new Date()
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

        const freshSessions = existing.filter(s => new Date(s.date) >= twoWeeksAgo)

        freshSessions.push(session)

        await saveToStorage(STORAGE_KEYS.TASK_SESSIONS, freshSessions)
    } catch (error) {
        console.error('Failed to save task session:', error)
        throw error
    }
}
