export const userResponseDTO = (user) => {
  const firstName = user.profile?.first_name || null;
  const lastName = user.profile?.last_name || null;
  const fullName = user.profile?.full_name
    || [firstName, lastName].filter(Boolean).join(" ")
    || null;

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    name: fullName,
    created_at: user.created_at
  };
};
