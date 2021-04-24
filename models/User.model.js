const {Schema, model} = require(`mongoose`)
const userSchema = new Schema(
  {
    username: {type:String, required: true, unique: true},
    password: {type:String, required: true},
    booksFinished: [{type: Schema.Types.ObjectId, ref: `Book`}],
    readingNow: [{type: Schema.Types.ObjectId, ref: `Book`}],
    wishlist: [{type: Schema.Types.ObjectId, ref: `Book`}],
    role:{type:String,enum:[`Admin`, `User`, `Guest`],default:`User`},
    avatar:{type:String},
    phrase:{type:String, default:`You're definitely a weirdo if you are using this app`}
  },
  {
    timestamps:false,
    versionKey: false
  }
);

module.exports = model(`User`, userSchema)