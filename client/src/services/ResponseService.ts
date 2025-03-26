import axiosInstance from "../axios/axiosInstance";

const ResponseService = {
  loadCountOverallTotalResponses: async (
    employeeId: number,
    academicYearId: number,
    semesterId: number
  ) => {
    return axiosInstance
      .get(
        `/response/loadCountOverallTotalResponses?employee_id=${employeeId}&academic_year_id=${academicYearId}&semester_id=${semesterId}`
      )
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
  loadQuestionsWithCountOfResponses: async (
    employeeId: number,
    academicYearId: number,
    semesterId: number,
    categoryId: number
  ) => {
    return axiosInstance
      .get(
        `/response/loadQuestionsWithCountOfResponsess?employee_id=${employeeId}&academic_year_id=${academicYearId}&semester_id=${semesterId}&category_id=${categoryId}`
      )
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default ResponseService;
