const {Schema, model} = require(`mongoose`)
const userSchema = new Schema(
  {
    username: {type:String, required: true, unique: true},
    password: {type:String, required: true},
    books: [{type: Schema.Types.ObjectId, ref: `Book`}]
  },
  {
    timestamps:false,
    versionKey: false
  }
);

module.exports = model(`User`, userSchema)