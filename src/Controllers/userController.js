import { loginUser, getAllUsers } from "../Services/userService.js";
import { userResponseDTO } from "../DTOs/userDTO.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponseDTO(user)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users.map(userResponseDTO));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};