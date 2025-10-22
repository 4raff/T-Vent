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
    }
  ]);
};