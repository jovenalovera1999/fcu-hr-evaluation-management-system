import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import ToastMessage from "../../components/ToastMessageOld";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { useNavigate } from "react-router-dom";

interface Categories {
  category_id: number;
  category: string;
}

interface Positions {
  position_id: number;
  position: string;
}

interface Errors {
  category?: string[];
  question?: string[];
  position?: string[];
}

const AddQuestion = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingSave: false,
    loadingCategories: true,
    loadingPositions: false,
    categories: [] as Categories[],
    positions: [] as Positions[],
    category: "",
    question: "",
    position: "",
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

    axiosInstance
      .post("/question/store", state)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            category: "",
            question: "",
            errors: {} as Errors,
            loadingSave: false,
            toastMessage: "QUESTION SUCCESSFULLY SAVED!",
            toastMessageSuccess: true,
            toastMessageVisible: true,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
            loadingSave: false,
          }));
        } else {
          errorHandler(error, navigate);
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
    axiosInstance
      .get("/category/index")
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
        errorHandler(error, navigate);
      });
  };

  const handleLoadPositions = async () => {
    setState((prevState) => ({
      ...prevState,
      loadingPositions: true,
    }));

    axiosInstance
      .get("/position/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            positions: res.data.positions,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({ ...prevState, loadingPositions: false }));
      });
  };

  useEffect(() => {
    document.title = "ADD QUESTION | FCU HR EMS";

    if (
      !token ||
      !user ||
      !parsedUser ||
      parsedUser.position !== "ADMIN" ||
      !parsedUser.position
    ) {
      errorHandler(401, navigate);
    } else {
      handleLoadCategories();
      handleLoadPositions();
    }
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
        <div className="mx-auto mt-2">
          <h4>ADD QUESTION</h4>
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

            <div className="col-md-6 mb-3">
              <label htmlFor="position">POSITION</label>
              <select
                className={`${state.errors.position ? "is-invalid" : ""}`}
                name="position"
                id="position"
              >
                <option value="">N/A</option>
                {state.loadingPositions ? (
                  <option value="">LOADING...</option>
                ) : (
                  state.positions.map((position) => (
                    <option
                      value={position.position_id}
                      key={position.position_id}
                    >
                      {position.position}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-theme">
              SAVE QUESTION
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <Layout
      content={
        state.loadingSave ||
        state.loadingPositions ||
        (!state.loadingSave && state.loadingCategories) ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default AddQuestion;
