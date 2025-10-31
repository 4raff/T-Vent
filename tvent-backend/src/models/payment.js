// Payment model based on migration and class diagram
class Payment {
  constructor({ id, kode_pembayaran, ticket_id, user_id, jumlah, metode_pembayaran, status, tanggal_pembayaran, created_at, updated_at }) {
    this.id = id;
    this.kode_pembayaran = kode_pembayaran;
    this.ticket_id = ticket_id;
    this.user_id = user_id;
    this.jumlah = jumlah;
    this.metode_pembayaran = metode_pembayaran;
    this.status = status;
    this.tanggal_pembayaran = tanggal_pembayaran;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = Payment;