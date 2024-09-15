import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";

interface QuestionsProps {
  baseUrl: string;
}

interface Questions {
  question_id: number;
  category: string;
  question: string;
}

const Questions = ({ baseUrl }: QuestionsProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [state, setState] = useState({
    loadingQuestions: true,
    questions: [] as Questions[],
  });

  const handleLoadQuestions = async () => {
    await axios
      .get(`${baseUrl}/question/index`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          console.error("Unexpected server error: ", error);
        }
      });
  };

  useEffect(() => {
    document.title = "LIST OF QUESTIONS | FCU HR EMS";
    handleLoadQuestions();
  }, []);

  const content = (
    <>
      <div className="card shadow mx-auto mt-3 p-3">
        <h5 className="card-title">LIST OF QUESTIONS</h5>
        <div className="card-body">
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
      </div>
    </>
  );

  return <Layout content={state.loadingQuestions ? <Spinner /> : content} />;
};

export default Questions;
