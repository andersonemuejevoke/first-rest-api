const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    const result = req.roles.some((role) => rolesArray.includes(role));
    const requestMethod = req.method;
    if (!result)
      return res.status(401).json({
        message:
          requestMethod === 'POST'
            ? 'You are not allowed to create employees'
            : requestMethod === 'PUT'
              ? 'You are not allowed to update employees'
              : requestMethod === 'GET'
                ? 'You are not allowed to get users information'
                : 'You are not allowed to delete employees',
      });
    next();
  };
};
module.exports = verifyRoles;
