import Donor from "../Models/donorModel.js";
import User from "../Models/userModel.js";

export const getDonorProfileByUserId = async (userId) => {
  return Donor.findOne({ user_id: userId }).populate(
    "user_id",
    "email role created_at"
  );
};

export const updateDonorProfileByUserId = async (userId, updateData) => {
  const donor = await Donor.findOne({ user_id: userId }).populate(
    "user_id",
    "email role created_at"
  );

  if (!donor) {
    throw new Error("Donor not found");
  }

  const { email, first_name, last_name, nic, phone, address } = updateData;

  if (email && email !== donor.user_id.email) {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new Error("Email already registered");
    }

    donor.user_id.email = email;
    await donor.user_id.save();
  }

  if (nic && nic !== donor.nic) {
    const existingNIC = await Donor.findOne({ nic });

    if (existingNIC && existingNIC.user_id.toString() !== userId.toString()) {
      throw new Error("NIC already registered");
    }
  }

  if (first_name !== undefined) donor.first_name = first_name;
  if (last_name !== undefined) donor.last_name = last_name;
  if (nic !== undefined) donor.nic = nic;
  if (phone !== undefined) donor.phone = phone;
  if (address !== undefined) donor.address = address;

  await donor.save();

  return Donor.findOne({ user_id: userId }).populate(
    "user_id",
    "email role created_at"
  );
};

export const deleteDonorProfileByUserId = async (userId) => {
  const donor = await Donor.findOne({ user_id: userId });

  if (!donor) {
    throw new Error("Donor not found");
  }

  await Donor.deleteOne({ user_id: userId });
  await User.deleteOne({ _id: userId });
};
