// Buat atau buka database IndexedDB
const dbName = 'komentarDB';
const dbVersion = 1;
const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains('komentar')) {
    db.createObjectStore('komentar', { keyPath: 'id', autoIncrement: true });
  }
};

request.onsuccess = function (event) {
  const db = event.target.result;

  // Handle submit form
  const form = document.getElementById('form-komentar');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const isiKomentar = document.getElementById('isi-komentar').value;

    const transaction = db.transaction('komentar', 'readwrite');
    const komentarStore = transaction.objectStore('komentar');

    const newComment = { nama, isiKomentar };
    const request = komentarStore.add(newComment);

    request.onsuccess = function () {
      // Komentar berhasil disimpan ke dalam IndexedDB
      console.log('Komentar berhasil disimpan.');
      // Anda juga dapat menampilkan komentar langsung di daftar komentar di sini
      tampilkanKomentar(newComment);
    };

    request.onerror = function () {
      console.error('Gagal menyimpan komentar.');
    };
  });
};

function tampilkanKomentar(comment) {
  const daftarKomentar = document.getElementById('daftar-komentar');
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item'; // Tambahkan kelas Bootstrap
  listItem.textContent = `${comment.nama}: ${comment.isiKomentar}`;
  daftarKomentar.appendChild(listItem);
}

