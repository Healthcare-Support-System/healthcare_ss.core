import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../Services/patientService.js";
import { patientResponseDTO } from "../DTOs/patientDTO.js";

export const addPatient = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const patient = await createPatient(
      req.body,
      req.user.id,
      req.files,
      baseUrl
    );

    res.status(201).json({
      message: "Patient created successfully",
      patient: patientResponseDTO(patient),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await getAllPatients();

    res.status(200).json({
      message: "Patients fetched successfully",
      patients: patients.map(patientResponseDTO),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatient = async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id);

    res.status(200).json({
      message: "Patient fetched successfully",
      patient: patientResponseDTO(patient),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editPatient = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const patient = await updatePatient(
      req.params.id,
      req.body,
      req.files,
      baseUrl
    );

    res.status(200).json({
      message: "Patient updated successfully",
      patient: patientResponseDTO(patient),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removePatient = async (req, res) => {
  try {
    await deletePatient(req.params.id);

    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};