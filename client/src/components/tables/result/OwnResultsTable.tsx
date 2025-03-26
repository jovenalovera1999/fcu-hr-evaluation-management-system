import { useEffect, useState } from "react";
import { Row, Spinner, Table } from "react-bootstrap";
import Categories from "../../../interfaces/Categories";
import ResponseService from "../../../services/ResponseService";
import errorHandler from "../../../handler/errorHandler";
import CategoryService from "../../../services/CategoryService";

interface OwnResultsTable {
  academicYear: string | "";
  semester: string | "";
  refreshResults: boolean;
}

interface Questions {
  question_id: number;
  question: string;
  totalPoor: string;
  totalUnsatisfactory: string;
  totalSatisfactory: string;
  totalVerySatisfactory: string;
  totalOutstanding: string;
}

const OwnResultsTable = ({
  academicYear,
  semester,
  refreshResults,
}: OwnResultsTable) => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const [categories, setCategories] = useState<Categories[]>([]);
  const [questions, setQuestions] = useState<{ [key: number]: Questions[] }>(
    {}
  );
  // const [stopRequests, setStopRequests] = useState(false)
  // const [totalPoor, setTotalPoor] = useState(0);
  // const [totalUnsatisfactory, setTotalUnsatisfactory] = useState(0);
  // const [totalSatisfactory, setTotalSatisfactory] = useState(0);
  // const [totalVerySatisfactory, setTotalVerySatisfactory] = useState(0);
  // const [totalOutstanding, setTotalOutstanding] = useState(0);
  // const [poorPercentage, setPoorPercentage] = useState(0);
  // const [unsatisfactoryPercentage, setUnsatisfactoryPercentage] = useState(0);
  // const [satisfactoryPercentage, setSatisfactoryPercentage] = useState(0);
  // const [verySatisfactoryPercentage, setVerySatisfactoryPercentage] =
  //   useState(0);
  // const [outstandingPercentage, setOutstandingPercentage] = useState(0);

  // const handleLoadCountOverallTotalResponses = (
  //   employeeId: number,
  //   academicYearId: number,
  //   semesterId: number
  // ) => {
  //   setLoadingResults(true);

  //   ResponseService.loadCountOverallTotalResponses(
  //     employeeId,
  //     academicYearId,
  //     semesterId
  //   )
  //     .then((res) => {
  //       if (res.status === 200) {
  //         setTotalPoor(res.data.overallTotalResponses.poor);
  //         setTotalUnsatisfactory(res.data.overallTotalResponses.unsatisfactory);
  //         setTotalSatisfactory(res.data.overallTotalResponses.satisfactory);
  //         setTotalVerySatisfactory(
  //           res.data.overallTotalResponses.very_satisfactory
  //         );
  //         setTotalOutstanding(res.data.overallTotalResponses.outstanding);
  //         setPoorPercentage(res.data.overallTotalResponses.poor_percentage);
  //         setUnsatisfactoryPercentage(
  //           res.data.overallTotalResponses.unsatisfactory_percentage
  //         );
  //         setSatisfactoryPercentage(
  //           res.data.overallTotalResponses.satisfactory_percentage
  //         );
  //         setVerySatisfactoryPercentage(
  //           res.data.overallTotalResponses.very_satisfactory_percentage
  //         );
  //         setOutstandingPercentage(
  //           res.data.overallTotalResponses.outstanding_percentage
  //         );
  //       } else {
  //         console.error(
  //           "Unexpected status error while loading overall total responses: ",
  //           res.status
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       errorHandler(error, null, null);
  //     })
  //     .finally(() => {
  //       setLoadingResults(false);
  //     });
  // };

  const handleLoadQuestionsWithCountOfResponses = (
    employeeId: number,
    academicYearId: number,
    semesterId: number,
    categoryId: number
  ) => {
    ResponseService.loadQuestionsWithCountOfResponses(
      employeeId,
      academicYearId,
      semesterId,
      categoryId
    )
      .then((res) => {
        if (res.status === 200) {
          setQuestions((prevQuestions) => ({
            ...prevQuestions,
            [categoryId]: res.data.questionsAndResponses,
          }));
        } else {
          console.error(
            "Unexpected status error while loading questions with count of responses: ",
            res.status
          );
        }
      })
      .catch((error) => {
        errorHandler(error, null, null);
      });
  };

  const handleLoadCategories = () => {
    CategoryService.loadCategories()
      .then((res) => {
        if (res.status === 200) {
          res.data.categories.map((category: Categories) => {
            handleLoadQuestionsWithCountOfResponses(
              parsedUser.employee_id,
              parseInt(academicYear),
              parseInt(semester),
              category.category_id
            );
          });

          setCategories(res.data.categories);
        } else {
          console.error(
            "Unexpected status error while loading categories: ",
            res.status
          );
        }
      })
      .catch((error) => {
        errorHandler(error, null, null);
      });
  };

  useEffect(() => {
    // handleLoadCountOverallTotalResponses(
    //   parsedUser.employee_id,
    //   parseInt(academicYear),
    //   parseInt(semester)
    // );

    handleLoadCategories();
  }, [refreshResults, parsedUser, academicYear, semester]);

  return (
    <>
      {categories.map((category, index) => (
        <Row key={index}>
          <Table responsive hover>
            <caption>{category.category}</caption>
            <thead>
              <tr className="align-middle">
                <th className="text-center">NO.</th>
                <th className="text-center">QUESTION</th>
                <th className="text-center">POOR</th>
                <th className="text-center">UNSATISFACTORY</th>
                <th className="text-center">SATISFACTORY</th>
                <th className="text-center">VERY SATISFACTORY</th>
                <th className="text-center">OUTSTANDING</th>
              </tr>
            </thead>
            <tbody>
              {questions[category.category_id] &&
              questions[category.category_id].length > 0 ? (
                questions[category.category_id].map((question, index) => (
                  <tr className="align-middle" key={question.question_id}>
                    <td className="text-center">{index + 1}</td>
                    <td>{question.question}</td>
                    <td className="text-center">{question.totalPoor}</td>
                    <td className="text-center">
                      {question.totalUnsatisfactory}
                    </td>
                    <td className="text-center">
                      {question.totalSatisfactory}
                    </td>
                    <td className="text-center">
                      {question.totalVerySatisfactory}
                    </td>
                    <td className="text-center">{question.totalOutstanding}</td>
                  </tr>
                ))
              ) : (
                <tr className="align-middle">
                  <td colSpan={7} className="text-center">
                    {questions[category.category_id] ? (
                      "No records found."
                    ) : (
                      <Spinner
                        as="span"
                        animation="border"
                        role="status"
                        className="spinner-theme"
                      />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Row>
      ))}
    </>
  );
};

export default OwnResultsTable;
