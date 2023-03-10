const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {

    //Routes for /api/users

    //Get all users
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users,
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    //Get a single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate("thoughts")
            .populate("friends")
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID.' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    //Create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    //Update a user
    updateUser(req, res) {
        User.findByIdAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'No user found with that ID.' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Delete a user and remove their thoughts
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No such user exists' })
                    : Thought.deleteMany({ username: user.username })
            )
            .then(() =>
                res.json({ message: 'User and thoughts have been deleted.' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //Routes for /api/users/:userId/friends/:friendId

    //Create a friend
    createFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'There are no users with that ID.' })
                    : res.json(user)
            )
            .catch((error) => res.status(500).json(error));
    },

    //Delete friend
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'There are no users with that ID.' })
                    : res.json(user)
            )
            .catch((error) => res.status(500).json(error));
    },
};
