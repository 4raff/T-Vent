// Event model based on migration and class diagram
class Event {
  constructor({ id, nama, deskripsi, tanggal, lokasi, harga, kategori, poster, jumlah_tiket, tiket_tersedia, created_by, status, created_at, updated_at }) {
    this.id = id;
    this.nama = nama;
    this.deskripsi = deskripsi;
    this.tanggal = tanggal;
    this.lokasi = lokasi;
    this.harga = harga;
    this.kategori = kategori;
    this.poster = poster;
    this.jumlah_tiket = jumlah_tiket;
    this.tiket_tersedia = tiket_tersedia;
    this.created_by = created_by;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Event;