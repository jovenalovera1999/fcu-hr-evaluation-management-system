import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";

interface ResponseProps {
  baseUrl: string;
  csrfToken: string | null | undefined;
}

interface Categories {
  category_id: number;
  category: string;
}

interface Questions {
  question_id: number;
  question: string;
}

interface Errors {
  [key: number]: string[];
}

const Response = ({ baseUrl, csrfToken }: ResponseProps) => {
  const token = localStorage.getItem("token");

  const { evaluation_id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingSubmitEvaluation: false,
    loadingCategories: true,
    loadingQuestions: true,
    loadingEvaluation: true,
    categories: [] as Categories[],
    questionsByCategory: {} as { [key: number]: Questions[] },
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    department: "",
    position: "",
    evaluation_id: "",
    question_id: "",
    answers: {} as { [key: number]: string },
    errors: {} as Errors,
  });

  const handleInput = (
    e: ChangeEvent<HTMLInputElement>,
    question_id: number
  ) => {
    const { value } = e.target;

    setState((prevState) => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [question_id]: value,
      },
    }));

    console.log(state.answers);
  };

  const handleSubmitEvaluation = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingSubmitEvaluation: true,
    }));

    // Validate if all questions have been answered
    const newErrors: Errors = {};
    state.categories.forEach((category) => {
      state.questionsByCategory[category.category_id]?.forEach((question) => {
        if (!state.answers[question.question_id]) {
          if (!newErrors[question.question_id]) {
            newErrors[question.question_id] = [];
          }
          newErrors[question.question_id].push(
            "This question must be answered."
          );
        }
      });
    });

    // If there are errors, set the state and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setState((prevState) => ({
        ...prevState,
        errors: newErrors,
        loadingSubmitEvaluation: false,
      }));
      return;
    }

    await axios
      .put(`${baseUrl}/response/update/${evaluation_id}`, state, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          navigate("/evaluation/list", {
            state: {
              toastMessage: "YOUR EVALUATION HAS BEEN RECORDED.",
              toastMessageSuccess: true,
              toastMessageVisible: true,
            },
          });
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
            loadingSubmitEvaluation: false,
          }));
        } else {
          console.error("Unexpected server error: ", error);
        }
      });
  };

  const handleLoadCategories = async () => {
    await axios
      .get(`${baseUrl}/response/index`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status === 200) {
          res.data.categories.map((category: Categories) => {
            setState((prevState) => ({
              ...prevState,
              loadingQuestions: true,
            }));

            handleLoadQuestionsByCategories(category.category_id);
          });

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
        console.error("Unexpected server error: ", error);
      });
  };

  const handleLoadQuestionsByCategories = async (categoryId: number) => {
    await axios
      .get(`${baseUrl}/response/index/${categoryId}}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            questionsByCategory: {
              ...prevState.questionsByCategory,
              [categoryId]: res.data.questions,
            },
            loadingQuestions: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  const handleFetchEvaluation = async () => {
    axios
      .get(`${baseUrl}/response/show/${evaluation_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.status) {
          setState((prevState) => ({
            ...prevState,
            first_name: res.data.evaluation.first_name,
            middle_name: res.data.evaluation.middle_name,
            last_name: res.data.evaluation.last_name,
            suffix_name: res.data.evaluation.suffix_name,
            department: res.data.evaluation.department,
            position: res.data.evaluation.position,
            loadingEvaluation: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  const employeeFullName = () => {
    let fullName = "";

    if (state.middle_name) {
      fullName = `${state.last_name}, ${
        state.first_name
      } ${state.middle_name.charAt(0)}.`;
    } else {
      fullName = `${state.last_name}, ${state.first_name}`;
    }

    if (state.suffix_name) {
      fullName += ` ${state.suffix_name}`;
    }

    return fullName;
  };

  useEffect(() => {
    document.title = "RESPONSE | FCU HR EMS";
    handleLoadCategories();
    handleFetchEvaluation();
  }, [evaluation_id]);

  const content = (
    <>
      <form onSubmit={handleSubmitEvaluation}>
        <div className="card shadow mx-auto mt-3 p-3">
          <h5 className="card-title">EVALUATION RESPONSE</h5>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-4">
                <p className="fs-6">
                  <strong>TEACHER NAME: </strong>
                  <u>{employeeFullName()}</u>
                </p>
              </div>
              <div className="col-sm-4">
                <p className="fs-6">
                  <strong>DEPARTMENT: </strong>
                  <u>{state.department}</u>
                </p>
              </div>
              <div className="col-sm-4">
                <p className="fs-6">
                  <strong>POSITION: </strong>
                  <u>{state.position}</u>
                </p>
              </div>
            </div>
            <div className="table-responsive">
              {state.categories.map((category) => (
                <>
                  <h5>
                    <strong>{category.category}</strong>
                  </h5>
                  <table className="table table-hover mb-3">
                    <thead>
                      <tr>
                        <th className="text-center">NO.</th>
                        <th className="text-center">QUESTION</th>
                        <th className="text-center">POOR</th>
                        <th className="text-center">MEDIOCRE</th>
                        <th className="text-center">SATISFACTORY</th>
                        <th className="text-center">GOOD</th>
                        <th className="text-center">EXCELLENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.questionsByCategory[category.category_id] ? (
                        state.questionsByCategory[category.category_id].map(
                          (question, index) => (
                            <tr key={question.question_id}>
                              <td className="text-center">{index + 1}</td>
                              <td>{question.question}</td>
                              <td className="text-center">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name={`answers[${question.question_id}]`}
                                  value="poor"
                                  onChange={(e) =>
                                    handleInput(e, question.question_id)
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name={`answers[${question.question_id}]`}
                                  value="mediocre"
                                  onChange={(e) =>
                                    handleInput(e, question.question_id)
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name={`answers[${question.question_id}]`}
                                  value="satisfactory"
                                  onChange={(e) =>
                                    handleInput(e, question.question_id)
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name={`answers[${question.question_id}]`}
                                  value="good"
                                  onChange={(e) =>
                                    handleInput(e, question.question_id)
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  name={`answers[${question.question_id}]`}
                                  value="excellent"
                                  onChange={(e) =>
                                    handleInput(e, question.question_id)
                                  }
                                />
                              </td>
                              {state.errors[question.question_id] && (
                                <td colSpan={7} className="text-danger">
                                  {state.errors[question.question_id].map(
                                    (error, i) => (
                                      <p key={i}>{error}</p>
                                    )
                                  )}
                                </td>
                              )}
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td colSpan={7}>
                            <Spinner />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-theme">
              SUBMIT RESPONSE
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <Layout
      content={
        state.loadingSubmitEvaluation ||
        (!state.loadingSubmitEvaluation && state.loadingCategories) ||
        (!state.loadingSubmitEvaluation && state.loadingQuestions) ||
        (!state.loadingSubmitEvaluation && state.loadingEvaluation) ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default Response;
