import axiosInstance from "../axios/axiosInstance";

const AcademicYearService = {
  loadAcademicYears: async () => {
    return axiosInstance("/academic_year/index")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default AcademicYearService;
