const User = require('../model/User');

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().exec();
    if (!users) {
      return res.status(204).json('No user found');
    }
    res.json(users);
  } catch (err) {
    console.error(err);
  }
};

// Tasks
// delete, update get only a single user
module.exports = {
  getAllUser,
};
