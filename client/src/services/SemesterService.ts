import axiosInstance from "../axios/axiosInstance";

const SemesterService = {
  loadSemesters: async (academicYearId: number) => {
    return axiosInstance
      .get(`/semester/load/semesters/by/academic_year/${academicYearId}`)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default SemesterService;
