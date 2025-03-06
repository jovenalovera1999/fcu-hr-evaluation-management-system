import axiosInstance from "../axios/axiosInstance";

const AcademicYearService = {
  loadAcademicYears: async () => {
    return axiosInstance("/academic_year/index")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
  fetchAcademicYear: async (academicYearId: number) => {
    return axiosInstance(`/academic_year/fetchAcademicYear/${academicYearId}`)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default AcademicYearService;
