let tasks = [];

const form = document.getElementById("form-tarefa");
const input = document.getElementById("input-tarefa");
const list = document.getElementById("lista-tarefas");

function render() {
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.title;
    li.style.textDecoration = task.done ? "line-through" : "none";
    li.addEventListener("click", () => {
      tasks = toggleTask(tasks, task.id);
      render();
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks = removeTask(tasks, task.id);
      render();
    });

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    tasks = addTask(tasks, input.value);
    input.value = "";
    render();
  } catch (err) {
    alert(err.message);
  }
});
