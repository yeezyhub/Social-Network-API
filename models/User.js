const mongoose = require('mongoose');

// Schemas define the shape of the documents within the collection.
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (validation) {
        return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(validation);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },

  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought',
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  toJSON: {
    virtuals: true,
    getters: true,
  },
  id: false,

});

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("user", userSchema);

module.exports = User;