class SupportRequestDTO {
  constructor(supportRequest) {
    const patient = supportRequest.patient_id;
    const staff = supportRequest.created_by;

    this.id = supportRequest._id;
    this.request_type = supportRequest.request_type;
    this.description = supportRequest.description;
    this.items = supportRequest.items;
    this.urgency_level = supportRequest.urgency_level;
    this.status = supportRequest.status;
    this.needed_date = supportRequest.needed_date;
    this.created_at = supportRequest.created_at;

    this.patient = patient
      ? {
          age: patient.dob ? this.calculateAge(patient.dob) : null,
          gender: patient.gender,
          medical_condition: patient.medical_condition,
        }
      : null;

    this.created_by = staff
      ? {
          id: staff._id,
          name: staff.full_name || null,
        }
      : null;
  }

  calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}

export default SupportRequestDTO;