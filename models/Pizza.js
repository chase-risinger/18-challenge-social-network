const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal) // this is a getter. we are are using the dateFormate.js file in utils folder
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
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
PizzaSchema.virtual('commentCount').get(function () {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;
