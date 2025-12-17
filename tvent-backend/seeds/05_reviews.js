/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('reviews').del();
  
  // Inserts seed entries
  await knex('reviews').insert([
    {
      id: 1,
      event_id: 1,
      user_id: 3,
      rating: 5,
      feedback: 'Event yang sangat menarik! Speaker-nya berkualitas dan materinya sangat bermanfaat. Highly recommended!'
    },
    {
      id: 2,
      event_id: 2,
      user_id: 4,
      rating: 4,
      feedback: 'Festival musik yang seru! Lineup band-nya keren, tapi tempatnya agak sempit.'
    },
    {
      id: 3,
      event_id: 3,
      user_id: 5,
      rating: 5,
      feedback: 'Meetup yang sangat inspiratif. Banyak insight baru dari para founder startup.'
    },
    {
      id: 4,
      event_id: 2,
      user_id: 5,
      rating: 5,
      feedback: 'Amazing! Sound system bagus, suasana meriah. Worth it banget!'
    },
    {
      id: 5,
      event_id: 1,
      user_id: 2,
      rating: 4,
      feedback: 'Konferensi yang profesional. Cuma networking session-nya terlalu singkat.'
    },
    {
      id: 6,
      event_id: 6,
      user_id: 6,
      rating: 5,
      feedback: 'Food festival yang luar biasa! Makanannya enak dan variatif, pastinya akan datang lagi.'
    },
    {
      id: 7,
      event_id: 7,
      user_id: 7,
      rating: 4,
      feedback: 'Pameran seni yang menarik. Artwork-nya bagus tapi crowded.'
    },
    {
      id: 8,
      event_id: 8,
      user_id: 8,
      rating: 5,
      feedback: 'Seminar bisnis yang sangat bermanfaat! Speaker-nya expert dan materi sangat aplikatif.'
    },
    {
      id: 9,
      event_id: 10,
      user_id: 9,
      rating: 4,
      feedback: 'Edukatif dan interaktif. Tapi pesertanya terlalu banyak, kurang intimate.'
    },
    {
      id: 10,
      event_id: 11,
      user_id: 10,
      rating: 5,
      feedback: 'Fitness bootcamp yang challenging tapi fun! Trainer-nya motivasi dan supportive.'
    },
    {
      id: 11,
      event_id: 12,
      user_id: 11,
      rating: 4,
      feedback: 'Film yang bagus dengan diskusi yang mendalam. Venue-nya nyaman.'
    },
    {
      id: 12,
      event_id: 15,
      user_id: 12,
      rating: 5,
      feedback: 'Jazz night yang unforgettable! Musisinya talented, suasana romantic dan intimate.'
    },
    {
      id: 13,
      event_id: 16,
      user_id: 13,
      rating: 5,
      feedback: 'Community cleanup yang bermanfaat untuk lingkungan. Seru dan meaningful!'
    },
    {
      id: 14,
      event_id: 17,
      user_id: 14,
      rating: 4,
      feedback: 'Webinar yang informatif dan gratis lagi! Sangat membantu untuk bisnis UMKM.'
    },
    {
      id: 15,
      event_id: 18,
      user_id: 15,
      rating: 5,
      feedback: 'Stand up comedy yang membuat perut sakit ketawa! Komika-komikanya keren semua.'
    },
    {
      id: 16,
      event_id: 19,
      user_id: 3,
      rating: 5,
      feedback: 'Yoga retreat yang sangat menenangkan. Instruktur-nya professional dan ramah.'
    },
    {
      id: 17,
      event_id: 20,
      user_id: 4,
      rating: 4,
      feedback: 'Book club meeting yang menyenangkan. Diskusinya seru tapi terlalu sebentar.'
    },
    {
      id: 18,
      event_id: 21,
      user_id: 5,
      rating: 5,
      feedback: 'Drone racing yang spektakuler! Teknologinya amazing dan pertandingannya seru.'
    },
    {
      id: 19,
      event_id: 22,
      user_id: 6,
      rating: 4,
      feedback: 'Language exchange yang fun dan efektif. Banyak belajar bahasa baru.'
    },
    {
      id: 20,
      event_id: 1,
      user_id: 7,
      rating: 5,
      feedback: 'Salah satu konferensi terbaik yang pernah saya hadiri. Organisasi sempurna!'
    },
    {
      id: 21,
      event_id: 2,
      user_id: 8,
      rating: 3,
      feedback: 'Cukup bagus tapi kurang impressed dengan beberapa band. Makanan overpriced.'
    },
    {
      id: 22,
      event_id: 6,
      user_id: 9,
      rating: 5,
      feedback: 'Best food festival ever! Vendor-vendornya friendly dan makanannya berkualitas.'
    },
    {
      id: 23,
      event_id: 8,
      user_id: 10,
      rating: 5,
      feedback: 'Seminar yang sangat profesional dan well-organized. Pasti ikut lagi tahun depan.'
    },
    {
      id: 24,
      event_id: 11,
      user_id: 11,
      rating: 4,
      feedback: 'Bootcamp yang intense tapi rewarding. Hasilnya bagus, badannya segerrrr!'
    }
  ]);
};