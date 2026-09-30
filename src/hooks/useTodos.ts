import { getTodos, saveTodos } from "@/services/storage";
import { Todo } from "@/types/todo";
import { animateLayout } from "@/utils/animate";
import * as Crypto from "expo-crypto";
import { useCallback, useEffect, useRef, useState } from "react";

// newest first
const byNewest = (a: Todo, b: Todo) => b.createdAt - a.createdAt;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // always the latest list, updated synchronously (never lags a render)
  const todosRef = useRef<Todo[]>([]);

  const update = useCallback((fn: (prev: Todo[]) => Todo[]) => {
    const next = fn(todosRef.current);
    todosRef.current = next;
    setTodos(next);
  }, []);

  useEffect(() => {
    (async () => {
      const saved = await getTodos();
      todosRef.current = saved;
      setTodos(saved);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) saveTodos(todos);
  }, [todos, loading]);

  const addTodo = useCallback(
    (text: string) => {
      const newTodo: Todo = {
        id: Crypto.randomUUID(),
        text,
        done: false,
        createdAt: Date.now(),
      };
      animateLayout();
      update((prev) => [newTodo, ...prev]);
    },
    [update],
  );

  const editTodo = useCallback(
    (id: string, text: string) => {
      update((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    },
    [update],
  );

  const toggleTodo = useCallback(
    (id: string) => {
      animateLayout();
      update((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      );
    },
    [update],
  );

  const deleteTodo = useCallback(
    (id: string): Todo[] => {
      const target = todosRef.current.find((t) => t.id === id);
      if (!target) return [];
      animateLayout();
      update((prev) => prev.filter((t) => t.id !== id));
      return [target];
    },
    [update],
  );

  const clearCompleted = useCallback((): Todo[] => {
    const removed = todosRef.current.filter((t) => t.done);
    if (removed.length === 0) return [];
    animateLayout();
    update((prev) => prev.filter((t) => !t.done));
    return removed;
  }, [update]);

  // re-insert and sort by createdAt: correct even if the list changed meanwhile
  const restoreTodos = useCallback(
    (removed: Todo[]) => {
      animateLayout();
      update((prev) => [...prev, ...removed].sort(byNewest));
    },
    [update],
  );

  return {
    todos,
    loading,
    addTodo,
    editTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    restoreTodos,
  };
}
