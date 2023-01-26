const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (date) => timeSince(date),
    },
},
    {
        toJSON: {
            getters: true,
            virtuals: true
        },
        _id: false,

    })

// Schemas define the shape of the documents within the collection.
const thoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    inPerson: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        get: (date) => timeSince(date),
    },

    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],

    timestamps: true,
    toJSON: {
        getters: true,
        virtuals: true
    },
    _id: false,


})

thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
