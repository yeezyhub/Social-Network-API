const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // Get all users
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
    // Get a single student
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate("Thought")
            .populate("Friend")
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    //update a user
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
            response.json({ message: 'User and thoughts have been deleted.' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Remove assignment from a student
    removeAssignment(req, res) {
        Student.findOneAndUpdate(
            { _id: req.params.studentId },
            { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
            { runValidators: true, new: true }
        )
            .then((student) =>
                !student
                    ? res
                        .status(404)
                        .json({ message: 'No student found with that ID :(' })
                    : res.json(student)
            )
            .catch((err) => res.status(500).json(err));
    },
};
