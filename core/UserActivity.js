const dateformat = require("dateformat");
const knex = require("../db/knex");

class UserActivity {
  member;
  curTime;

  constructor(member) {
    this.curTime = new Date();
    this.member = member;
  }

  get id() {
    return this.member.id;
  }

  async insertTime() {
    const now = new Date();
    const curMonth = dateformat(now, "yyyy mm");
    const timeDelta = now - this.curTime;

    const member_activity = await knex("user_activity")
      .select()
      .where({
        member: this.id,
        month: curMonth
      })
      .first();
    if (!member_activity) {
      await knex("user_activity").insert({
        member: this.id,
        name: this.member.username,
        month: curMonth,
        active_time: timeDelta
      });
    } else {
      await knex("user_activity")
        .update({
          active_time: member_activity.active_time + timeDelta
        })
        .where({
          member: this.id,
          month: curMonth
        });
    }
    this.curTime = now;
  }
}

module.exports = UserActivity;
