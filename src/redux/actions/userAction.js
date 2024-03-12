export const setUserData = (user) => {
  return {
    type: "SET_USER",
    user: user,
  };
};

export const resetUserData = () => {
  return {
    type: "RESET_USER",
  };
};
