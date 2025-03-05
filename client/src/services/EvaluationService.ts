import axiosInstance from "../axios/axiosInstance";

const EvaluationService = {
  loadCurrentEvaluations: async (
    academicYearId: number | null,
    semesterId: number | null
  ) => {
    return axiosInstance
      .get(
        academicYearId && semesterId
          ? `/evaluation/loadEvaluationsToCancel?academicYearId=${academicYearId}&semesterId=${semesterId}`
          : "/evaluation/loadEvaluationsToCancel"
      )
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default EvaluationService;
