const mongoose = require("mongoose")
require("mongoose-long")(mongoose)

const schemaTypes = mongoose.Schema.Types

mongoose.connect(`${process.env.MONGO_HOST_URI}/squadgang_data`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const UserActivitySchema = new mongoose.Schema({
  member: schemaTypes.Long,
  name: String,
  month: String,
  active_time: schemaTypes.Long
})

module.exports.UserActivity = mongoose.model(
  "user_activity",
  UserActivitySchema
)
