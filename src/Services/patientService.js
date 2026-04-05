import Patient from "../Models/patientModel.js";
import Staff from "../Models/staffModel.js";
import { deleteMultipleFilesByUrls } from "../Utils/fileUtils.js";

export const createPatient = async (patientData, userId, files, baseUrl) => {
  const staff = await Staff.findOne({ user_id: userId });

  if (!staff) {
    throw new Error("Staff record not found for this user");
  }

  const documentUrls = files
    ? files.map((file) => `${baseUrl}/src/Uploads/${file.filename}`)
    : [];

  const patient = await Patient.create({
    registered_by: staff._id,
    full_name: patientData.full_name,
    dob: patientData.dob || null,
    gender: patientData.gender || "",
    address: patientData.address || "",
    contact_no: patientData.contact_no || "",
    guardian_name: patientData.guardian_name || "",
    guardian_contact: patientData.guardian_contact || "",
    medical_condition: patientData.medical_condition || "",
    verification_status: patientData.verification_status || "pending",
    verification_documents: documentUrls,
  });

  return patient;
};

export const getAllPatients = async () => {
  return await Patient.find()
    .populate("registered_by", "full_name staff_type designation phone")
    .sort({ created_at: -1 });
};

export const getPatientById = async (patientId) => {
  const patient = await Patient.findById(patientId).populate(
    "registered_by",
    "full_name staff_type designation phone"
  );

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};

export const updatePatient = async (patientId, updateData, files, baseUrl) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new Error("Patient not found");
  }

  let documentUrls = patient.verification_documents || [];

  const shouldReplaceDocuments =
    updateData.replace_documents === "true" ||
    updateData.replace_documents === true;

  if (files && files.length > 0) {
    const newUrls = files.map(
      (file) => `${baseUrl}/src/Uploads/${file.filename}`
    );

    if (shouldReplaceDocuments) {
      deleteMultipleFilesByUrls(documentUrls);
      documentUrls = newUrls;
    } else {
      documentUrls = [...documentUrls, ...newUrls];
    }
  }

  patient.full_name = updateData.full_name ?? patient.full_name;
  patient.dob = updateData.dob ?? patient.dob;
  patient.gender = updateData.gender ?? patient.gender;
  patient.address = updateData.address ?? patient.address;
  patient.contact_no = updateData.contact_no ?? patient.contact_no;
  patient.guardian_name = updateData.guardian_name ?? patient.guardian_name;
  patient.guardian_contact =
    updateData.guardian_contact ?? patient.guardian_contact;
  patient.medical_condition =
    updateData.medical_condition ?? patient.medical_condition;
  patient.verification_status =
    updateData.verification_status ?? patient.verification_status;
  patient.verification_documents = documentUrls;

  await patient.save();

  return patient;
};

export const deletePatient = async (patientId) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new Error("Patient not found");
  }

  deleteMultipleFilesByUrls(patient.verification_documents || []);

  await Patient.findByIdAndDelete(patientId);

  return patient;
};