# Praktikum Pemrograman Web Modul 5: Aku Mw Magang

Aplikasi web frontend untuk membantu **Kapten** mengelola seluruh proses lamaran magang, dari mencari lowongan sampai memilih tawaran terbaik. Dibangun dengan **React 19 + TypeScript** dan **Vite**, tanpa library state management maupun library form eksternal.

## Kelompok C13

| Nama | NRP |
|---|---|
| Tafidah Hasna Mumtazah | 5027251025 |
| Yovi Prayudya Rizky Ramadhani | 5027251107 |
| Alif Ramzy Pasha Firdaus | 5027251121 |

## Kontribusi Anggota

### Anggota 1: Tafidah Hasna Mumtazah
- Setup project (Vite + React + TypeScript), struktur folder, dan kontrak tipe di `src/types/`.
- **Fitur 1**: Profil Skill Kapten dan Eksplorasi Lowongan (fetch Remotive, fallback lokal, search debounce, filter kategori, Match Score, tombol Wishlist).
- **Fitur 2**: Form Tambah Lamaran Manual (form terkontrol, validasi, anti-duplikat, auto-focus dengan `useRef`).
- **Fitur 7 (bagian dashboard)**: 5 kartu statistik sebagai derived state.
- Hooks: `useDebounce`, `useFetchJobs`, `useNow`.
- Utils dan service: `skillMatch`, `duplicate`, `stats`, `application`, `jobService`.
- Dataset fallback `public/magang-fallback.json`.

### Anggota 2: Yovi Prayudya Rizky Ramadhani
- **Fitur 3**: War Room Pipeline (filter gabungan, sorting, Rawan Ghosting, Simulasi +15 Hari, Banner Bentrok).
- **Fitur 4**: Detail Lamaran (State Machine, syarat pindah status, Nested Checklist immutable, Activity Log).
- Hooks: `usePipelineFilter`, `useApplicationActions`.
- Utils: `stateMachine`, `ghosting`, `conflict`.

### Anggota 3: Alif Ramzy Pasha Firdaus
- **Fitur 5**: Interview Prep Timer (countdown 02:00, Mulai/Jeda, Reset, Soal Berikutnya, cleanup interval).
- **Fitur 6**: Undo Delete 5 detik dan persistensi `localStorage`.
- **Fitur 7 (bagian comparator)**: Offer Comparator dengan skor berbobot dan badge Rekomendasi Terbaik.
- Hooks: `useLocalStorage`, `useCountdown`, `useUndoDelete`.
- Utils: `offerScore`.
- `App.tsx`: state utama, navigasi tab, dan integrasi seluruh komponen.

## Deskripsi Singkat

Kapten sering lupa CV versi mana yang dikirim, melamar posisi yang skill-nya belum dikuasai, kena ghosting HRD, dan jadwal interview bisa bentrok. Aplikasi ini menyelesaikannya lewat tiga bagian utama:

| Bagian | Fungsi |
|---|---|
| **Eksplorasi Lowongan** | Melihat daftar lowongan, menghitung Match Score skill, dan menyimpan lowongan ke Wishlist |
| **War Room Lamaran** | Melacak status dengan state machine ketat, checklist persiapan, latihan interview berwaktu, deteksi ghosting, dan peringatan jadwal bentrok |
| **Offer Comparator** | Membandingkan dua tawaran magang secara objektif dengan skor berbobot |

## Tech Stack

- React 19 + TypeScript (`strict: true`, tanpa tipe `any`)
- Vite (template `react-ts`)
- CSS murni (CSS variables)
- Seluruh state, fetch, form, timer, dan penyimpanan lokal memakai React Hooks bawaan dan Custom Hooks buatan sendiri

## Menjalankan Project

```bash
npm install
npm run dev        # development server
npm run build      # type-check (tsc -b) + build produksi
npm run lint       # ESLint
npm run preview    # menjalankan hasil build
```

## Fitur

### 1. Profil Skill & Eksplorasi Lowongan
- Tambah dan hapus skill Kapten (tolak duplikat, disimpan di `localStorage`). Skill awal: React, TypeScript, CSS.
- Data lowongan diambil dari **Remotive API** dengan `useEffect` + `fetch` + `AbortController`, dengan state Loading, Error (tombol *Coba Lagi* dan *Pakai Dataset Lokal*), dan Kosong.
- Toggle sumber data: Remotive (live) atau `public/magang-fallback.json` (15 lowongan magang tech Indonesia).
- Pencarian dengan `useDebounce(keyword, 400)`, filter kategori, dan urutan Match tertinggi.
- Badge Match Score: hijau (≥ 70%), kuning (40–69%), merah (< 40%), lengkap dengan skill cocok dan skill yang masih kurang.
- Tombol *Simpan ke Wishlist* berubah menjadi *Sudah Dilamar* (disabled) jika sudah ada di daftar lamaran.

### 2. Form Tambah Lamaran Manual
- Form terkontrol penuh (`value` + `onChange`).
- Input `cvVersion` dan `appliedDate` muncul dan wajib diisi jika status awal `APPLIED`.
- Validasi input kosong dan duplikat (company + role, tidak case-sensitive).
- Jika gagal submit, kursor otomatis fokus ke input error pertama memakai `useRef`.

### 3. War Room Pipeline, Ghosting & Bentrok Jadwal
- Daftar lamaran menampilkan status, versi CV, progress checklist, dan Skill Match %.
- Filter gabungan: pencarian teks, status, toggle *Hanya Rawan Ghosting*, dan sorting (Terbaru / Jadwal Interview Terdekat / Offer Tertinggi).
- Badge **Rawan Ghosting** untuk status `APPLIED`/`SCREENING` yang tidak berubah lebih dari 14 hari (derived state).
- Tombol **Simulasi +15 Hari** untuk menguji ghosting saat demo.
- **Banner Bentrok** muncul jika ada dua lamaran `INTERVIEW` berselisih kurang dari 60 menit. Pengecekan memakai seluruh data, jadi banner tetap tampil meski filter aktif.

### 4. Detail Lamaran: State Machine, Checklist & Activity Log
- Transisi status hanya menampilkan tujuan yang sah:

```
WISHLIST  → APPLIED
APPLIED   → SCREENING | REJECTED | GHOSTED
SCREENING → INTERVIEW | REJECTED | GHOSTED
INTERVIEW → OFFER | REJECTED | GHOSTED
GHOSTED   → SCREENING
OFFER, REJECTED → (final)
```

- Syarat pindah status: ke `APPLIED` wajib `cvVersion` dan `appliedDate`, ke `INTERVIEW` wajib `interviewDateTime`, ke `OFFER` wajib `salaryOffer > 0` dan `workMode`.
- Nested checklist (tambah, centang, hapus) dengan progress bar. Semua update **immutable**.
- Activity log otomatis untuk pembuatan lamaran dan perpindahan status, plus catatan manual.

### 5. Interview Prep Timer
- 5 pertanyaan latihan interview magang IT.
- Countdown 02:00 per soal dengan tombol Mulai/Jeda, Reset, dan Soal Berikutnya.
- Interval dibersihkan lewat `return () => clearInterval(...)` pada `useEffect`, jadi detik tidak mempercepat saat panel dibuka ulang.

### 6. Undo Delete & Persistensi
- Hapus lamaran memunculkan toast Undo selama 5 detik. Lamaran kembali utuh beserta checklist dan activity log.
- ID `setTimeout` disimpan di `useRef`, sehingga hapus dua kali berturut-turut membersihkan timer sebelumnya.
- `applications` dan `kaptenSkills` disimpan lewat `useLocalStorage<T>`, jadi tidak hilang saat refresh.

### 7. Dashboard Statistik & Offer Comparator
- 5 kartu statistik (Total Lamaran, Response Rate, Interview Rate, Rawan Ghosting, Total Offer), semuanya **derived state** tanpa `useState` terpisah.
- Offer Comparator aktif jika ada minimal 2 lamaran berstatus `OFFER`. Skor total:

```
Total = (Normalisasi Gaji × 50%) + (Skor Mode Kerja × 25%) + (Skill Match % × 25%)
Skor Mode: Remote 100 | Hybrid 75 | Onsite 50
Normalisasi Gaji = gaji / gaji tertinggi × 100
```

- Badge **Rekomendasi Terbaik** untuk skor tertinggi. Jika offer kurang dari 2, tampil pesan kosong yang jelas.

## Custom Hooks

| Hook | Fungsi |
|---|---|
| `useLocalStorage<T>` | State yang tersinkron ke `localStorage` (dengan `try/catch`) |
| `useDebounce<T>` | Menunda perubahan nilai (dipakai pencarian) |
| `useFetchJobs` | Fetch lowongan dengan `AbortController`, state loading/error, retry, dan ganti sumber |
| `usePipelineFilter` | Filter dan sorting pipeline dengan `useMemo` |
| `useApplicationActions` | Ubah status, checklist, catatan, dan simulasi +15 hari (immutable) |
| `useCountdown` | Timer latihan interview dengan cleanup interval |
| `useUndoDelete` | Toast Undo 5 detik dengan timer di `useRef` |
| `useNow` | Waktu sekarang yang aman dipakai saat render |

## Struktur Folder

```
public/
  magang-fallback.json      # dataset lowongan lokal (format sama dengan Remotive)
src/
  components/               # komponen UI (Explore, Pipeline, Detail, Timer, Comparator, dll.)
  hooks/                    # custom hooks
  services/jobService.ts    # fetch Remotive dan fallback lokal
  types/index.ts            # interface dan tipe (Application, ApplicationStatus, dll.)
  utils/                    # fungsi murni: stateMachine, skillMatch, conflict,
                            # ghosting, offerScore, stats, duplicate, application
  App.tsx                   # state utama, navigasi tab, undo delete
```

## Keputusan Desain

- **Definisi rate.** `sent` adalah semua lamaran selain `WISHLIST`.
  - Response Rate = lamaran berstatus `SCREENING`, `INTERVIEW`, `OFFER`, atau `REJECTED` dibagi `sent`.
  - Interview Rate = lamaran yang pernah sampai `INTERVIEW` dibagi `sent`.
- **Dataset fallback** dibuat sendiri (15 lowongan fiktif) sesuai arahan asisten, dengan format yang sama dengan respons Remotive (`{ "job-count", "jobs": [...] }`).
- **Mode Offline DevTools** memblokir semua request termasuk `localhost`. Fallback lokal ditunjukkan setelah Offline dimatikan.

## Pengujian Manual

Skenario berikut dicoba sesuai tabel testcase di soal:

1. Fetch dan Offline Error: Loading, daftar tampil, lalu error beserta tombol fallback saat Offline
2. Skill Match Live: menambah skill "Docker" langsung menaikkan persentase
3. Debounce Search: filter berjalan setelah jeda sekitar 400 ms
4. Anti-Duplikat dan Focus: tombol "Sudah Dilamar" dan auto-focus form
5. State Machine: `WISHLIST` → `APPLIED` → `SCREENING` → `INTERVIEW`, dan `WISHLIST` tidak bisa langsung ke `OFFER`
6. Simulasi Ghosting: badge muncul dan statistik bertambah
7. Bentrok Interview: banner tampil dan tetap tampil saat filter aktif
8. Checklist dan Refresh: data tetap utuh setelah F5
9. Timer Cleanup: tidak ada error console dan detik tetap normal setelah panel dibuka ulang
10. Undo dan Comparator: data kembali utuh dan skor berbobot sesuai rumus
