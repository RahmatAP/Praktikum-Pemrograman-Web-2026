const namaProgrammer = "Rahmat Apandi"
const tahunMulai = 2022
const tahunSekarang = new Date().getFullYear()

const hitungPengalaman = (mulai, sekarang) => sekarang - mulai;
const masaKerja = hitungPengalaman(tahunMulai, tahunSekarang);

const statusSenoritas = masaKerja >= 2 ? "Mid-Level Depelover" : "Junios Developer";

console.log("=== Informasi Programmer ===");
console.log(`Nama Programmer: ${namaProgrammer}`);
console.log(`Pengalaman: ${masaKerja} tahun`);
console.log(`Kategori: ${statusSenoritas}`);

console.log("\n===Uji Perbandingan Tipe Data===")
console.log("10 == '10' : ", 10 == '10'); // true, karena tipe data berbeda, tapi nilainya sama
console.log("10 === '10' : ", 10 === '10');
console.log("Tipe 10 : ", typeof 10);
console.log("Tipe '10' : ", typeof '10');