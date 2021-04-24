const {Schema, model} = require(`mongoose`)
const bookSchema = new Schema(
  {
    book_id: {type:String},
    title: {type:String},
    authors: [String],
    pageCount: {type:Number},
    publishedDate:{type:String},
    description:{type:String},
    thumbnail:{type:String}
  },
  {
    timestamps:false,
    versionKey: false
  }
);

module.exports = model(`Book`, bookSchema)