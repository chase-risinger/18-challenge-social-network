const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/]
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal) // this is a getter. we are are using the dateFormate.js file in utils folder
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true, // we need to add this to tell mongoose we have virtuals
      getters: true // we need to add this to tell mongoose we have getters
    },
    id: false
  }
);

// get total count of comments and replies on retrieval
// virtuals are great, they make life easier, they are a mtethod to access a field that doesn't actually exist in the database
// reduce walks through the array, it passes the accumulating total and the 
// current value of comment into the function, with the return of the function revising the total for the next iteration through the array.
UserSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;
