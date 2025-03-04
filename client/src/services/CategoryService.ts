import axiosInstance from "../axios/axiosInstance";

const CategoryService = {
  loadCategories: async () => {
    return axiosInstance
      .get("/category/index")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
  storeCategory: async (data: any) => {
    return axiosInstance
      .post("/category/storeCategory", data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
  updateCategory: async (category_id: number, data: any) => {
    return axiosInstance
      .put(`/category/update/${category_id}`, data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
  destroyCategory: async (category_id: number) => {
    return axiosInstance
      .put(`/category/destroy/${category_id}`)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default CategoryService;
