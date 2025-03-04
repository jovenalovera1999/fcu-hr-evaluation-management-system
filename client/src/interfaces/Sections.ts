import Courses from "./Courses";

interface Sections {
  section_id: number;
  course: Courses;
  section: string;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

export default Sections;
