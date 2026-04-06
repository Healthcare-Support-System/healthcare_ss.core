export const donorProfileResponseDTO = (donor) => {
  const user = donor.user_id || {};
  const firstName = donor.first_name || null;
  const lastName = donor.last_name || null;
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;

  return {
    id: donor._id,
    user_id: user._id || donor.user_id || null,
    email: user.email || null,
    role: user.role || "donor",
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    nic: donor.nic || null,
    phone: donor.phone || null,
    address: donor.address || null,
    created_at: donor.created_at || user.created_at || null
  };
};
