let projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(angka);
};

// Menghindari teks input pengguna diperlakukan sebagai HTML.
const escapeHTML = (value) => {
    return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return entities[character];
    });
};

const updateStats = () => {
    const totalProjects = projects.length;
    const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
    const completedCount = projects.filter(item => item.completed).length;

    document.getElementById("stat-total-projects").textContent = totalProjects;
    document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
    document.getElementById("stat-completed-projects").textContent = completedCount;
};

const getFilteredProjects = () => {
    const searchText = document.getElementById("project-search").value.toLowerCase().trim();
    const selectedCategory = document.querySelector(".btn-filter.active")?.getAttribute("data-category") || "Semua";

    return projects.filter(project => {
        const matchesName = project.title.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "Semua" || project.category === selectedCategory;
        return matchesName && matchesCategory;
    });
};

const renderProjects = () => {
    const container = document.getElementById("project-list");
    const filteredList = getFilteredProjects();

    if (filteredList.length === 0) {
        container.innerHTML = '<p class="empty-state">Tidak ada proyek yang cocok dengan pencarian atau kategori ini.</p>';
        return;
    }

    container.innerHTML = filteredList.map(project => {
        const badgeClass = project.completed ? "badge-success" : "badge-pending";
        const statusText = project.completed ? "Selesai" : "Dalam Pengerjaan";
        const toggleText = project.completed ? "Ubah ke Dalam Pengerjaan" : "Ubah Status ke Selesai";

        return `
            <article class="project-card">
                <div class="project-info">
                    <span class="project-category">${escapeHTML(project.category)}</span>
                    <h3>${escapeHTML(project.title)}</h3>
                    <p class="project-budget">${formatRupiah(project.budget)}</p>
                </div>
                <div class="project-actions">
                    <div><span class="badge ${badgeClass}">${statusText}</span></div>
                    <button class="btn-action btn-toggle" type="button" data-action="toggle" data-id="${project.id}">${toggleText}</button>
                    <button class="btn-action btn-delete" type="button" data-action="delete" data-id="${project.id}">Hapus Proyek</button>
                </div>
            </article>
        `;
    }).join("");
};

const refreshDashboard = () => {
    updateStats();
    renderProjects();
};

document.addEventListener("DOMContentLoaded", () => {
    const projectForm = document.getElementById("project-form");
    const titleInput = document.getElementById("project-title");
    const categoryInput = document.getElementById("project-category");
    const budgetInput = document.getElementById("project-budget");
    const completedInput = document.getElementById("project-completed");
    const formMessage = document.getElementById("form-message");
    const searchInput = document.getElementById("project-search");
    const filterButtons = document.querySelectorAll(".btn-filter");

    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const budget = Number(budgetInput.value);

        if (title === "") {
            formMessage.textContent = "Judul proyek tidak boleh kosong.";
            formMessage.className = "form-message error";
            titleInput.focus();
            return;
        }

        if (!Number.isFinite(budget) || budget <= 0) {
            formMessage.textContent = "Anggaran harus berupa angka yang lebih besar dari 0.";
            formMessage.className = "form-message error";
            budgetInput.focus();
            return;
        }

        const newProject = {
            id: Date.now(),
            title: title,
            category: categoryInput.value,
            budget: budget,
            completed: completedInput.checked
        };

        // Gunakan spread operator untuk menambahkan proyek baru ke array.
        projects = [...projects, newProject];
        projectForm.reset();
        formMessage.textContent = "Proyek berhasil ditambahkan.";
        formMessage.className = "form-message success";

        // Tampilkan proyek yang baru ditambahkan meskipun sebelumnya ada pencarian/filter.
        searchInput.value = "";
        filterButtons.forEach(button => {
            const isAll = button.getAttribute("data-category") === "Semua";
            button.classList.toggle("active", isAll);
            button.setAttribute("aria-pressed", String(isAll));
        });

        refreshDashboard();
    });

    // Pencarian langsung berjalan setiap kali isi kolom berubah.
    searchInput.addEventListener("input", () => {
        renderProjects();
    });

    // Filter kategori dapat digunakan bersama pencarian.
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item => {
                const isActive = item === button;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });
            renderProjects();
        });
    });

    // Event delegation untuk tombol ubah status dan hapus pada kartu.
    document.getElementById("project-list").addEventListener("click", (e) => {
        const actionButton = e.target.closest("button[data-action]");
        if (!actionButton) return;

        const projectId = Number(actionButton.getAttribute("data-id"));
        const action = actionButton.getAttribute("data-action");

        if (action === "toggle") {
            projects = projects.map(project => {
                if (project.id === projectId) {
                    return { ...project, completed: !project.completed };
                }
                return project;
            });
        } else if (action === "delete") {
            projects = projects.filter(project => project.id !== projectId);
        }

        refreshDashboard();
    });

    refreshDashboard();
});
