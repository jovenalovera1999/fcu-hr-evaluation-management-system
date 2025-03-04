import axiosInstance from "../axios/axiosInstance";

const EvaluationService = {
  loadCurrentEvaluations: async () => {
    return axiosInstance
      .get("/evaluation/loadEvaluationsToCancel")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default EvaluationService;
