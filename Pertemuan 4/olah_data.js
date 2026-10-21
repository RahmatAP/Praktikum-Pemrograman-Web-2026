const project = [
    {
        id : 1,
        tittle: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },

    {
        id : 2,
        tittle: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },

    {
        id: 3,
        tittle: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },

    {
        id: 4,
        tittle: "Aplikasi Presensi GPS Mobile",
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

console.log("=== Semua Daftar Proyek (forEach) ===");
project.forEach((proj, idx) => {
    const status = proj.completed ? "Selesai" : "Belum Selesai";
    console.log(`Proyek ${idx + 1}: ${proj.tittle} (${proj.category}) - ${formatRupiah(proj.budget)}`);

});

console.log("\n=== Proyek Kategori Web App ===");
const webProjects = project.filter(proj => proj.category === "Web App");
console.log(webProjects);

console.log("\n===3. Ringkasan Nama + & Anggaran (map) ===");
const ringkasanProyek = project.map(pro => ({
    nama: proj.tittle,
    biaya: formatRupiah(proj.budget)
}));

console.table(ringkasanProyek);

console.log("\n===4. Total Anggaran(reduce) ===");
const totalAnggaran = project.reduce((total, proj) => total + proj.budget, 0);
console.log(`Total Estimasi Anggaran Portofolio: ${formatRupiah(totalAnggaran)}`);

const totalSelesai = projects
.filter(proj => proj.completed)
.reduce((total, proj) => total + proj.budget, 0);
console.log(`Total Anggaran Proyek Selesai: ${formatRupiah(totalSelesai)}`);