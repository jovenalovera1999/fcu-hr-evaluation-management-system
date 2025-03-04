import AcademicYears from "./AcademicYear";

interface Semesters {
  semester_id: number;
  academic_year: AcademicYears;
  semester: string;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

export default Semesters;
