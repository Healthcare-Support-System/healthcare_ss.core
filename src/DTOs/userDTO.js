export const userResponseDTO = (user) => {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };
};