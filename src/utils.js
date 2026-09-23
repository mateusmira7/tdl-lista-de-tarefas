// Funções puras da lista de tarefas — sem dependência do DOM,
// para facilitar testes automatizados no pipeline de CI.

function addTask(tasks, title) {
  const trimmed = (title || "").trim();
  if (!trimmed) {
    throw new Error("O título da tarefa não pode ser vazio.");
  }
  const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  return [...tasks, { id: nextId, title: trimmed, done: false }];
}

function toggleTask(tasks, id) {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

function removeTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}

function filterTasks(tasks, filter) {
  if (filter === "done") return tasks.filter((t) => t.done);
  if (filter === "pending") return tasks.filter((t) => !t.done);
  return tasks;
}

// Compatível com Node (Jest, via require) e com o navegador (via <script>).
if (typeof module !== "undefined" && module.exports) {
  module.exports = { addTask, toggleTask, removeTask, filterTasks };
}
