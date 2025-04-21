import axiosInstance from "../axios/axiosInstance";

const StudentService = {
  updatePassword: async (studentId: number, data: any) => {
    try {
      const response = await axiosInstance.put(
        `/student/updatePassword/${studentId}`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default StudentService;
