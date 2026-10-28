
document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen DOM
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompleted = document.querySelector("#clearCompleted");

    // 2. Fungsi membaca dan menyimpan ke LocalStorage
    const getTasks = () =>
        JSON.parse(localStorage.getItem("todo_tasks")) || [];

    const saveTasks = (tasks) =>
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));

    // 3. Fungsi menghitung jumlah tugas
    const updateCounter = (tasks) => {
        const total = tasks.length;
        const selesai = tasks.filter(task => task.completed).length;
        const belumSelesai = total - selesai;

        taskCounter.textContent =
            `Total: ${total} Tugas | Selesai: ${selesai} | Belum Selesai: ${belumSelesai}`;

        clearCompleted.disabled = selesai === 0;
    };

    // 4. Fungsi menampilkan daftar tugas ke layar
    const renderTasks = () => {
        const tasks = getTasks();
        todoList.innerHTML = "";

        updateCounter(tasks);

        if (tasks.length === 0) {
            todoList.innerHTML =
                "<li style='text-align:center; color:#64748b; font-size:13px; padding:10px;'>Belum ada tugas tersimpan.</li>";
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className =
                `todo-item ${task.completed ? "completed" : ""}`;

            li.innerHTML = `
                <span class="todo-text"></span>
                <div class="todo-actions">
                    <button class="action-btn complete-btn"
                        data-index="${index}">
                        ${task.completed ? "Batal" : "Selesai"}
                    </button>
                    <button class="action-btn delete-btn"
                        data-index="${index}">
                        Hapus
                    </button>
                </div>
            `;

            li.querySelector(".todo-text").textContent = task.text;
            todoList.appendChild(li);
        });
    };

    // 5. Tambah tugas saat formulir dikirim
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();

        // Validasi input sederhana
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            return;
        }

        // Hilangkan pesan error
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Simpan tugas baru ke LocalStorage
        const tasks = getTasks();
        tasks.push({
            text: taskText,
            completed: false
        });

        saveTasks(tasks);

        taskInput.value = "";
        renderTasks();
    });

    // 6. Tangani tombol Selesai dan Hapus
    todoList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;

        if (index === undefined) return;

        const tasks = getTasks();

        // Mengubah status tugas
        if (e.target.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;

            saveTasks(tasks);
            renderTasks();

        // Menghapus tugas dengan konfirmasi
        } else if (e.target.classList.contains("delete-btn")) {
            const yakin = confirm(
                "Apakah Anda yakin ingin menghapus tugas ini?"
            );

            if (yakin) {
                tasks.splice(index, 1);
                saveTasks(tasks);
                renderTasks();
            }
        }
    });

    // 7. Membersihkan semua tugas yang sudah selesai
    clearCompleted.addEventListener("click", () => {
        const tasks = getTasks();
        const selesai = tasks.filter(task => task.completed);

        if (selesai.length === 0) {
            return;
        }

        const yakin = confirm(
            "Apakah Anda yakin ingin membersihkan semua tugas yang selesai?"
        );

        if (yakin) {
            const tasksBelumSelesai =
                tasks.filter(task => !task.completed);

            saveTasks(tasksBelumSelesai);
            renderTasks();
        }
    });

    // 8. Render pertama kali saat halaman dimuat
    renderTasks();
});
