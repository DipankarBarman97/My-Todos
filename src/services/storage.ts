import { Todo } from "@/types/todo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "TODOS";

function isTodoLike(value: unknown): value is Omit<Todo, "createdAt"> & {
  createdAt?: number;
} {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.text === "string" &&
    typeof v.done === "boolean"
  );
}

// read all todos from device storage
export async function getTodos(): Promise<Todo[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];

    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];

    const now = Date.now();
    return parsed.filter(isTodoLike).map((t, i) => ({
      id: t.id,
      text: t.text,
      done: t.done,
      // migration: older saves had no createdAt; keep their existing order
      createdAt: typeof t.createdAt === "number" ? t.createdAt : now - i,
    }));
  } catch (error) {
    console.warn("Failed to load todos", error);
    return [];
  }
}

// write all todos to device storage
export async function saveTodos(todos: Todo[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.warn("Failed to save todos", error);
  }
}
