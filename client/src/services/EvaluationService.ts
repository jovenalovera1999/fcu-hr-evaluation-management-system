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
  updateEvaluationToCancelled: async (
    semesterId: number | null,
    academicYearId: number | null
  ) => {
    return axiosInstance
      .put(
        `/evaluation/updateEvaluationToCancelled/${semesterId}/${academicYearId}`
      )
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
  updateSingleEvaluationToCancelled: async (evaluationId: number) => {
    try {
      const response = await axiosInstance.put(
        `/evaluation/updateSingleEvaluationToCancelled/${evaluationId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default EvaluationService;
