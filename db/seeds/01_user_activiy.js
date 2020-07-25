exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_activity")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_activity").insert([
        {
          member: 291319202235547648,
          name: "Suryoyo Zeyno",
          month: "2020 07",
          active_time: 30000
        },
        {
          member: 291713076468908032,
          name: "Fuktig MejMej",
          month: "2020 07",
          active_time: 25000
        },
        {
          member: 291319202235547648,
          name: "Suryoyo Zeyno",
          month: "2020 06",
          active_time: 69000
        },
        {
          member: 291713076468908032,
          name: "Fuktig MejMej",
          month: "2020 06",
          active_time: 6900
        }
      ]);
    });
};
