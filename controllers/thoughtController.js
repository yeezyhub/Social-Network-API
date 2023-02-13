//routes for /api/thoughts
const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then(async (thoughts) => {
                return res.json(thoughts);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // Get a single thought
    getSingleThought(req, res) {
        //Req.params to access the database using URL
        Thought.findById(ObjectId(req.params.thoughtId))
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "The thought with this ID is not found." })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Create a thought
    createThought(req, res) {
        //Req.body to access database using user input to the JSON body
        Thought.create(req.body)
            .then(async function (thought) {
                // Update thought array
                await User.findOneAndUpdate(
                    { username: req.body.username },
                    { $addToSet: { thoughts: ObjectId(thought._id) } },
                    { runValidators: true, new: true }
                );

                res.json(thought);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // Update a thought
    updateThought(req, res) {
        Thought.findByIdAndUpdate(
            ObjectId(req.params.thoughtId),
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No thought to update!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findByIdAndRemove(
                ObjectId(req.params.thoughtId)
            );

            if (thought) {
                const user = await User.updateOne(
                    { username: thought.username },
                    {
                        $pull: { thoughts: ObjectId(req.params.thoughtId) },
                    }
                );
            } else {
                res.status(404).json({ message: "No thought to delete!" });
            }
            res.status(200).json({ message: "Thought successfully deleted" });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //Routes for /api/thoughts/:thoughtId/reactions

    // Create a reaction
    createReaction(req, res) {
        Thought.findByIdAndUpdate(
            ObjectId(req.params.thoughtId),
            {
                $addToSet: {
                    reactions: {
                        reactionBody: req.body.reactionBody,
                        username: req.body.username,
                    },
                },
            },
            { runValidators: true, new: true, returnDocument: "after" }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No thought found with that ID." })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Delete a reaction
    async deleteReaction(req, res) {
        try {
            // Find the thought
            const thought = await Thought.findOneAndUpdate({
                _id: req.params.thoughtId
            },
                {
                    $pull: {
                        reactions: {
                            reactionId: req.params.reactionId
                        }
                    },
                },
                { runValidators: true, new: true }
            );

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};