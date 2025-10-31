// Ticket model based on migration and class diagram
class Ticket {
  constructor({ id, kode_tiket, event_id, user_id, jumlah, total_harga, status, qr_code, created_at, updated_at }) {
    this.id = id;
    this.kode_tiket = kode_tiket;
    this.event_id = event_id;
    this.user_id = user_id;
    this.jumlah = jumlah;
    this.total_harga = total_harga;
    this.status = status;
    this.qr_code = qr_code;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Ticket;