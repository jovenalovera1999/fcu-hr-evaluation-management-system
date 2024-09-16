import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessage";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    loadingSave: false,
    loadingCategories: true,
    categories: [] as Categories[],
    category: "",
    question: "",
    errors: {} as Errors,
    toastMessage: "",
    toastMessageSuccess: false,
    toastMessageVisible: false,
  });

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveQuestion = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSave: true,
    }));

    await axios
      .post(`${baseUrl}/question/store`, state, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            category: "",
            question: "",
            errors: {} as Errors,
            loadingSave: false,
            toastMessage: "QUESTION SUCCESSFULLY SAVED.",
            toastMessageSuccess: true,
            toastMessageVisible: true,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else if (error.response && error.response.data.errors) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
            loadingSave: false,
          }));
        } else {
          console.error("Unexpected server error: ", error);
        }
      });
  };

  const handleCloseToastMessage = () => {
    setState((prevState) => ({
      ...prevState,
      toastMessage: "",
      toastMessageSuccess: false,
      toastMessageVisible: false,
    }));
  };

  const handleLoadCategories = async () => {
    await axios
      .get(`${baseUrl}/category/index`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else if (error.response && error.response.data.errors) {
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
      <ToastMessage
        message={state.toastMessage}
        success={state.toastMessageSuccess}
        visible={state.toastMessageVisible}
        onClose={handleCloseToastMessage}
      />
      <form onSubmit={handleSaveQuestion}>
        <div className="card mx-auto shadow mt-3 p-3">
          <h5 className="card-title">ADD QUESTION</h5>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="category">CATEGORY</label>
                <select
                  name="category"
                  id="category"
                  className={`form-select ${
                    state.errors.category ? "is-invalid" : ""
                  }`}
                  value={state.category}
                  onChange={handleInput}
                >
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
                {state.errors.category && (
                  <p className="text-danger">{state.errors.category[0]}</p>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="question">QUESTION</label>
                <textarea
                  className={`form-control ${
                    state.errors.question ? "is-invalid" : ""
                  }`}
                  id="question"
                  rows={5}
                  name="question"
                  value={state.question}
                  onChange={handleInput}
                ></textarea>
                {state.errors.question && (
                  <p className="text-danger">{state.errors.question[0]}</p>
                )}
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

  return (
    <Layout
      content={
        state.loadingSave || (!state.loadingSave && state.loadingCategories) ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default AddQuestion;
