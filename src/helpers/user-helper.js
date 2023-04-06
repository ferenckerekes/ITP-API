const getUserDTO = (user) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    country: user.country,
    createdAt: user.createdAt,
    phoneNumber: user.phoneNumber,
  };
};

module.exports = { getUserDTO };
