const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.json({ message: 'Username and password are required' });
  }
  try {
    const foundUser = await User.findOne({ username: user }).exec();

    if (!foundUser) return res.sendStatus(401); // Unauthorized

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      // JWTs
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            roles,
            username: foundUser.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '600s' },
      );

      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' },
      );

      foundUser.refreshToken = refreshToken;
      const result = await foundUser.save();

      // httpOnly cookie is not a 100% save, just better than storing in local storage or another cookie that is available to javascript
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'None',
        // secure: true,
      });
      res.json({ accessToken });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { handleLogin };
