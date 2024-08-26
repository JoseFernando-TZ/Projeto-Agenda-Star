// Define a estrutura da tarefa
interface Task {
    title: string;
    body: string;
}

// Seleciona os elementos do DOM com verificação de nulidade
const taskForm = document.getElementById('taskForm') as HTMLFormElement | null;
const taskTitle = document.getElementById('taskTitle') as HTMLInputElement | null;
const taskBody = document.getElementById('taskBody') as HTMLTextAreaElement | null;
const taskList = document.getElementById('taskList') as HTMLUListElement | null;

// Flag para verificar se estamos editando uma tarefa
let editMode: boolean = false;
let currentTask: HTMLLIElement | null = null; // Referência para a tarefa atualmente sendo editada

// Carregar tarefas do localStorage
function loadTasks(): void {
    if (taskList) {
        const tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.title, task.body);
            taskList.appendChild(taskItem);
        });
    }
}

// Salvar tarefas no localStorage
function saveTasks(): void {
    if (taskList) {
        const tasks: Task[] = [];
        taskList.querySelectorAll('li').forEach(li => {
            const titleElement = li.querySelector('.task-title') as HTMLAnchorElement | null;
            const bodyElement = li.querySelector('.task-body') as HTMLDivElement | null;
            if (titleElement && bodyElement) {
                const title = titleElement.textContent || '';
                const body = bodyElement.textContent || '';
                tasks.push({ title, body });
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Função para criar um novo item na lista
function createTaskItem(title: string, body: string): HTMLLIElement {
    const li = document.createElement('li');

    // Link para detalhes da tarefa
    const titleElement = document.createElement('a');
    titleElement.className = 'task-title';
    titleElement.textContent = title;
    titleElement.href = `task-details.html?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    titleElement.style.textDecoration = 'none'; // Remove o sublinhado do link
    titleElement.style.color = '#333'; // Ajusta a cor do texto do link

    const bodyElement = document.createElement('div');
    bodyElement.className = 'task-body';
    bodyElement.textContent = body;

    // Botão para editar a tarefa
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.className = 'edit-btn';
    editButton.onclick = () => {
        if (li) {
            editMode = true;
            currentTask = li;
            const titleElement = li.querySelector('.task-title') as HTMLAnchorElement | null;
            const bodyElement = li.querySelector('.task-body') as HTMLDivElement | null;
            if (titleElement && bodyElement && taskTitle && taskBody) {
                taskTitle.value = titleElement.textContent || '';
                taskBody.value = bodyElement.textContent || '';
                taskTitle.focus();
            }
        }
    };

    // Botão para remover a tarefa
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.className = 'remove-btn';
    removeButton.onclick = () => {
        if (li) {
            li.remove();
            saveTasks();
        }
    };

    li.appendChild(titleElement);
    li.appendChild(bodyElement);
    li.appendChild(editButton);
    li.appendChild(removeButton);

    return li;
}

// Manipula o envio do formulário
if (taskForm) {
    taskForm.onsubmit = (event) => {
        event.preventDefault();

        if (taskTitle && taskBody) {
            const titleText = taskTitle.value.trim();
            const bodyText = taskBody.value.trim();

            if (titleText && bodyText) {
                if (editMode) {
                    // Atualiza tarefa existente
                    if (currentTask) {
                        const titleElement = currentTask.querySelector('.task-title') as HTMLAnchorElement | null;
                        const bodyElement = currentTask.querySelector('.task-body') as HTMLDivElement | null;
                        if (titleElement && bodyElement) {
                            titleElement.textContent = titleText;
                            bodyElement.textContent = bodyText;
                            editMode = false; // Sai do modo de edição
                            currentTask = null; // Limpa a referência
                        }
                    }
                } else {
                    // Adiciona nova tarefa
                    if (taskList) {
                        const taskItem = createTaskItem(titleText, bodyText);
                        taskList.appendChild(taskItem);
                    }
                }
                saveTasks();
                if (taskTitle && taskBody) {
                    taskTitle.value = ''; // Limpa o campo de título
                    taskBody.value = ''; // Limpa o campo de corpo
                    taskTitle.focus(); // Foca novamente no campo de título
                }
            }
        }
    };
}

// Carrega tarefas ao iniciar a página
window.onload = loadTasks;