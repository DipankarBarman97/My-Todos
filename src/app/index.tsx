import FilterTabs from "@/components/FilterTabs";
import Pagination, { PAGINATION_HEIGHT } from "@/components/Pagination";
import Snackbar from "@/components/Snackbar";
import TodoItem from "@/components/TodoItem";
import TodoModal from "@/components/TodoModal";
import { Colors, fontSizes, spacing, useTheme } from "@/constants/theme";
import { usePagination } from "@/hooks/usePagination";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useTodos } from "@/hooks/useTodos";
import { useUndo } from "@/hooks/useUndo";
import { Filter, Todo } from "@/types/todo";
import { animateLayout } from "@/utils/animate";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAB_SIZE = 54;
const PAGE_SIZE = 8; // how many todos per page

const EMPTY_COPY: Record<Filter, { title: string; text: string }> = {
  all: { title: "No todos yet", text: "Tap the + button to add one" },
  active: { title: "Nothing left to do", text: "Every task is done 🎉" },
  done: { title: "Nothing completed yet", text: "Finished todos show up here" },
};

function getSubtitle(loading: boolean, total: number, remaining: number) {
  if (loading) return "";
  if (total === 0) return "Nothing to do yet";
  if (remaining === 0) return "All done! 🎉";
  return `${remaining} of ${total} left to do`;
}

export default function Index() {
  const colors = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    todos,
    loading,
    addTodo,
    editTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    restoreTodos,
  } = useTodos();

  const { undo, showUndo, handleUndo, dismissUndo } = useUndo(restoreTodos);

  const { isDark, toggleTheme } = useThemeToggle();

  const [filter, setFilter] = useState<Filter>("all");

  // add/edit modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const remaining = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - remaining;

  const visibleTodos = useMemo(
    () =>
      todos.filter((t) =>
        filter === "all" ? true : filter === "active" ? !t.done : t.done,
      ),
    [todos, filter],
  );
  const emptyCopy = EMPTY_COPY[filter];

  // ---------- pagination ----------

  const { page, totalPages, pageItems, goTo } = usePagination(
    visibleTodos,
    PAGE_SIZE,
  );

  // lift the + button and snackbar above the bar when it is visible
  const floatingBottom = spacing.lg + (totalPages > 1 ? PAGINATION_HEIGHT : 0);

  const listRef = useRef<FlatList<Todo>>(null);

  function scrollToTop() {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }

  function changePage(next: number) {
    goTo(next);
    scrollToTop();
  }

  // ---------- filter ----------

  function changeFilter(next: Filter) {
    animateLayout();
    setFilter(next);
    goTo(1);
  }

  // ---------- add / edit modal ----------

  function openAddModal() {
    setEditingId(null);
    setInput("");
    setModalVisible(true);
  }

  const openEditModal = useCallback((todo: Todo) => {
    setEditingId(todo.id);
    setInput(todo.text);
    setModalVisible(true);
  }, []);

  function closeModal() {
    setModalVisible(false);
    setEditingId(null);
    setInput("");
  }

  function handleSave() {
    const trimmed = input.trim();
    if (trimmed.length === 0) return;

    if (editingId) {
      editTodo(editingId, trimmed);
    } else {
      addTodo(trimmed);
      goTo(1);
      scrollToTop();
    }
    closeModal();
  }

  // ---------- toggle / delete / clear ----------

  const handleToggle = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleTodo(id);
    },
    [toggleTodo],
  );

  const handleDelete = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const removed = deleteTodo(id);
      if (removed.length > 0) showUndo("Todo deleted", removed);
    },
    [deleteTodo, showUndo],
  );

  function handleClearCompleted() {
    const removed = clearCompleted();
    if (removed.length > 0) {
      showUndo(
        removed.length === 1
          ? "1 todo cleared"
          : `${removed.length} todos cleared`,
        removed,
      );
    }
  }

  const renderItem: ListRenderItem<Todo> = useCallback(
    ({ item }) => (
      <TodoItem
        todo={item}
        onToggle={handleToggle}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />
    ),
    [handleToggle, openEditModal, handleDelete],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* title + theme button */}
          <View style={styles.titleRow}>
            <Text style={styles.title} accessibilityRole="header">
              My Todos
            </Text>
            <TouchableOpacity
              style={styles.themeButton}
              onPress={toggleTheme}
              accessibilityRole="button"
              accessibilityLabel={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              <Ionicons
                name={isDark ? "sunny" : "moon"}
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>
              {getSubtitle(loading, todos.length, remaining)}
            </Text>
            {doneCount > 0 && (
              <TouchableOpacity
                onPress={handleClearCompleted}
                hitSlop={8}
                accessibilityRole="button"
              >
                <Text style={styles.clearText}>Clear completed</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FilterTabs value={filter} onChange={changeFilter} />

        <FlatList
          ref={listRef}
          style={styles.list}
          data={pageItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          ListEmptyComponent={
            loading ? null : (
              <View style={styles.emptyBox}>
                <Text
                  style={styles.emptyIcon}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                >
                  📝
                </Text>
                <Text style={styles.emptyTitle}>{emptyCopy.title}</Text>
                <Text style={styles.emptyText}>{emptyCopy.text}</Text>
              </View>
            )
          }
        />

        {/* pinned to the bottom: outside the list, after it */}
        <Pagination page={page} totalPages={totalPages} onChange={changePage} />

        {undo && (
          <Snackbar
            key={undo.id}
            style={[styles.snackbar, { bottom: floatingBottom }]}
            message={undo.message}
            onAction={handleUndo}
            onDismiss={() => dismissUndo(undo.id)}
          />
        )}

        <TouchableOpacity
          style={[styles.fab, { bottom: floatingBottom }]}
          onPress={openAddModal}
          accessibilityRole="button"
          accessibilityLabel="Add todo"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        <TodoModal
          visible={modalVisible}
          isEditing={editingId !== null}
          value={input}
          onChangeText={setInput}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },

    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: spacing.md,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      flexShrink: 1,
      fontSize: fontSizes.xxl,
      fontWeight: "bold",
      color: colors.text,
    },
    themeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginLeft: spacing.md,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    subtitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: spacing.xs,
    },
    subtitle: {
      flexShrink: 1,
      fontSize: fontSizes.md,
      color: colors.textSecondary,
    },
    clearText: {
      marginLeft: spacing.md,
      fontSize: fontSizes.sm,
      fontWeight: "bold",
      color: colors.danger,
    },

    // takes all free space, which pushes the pagination bar to the bottom
    list: { flex: 1 },
    // enough room so the last row clears the + button
    listContent: { paddingBottom: FAB_SIZE + spacing.lg * 2 },

    emptyBox: { alignItems: "center", marginTop: 60 },
    emptyIcon: { fontSize: 56, marginBottom: 12 },
    emptyTitle: {
      fontSize: fontSizes.lg,
      fontWeight: "bold",
      color: colors.heading,
    },
    emptyText: {
      fontSize: fontSizes.md,
      color: colors.textMuted,
      marginTop: 6,
    },

    // sits to the left of the + button
    snackbar: {
      position: "absolute",
      left: spacing.md,
      right: FAB_SIZE + spacing.lg + spacing.md,
    },

    fab: {
      position: "absolute",
      right: spacing.lg,
      width: FAB_SIZE,
      height: FAB_SIZE,
      borderRadius: FAB_SIZE / 2,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    fabText: { color: colors.onPrimary, fontSize: 38, lineHeight: 42 },
  });
