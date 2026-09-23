const { addTask, toggleTask, removeTask, filterTasks } = require("../src/utils");

test("addTask adiciona uma nova tarefa com id incremental", () => {
  const tasks = addTask([], "Estudar para a prova");
  expect(tasks).toHaveLength(1);
  expect(tasks[0]).toMatchObject({ id: 1, title: "Estudar para a prova", done: false });
});

test("addTask rejeita título vazio", () => {
  expect(() => addTask([], "   ")).toThrow();
});

test("toggleTask alterna o status done da tarefa correta", () => {
  const tasks = addTask([], "Lavar louça");
  const toggled = toggleTask(tasks, 1);
  expect(toggled[0].done).toBe(true);
});

test("removeTask remove a tarefa pelo id", () => {
  const tasks = addTask([], "Tarefa a remover");
  const remaining = removeTask(tasks, 1);
  expect(remaining).toHaveLength(0);
});

test("filterTasks filtra corretamente pendentes e concluídas", () => {
  let tasks = addTask([], "A");
  tasks = addTask(tasks, "B");
  tasks = toggleTask(tasks, 1);
  expect(filterTasks(tasks, "done")).toHaveLength(1);
  expect(filterTasks(tasks, "pending")).toHaveLength(1);
  expect(filterTasks(tasks, "all")).toHaveLength(2);
});
