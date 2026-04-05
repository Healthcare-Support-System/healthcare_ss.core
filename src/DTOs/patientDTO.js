export const patientResponseDTO = (patient) => {
  return {
    id: patient._id,
    registered_by: patient.registered_by,
    full_name: patient.full_name,
    dob: patient.dob,
    gender: patient.gender,
    address: patient.address,
    contact_no: patient.contact_no,
    guardian_name: patient.guardian_name,
    guardian_contact: patient.guardian_contact,
    medical_condition: patient.medical_condition,
    verification_status: patient.verification_status,
    verification_documents: patient.verification_documents,
    created_at: patient.created_at,
  };
};