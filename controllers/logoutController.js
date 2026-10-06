const User = require('../model/User');

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  try {
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
      return res.sendStatus(204); // Successful no content
    }
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    // Always add the secure:true property in production as it uses https
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      // secure: true,
    });
    res.sendStatus(204); // no content
  } catch (err) {
    console.log(err);
  }
};

module.exports = { handleLogout };
