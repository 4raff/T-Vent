// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login berhasil!',
  LOGOUT: 'Logout berhasil!',
  REGISTER: 'Pendaftaran berhasil!',
  EVENT_CREATED: 'Event berhasil dibuat!',
  EVENT_UPDATED: 'Event berhasil diperbarui!',
  EVENT_DELETED: 'Event berhasil dihapus!',
  BOOKMARK_ADDED: 'Event ditambahkan ke bookmark!',
  BOOKMARK_REMOVED: 'Event dihapus dari bookmark!',
};

// Error Messages
export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login gagal. Periksa email dan password Anda.',
  REGISTER_FAILED: 'Pendaftaran gagal. Email mungkin sudah terdaftar.',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  INVALID_INPUT: 'Input tidak valid. Periksa kembali data Anda.',
  UNAUTHORIZED: 'Anda tidak memiliki akses. Silakan login terlebih dahulu.',
  NOT_FOUND: 'Data tidak ditemukan.',
  SERVER_ERROR: 'Terjadi kesalahan server. Coba lagi nanti.',
  FETCH_EVENTS_FAILED: 'Gagal memuat daftar event dari server.',
  CREATE_EVENT_FAILED: 'Gagal membuat event. Periksa data Anda.',
};

// Info Messages
export const INFO_MESSAGES = {
  LOADING: 'Memuat...',
  LOADING_EVENTS: 'Memuat daftar event...',
  NO_EVENTS: 'Belum ada event yang tersedia.',
  EMPTY_RESULTS: 'Tidak ada hasil yang sesuai dengan pencarian Anda.',
};
