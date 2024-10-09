import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";

interface Questions {
  question_id: number;
  category: string;
  question: string;
}

const Questions = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const [state, setState] = useState({
    loadingQuestions: true,
    questions: [] as Questions[],
  });

  const handleLoadQuestions = async () => {
    axiosInstance
      .get("/question/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            questions: res.data.questions,
            loadingQuestions: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  useEffect(() => {
    document.title = "LIST OF QUESTIONS | FCU HR EMS";

    if (
      !token ||
      !user ||
      !parsedUser ||
      parsedUser.position !== "ADMIN" ||
      !parsedUser.position
    ) {
      errorHandler(401);
    } else {
      handleLoadQuestions();
    }
  }, []);

  const content = (
    <>
      <div className="mx-auto mt-2">
        <h4>LIST OF QUESTIONS</h4>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>NO.</th>
                <th>CATEGORY</th>
                <th>QUESTION</th>
              </tr>
            </thead>
            <tbody>
              {state.questions.map((question, index) => (
                <tr key={question.question_id}>
                  <td>{index + 1}</td>
                  <td>{question.category}</td>
                  <td>{question.question}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return <Layout content={state.loadingQuestions ? <Spinner /> : content} />;
};

export default Questions;
