import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";

interface ResponseProps {
  baseUrl: string;
}

interface Categories {
  category_id: number;
  category: string;
}

interface Questions {
  question_id: number;
  question: string;
}

const Response = ({ baseUrl }: ResponseProps) => {
  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    loadingSubmitEvaluation: false,
    loadingCategories: true,
    loadingQuestions: true,
    categories: [] as Categories[],
    questionsByCategory: {} as { [key: number]: Questions[] },
  });

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

  useEffect(() => {
    document.title = "RESPONSE | FCU HR EMS";
    handleLoadCategories();
  }, []);

  const content = (
    <>
      <div className="card shadow mx-auto mt-3 p-3">
        <h5 className="card-title">EVALUATION RESPONSE</h5>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-4">
              <p className="fs-6">
                <strong>TEACHER NAME: </strong>
                <u>NAME OF TEACHER</u>
              </p>
            </div>
            <div className="col-sm-4">
              <p className="fs-6">
                <strong>DEPARTMENT: </strong>
                <u>NAME OF DEPARTMENT</u>
              </p>
            </div>
            <div className="col-sm-4">
              <p className="fs-6">
                <strong>POSITION: </strong>
                <u>NAME OF POSITION</u>
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
                      <th>NO.</th>
                      <th>QUESTION</th>
                      <th>POOR</th>
                      <th>MEDIOCRE</th>
                      <th>SATISFACTORY</th>
                      <th>GOOD</th>
                      <th>EXCELLENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.questionsByCategory[category.category_id] ? (
                      state.questionsByCategory[category.category_id].map(
                        (question, index) => (
                          <tr key={question.question_id}>
                            <td>{index + 1}</td>
                            <td>{question.question}</td>
                            <td className="text-center">
                              <input
                                type="radio"
                                name={`q${question.question_id}`}
                                value="poor"
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="radio"
                                name={`q${question.question_id}`}
                                value="mediocre"
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="radio"
                                name={`q${question.question_id}`}
                                value="satisfactory"
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="radio"
                                name={`q${question.question_id}`}
                                value="good"
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="radio"
                                name={`q${question.question_id}`}
                                value="excellent"
                              />
                            </td>
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
      </div>
    </>
  );

  return (
    <Layout
      content={
        state.loadingSubmitEvaluation ||
        (!state.loadingSubmitEvaluation && state.loadingCategories) ||
        (!state.loadingSubmitEvaluation && state.loadingQuestions) ? (
          <Spinner />
        ) : (
          content
        )
      }
    />
  );
};

export default Response;
