import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";

interface AddQuestionProps {
  baseUrl: string;
  csrfToken: string | null | undefined;
}

interface Categories {
  category_id: number;
  category: string;
}

interface Errors {
  category?: string[];
  question?: string[];
}

const AddQuestion = ({ baseUrl, csrfToken }: AddQuestionProps) => {
  const [state, setState] = useState({
    loadingCategories: true,
    categories: [] as Categories[],
    category: "",
    question: "",
    errors: {} as Errors,
    toastMessage: "",
    toastMessageSuccess: false,
    toastMessageVisible: false,
  });

  const handleLoadCategories = async () => {
    await axios
      .get(`${baseUrl}/category/index`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            categories: res.data.categories,
            loadingCategories: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          console.error("Unexpected server error: ", error);
        }
      });
  };

  useEffect(() => {
    document.title = "ADD QUESTION | FCU HR EMS";
    handleLoadCategories();
  }, []);

  const content = (
    <>
      <form>
        <div className="card mx-auto shadow mt-3 p-3">
          <h5 className="card-title">ADD QUESTION</h5>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="category">CATEGORY</label>
                <select name="category" id="category" className="form-select">
                  <option value="">N/A</option>
                  {state.categories.map((category) => (
                    <option
                      value={category.category_id}
                      key={category.category_id}
                    >
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="question">QUESTION</label>
                <textarea
                  className="form-control"
                  id="question"
                  rows={3}
                  name="question"
                ></textarea>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-theme">
                SAVE QUESTION
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );

  return <Layout content={state.loadingCategories ? <Spinner /> : content} />;
};

export default AddQuestion;
