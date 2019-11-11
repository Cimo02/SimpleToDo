const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TodoModel = {};

// mongoose.Types.ObjectID converts the string ID
// to a real mongo ID
const convertId = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();
const setDesc = (desc) => _.escape(desc).trim();

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },

  desc: {
    type: String,
    required: false,
    trim: true,
    set: setDesc,
  },

  type: {
    type: String,
    required: true,
    default: "Note",
  },

  date: {
    type: Date,
    required: false,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  desc: doc.desc,
  type: doc.type,
  date: doc.date,
  createdData: doc.createdData,
});

TodoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TodoModel.find(search).select('title').exec(callback);
};

TodoModel = mongoose.model('Todo', TodoSchema);

module.exports.TodoModel = TodoModel;
module.exports.TodoSchema = TodoSchema;
