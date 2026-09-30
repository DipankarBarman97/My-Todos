import { Todo } from "@/types/todo";
import { useCallback, useRef, useState } from "react";

type UndoState = { id: number; message: string; removed: Todo[] };

export function useUndo(restore: (removed: Todo[]) => void) {
  const [undo, setUndo] = useState<UndoState | null>(null);
  const counter = useRef(0);

  // if a snackbar is already showing, merge into one undo instead of losing it
  const showUndo = useCallback((message: string, removed: Todo[]) => {
    counter.current += 1;
    const id = counter.current;
    setUndo((cur) => {
      const all = cur ? [...cur.removed, ...removed] : removed;
      return {
        id,
        removed: all,
        message: cur ? `${all.length} todos removed` : message,
      };
    });
  }, []);

  const handleUndo = useCallback(() => {
    if (!undo) return;
    restore(undo.removed);
    setUndo(null);
  }, [undo, restore]);

  const dismissUndo = useCallback((id: number) => {
    setUndo((cur) => (cur?.id === id ? null : cur));
  }, []);

  return { undo, showUndo, handleUndo, dismissUndo };
}
