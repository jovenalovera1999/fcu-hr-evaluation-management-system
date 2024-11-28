import {
  Button,
  Col,
  FormLabel,
  FormSelect,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import Layout from "../layout/Layout";
import { ChangeEvent, useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";

interface AcademicYears {
  academic_year_id: number;
  academic_year: string;
}

interface Semesters {
  semester_id: number;
  semester: string;
}

interface Employees {
  employee_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  position: string;
  department: string;
}

interface Categories {
  category_id: number;
  category: string;
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

const Results = () => {
  // const [state, setState] = useState({
  //   loadingAcademicYears: true,
  //   loadingSemesters: false,
  //   loadingResults: false,
  //   loadingSummary: false,
  //   loadingCategories: false,
  //   loadingQuestions: false,
  //   academicYears: [] as AcademicYears[],
  //   semesters: [] as Semesters[],
  //   results: [] as Results[],
  //   categories: [] as Categories[],
  //   questions: {} as { [key: number]: Questions[] },
  //   employee_id: 0,
  //   academic_year: "",
  //   semester: "",
  //   poor: 0,
  //   unsatisfactory: 0,
  //   satisfactory: 0,
  //   very_satisfactory: 0,
  //   outstanding: 0,
  //   showSummaryResponseModal: false,
  // });
  // const handleInput = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setState((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  //   if (name === "academic_year") {
  //     setState((prevState) => ({
  //       ...prevState,
  //       loadingSemesters: true,
  //     }));
  //     handleLoadSemesters(parseInt(value));
  //   } else if (name === "semester") {
  //     setState((prevState) => ({
  //       ...prevState,
  //       loadingResults: true,
  //     }));
  //     handleLoadResults(parseInt(value));
  //   }
  // };
  // const handleLoadAcademicYears = async () => {
  //   axiosInstance
  //     .get("/academic_year/index")
  //     .then((res) => {
  //       if (res.data.status === 200) {
  //         setState((prevState) => ({
  //           ...prevState,
  //           academicYears: res.data.academicYears,
  //           loadingAcademicYears: false,
  //         }));
  //       } else {
  //         console.error("Unexpected status error: ", res.data.status);
  //       }
  //     })
  //     .catch((error) => {
  //       errorHandler(error);
  //     });
  // };
  // const handleLoadSemesters = async (academicYearId: number) => {
  //   axiosInstance
  //     .get(`/semester/load/semesters/by/academic_year/${academicYearId}`)
  //     .then((res) => {
  //       if (res.data.status === 200) {
  //         setState((prevState) => ({
  //           ...prevState,
  //           semesters: res.data.semesters,
  //           loadingSemesters: false,
  //         }));
  //       } else {
  //         console.error("Unexpected status error: ", res.data.status);
  //       }
  //     })
  //     .catch((error) => {
  //       errorHandler(error);
  //     });
  // };
  // const handleLoadResults = async (semesterId: number) => {
  //   axiosInstance
  //     .get(`/response/load/results/${semesterId}`)
  //     .then((res) => {
  //       if (res.data.status === 200) {
  //         setState((prevState) => ({
  //           ...prevState,
  //           results: res.data.results,
  //           loadingResults: false,
  //         }));
  //       } else {
  //         console.error("Unexpected status error: ", res.data.status);
  //       }
  //     })
  //     .catch((error) => {
  //       errorHandler(error);
  //     });
  // };
  // const handleLoadSummary = async (employeeId: number, semesterId: number) => {
  //   axiosInstance
  //     .get(`/response/load/summary/${employeeId}/${semesterId}`)
  //     .then((res) => {
  //       if (res.data.status === 200) {
  //         setState((prevState) => ({
  //           ...prevState,
  //           poor: res.data.summary.poor,
  //           unsatisfactory: res.data.summary.unsatisfactory,
  //           satisfactory: res.data.summary.satisfactory,
  //           very_satisfactory: res.data.summary.very_satisfactory,
  //           outstanding: res.data.summary.outstanding,
  //           loadingSummary: false,
  //         }));
  //       } else {
  //         console.error("Unexpected status error: ", res.data.status);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Unexpected server error: ", error);
  //     });
  // };
  // const handleLoadCategories = async () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     loadingCategories: true,
  //   }));
  //   axiosInstance
  //     .get("/category/index")
  //     .then((res) => {
  //       if (res.data.status === 200) {
  //         res.data.categories.map((category: Categories) => {
  //           setState((prevState) => ({
  //             ...prevState,
  //             loadingQuestions: true,
  //           }));
  //           handleLoadQuestions(category.category_id);
  //         });
  //         setState((prevState) => ({
  //           ...prevState,
  //           categories: res.data.categories,
  //           loadingCategories: false,
  //         }));
  //       } else {
  //         console.error("Unexpected status error: ", res.data.status);
  //       }
  //     })
  //     .catch((error) => {
  //       errorHandler(error);
  //     });
  // };
  // const handleLoadQuestions = async (categoryId: number) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     loadingQuestions: true,
  //   }));
  //   axiosInstance
  //     .get(
  //       `/response/load/response/answers/${state.employee_id}/${state.semester}/${categoryId}`
  //     )
  //     .then((res) => {
  //       if (res.data.status === 200) {
  //         setState((prevState) => ({
  //           ...prevState,
  //           questions: {
  //             ...prevState.questions,
  //             [categoryId]: res.data.responses,
  //           },
  //           loadingQuestions: false,
  //         }));
  //       } else {
  //         console.error("Unexpected status error: ", res.data.status);
  //       }
  //     })
  //     .catch((error) => {
  //       errorHandler(error);
  //     });
  // };
  // const handleOpenResponseSummary = (employee: Results) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     loadingSummary: true,
  //     employee_id: employee.employee_id,
  //     showSummaryResponseModal: true,
  //   }));
  //   handleLoadCategories();
  //   handleLoadSummary(employee.employee_id, parseInt(state.semester));
  // };
  // const handleCloseResponseSummary = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     showSummaryResponseModal: false,
  //   }));
  // };
  // const handleEmployeeFullName = (employee: Results) => {
  //   let fullName = "";
  //   if (employee.middle_name) {
  //     fullName = `${employee.last_name}, ${
  //       employee.first_name
  //     } ${employee.middle_name.charAt(0)}.`;
  //   } else {
  //     fullName = `${employee.last_name}, ${employee.first_name}`;
  //   }
  //   if (employee.suffix_name) {
  //     fullName += ` ${employee.suffix_name}`;
  //   }
  //   return fullName;
  // };
  // useEffect(() => {
  //   document.title = "EVALUATION RESULTS | FCU HR EMS";
  //   handleLoadAcademicYears();
  // }, []);
  // const content = (
  //   <>
  //     <div className="mx-auto mt-2">
  //       <Row>
  //         <Col sm={3}>
  //           <div className="mb-3">
  //             <FormLabel htmlFor="academic_year">ACADEMIC YEAR</FormLabel>
  //             <FormSelect
  //               name="academic_year"
  //               id="academic_year"
  //               value={state.academic_year}
  //               onChange={handleInput}
  //               autoFocus
  //             >
  //               <option value="">N/A</option>
  //               {state.academicYears.map((academicYear) => (
  //                 <option
  //                   value={academicYear.academic_year_id}
  //                   key={academicYear.academic_year_id}
  //                 >
  //                   {academicYear.academic_year}
  //                 </option>
  //               ))}
  //             </FormSelect>
  //           </div>
  //         </Col>
  //         <Col sm={3}>
  //           <div className="mb-3">
  //             <FormLabel htmlFor="semester">SEMESTER</FormLabel>
  //             <FormSelect
  //               name="semester"
  //               id="semester"
  //               value={state.semester}
  //               onChange={handleInput}
  //             >
  //               <option value="">N/A</option>
  //               {state.loadingSemesters ? (
  //                 <option value="">LOADING...</option>
  //               ) : (
  //                 state.semesters.map((semester) => (
  //                   <option
  //                     value={semester.semester_id}
  //                     key={semester.semester_id}
  //                   >
  //                     {semester.semester}
  //                   </option>
  //                 ))
  //               )}
  //             </FormSelect>
  //           </div>
  //         </Col>
  //       </Row>
  //       <Row>
  //         <Table hover size="sm" responsive="sm">
  //           <thead>
  //             <tr>
  //               <th>NO.</th>
  //               <th>NAME OF EMPLOYEE</th>
  //               <th>POSITION</th>
  //               <th>DEPARTMENT</th>
  //               <th>ACTION</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {state.loadingResults ? (
  //               <tr className="align-middle">
  //                 <td colSpan={5} className="text-center">
  //                   <Spinner
  //                     as="span"
  //                     animation="border"
  //                     role="status"
  //                     className="spinner-theme"
  //                   />
  //                 </td>
  //               </tr>
  //             ) : (
  //               state.results.map((result, index) => (
  //                 <tr key={result.employee_id} className="align-middle">
  //                   <td>{index + 1}</td>
  //                   <td>{handleEmployeeFullName(result)}</td>
  //                   <td>{result.position}</td>
  //                   <td>{result.department}</td>
  //                   <td>
  //                     <Button
  //                       className="btn-theme"
  //                       size="sm"
  //                       onClick={() => handleOpenResponseSummary(result)}
  //                     >
  //                       VIEW RATING
  //                     </Button>
  //                   </td>
  //                 </tr>
  //               ))
  //             )}
  //           </tbody>
  //         </Table>
  //       </Row>
  //     </div>
  //     <Modal
  //       show={state.showSummaryResponseModal}
  //       onHide={handleCloseResponseSummary}
  //       fullscreen={true}
  //     >
  //       <ModalHeader>RESPONSE SUMMARY</ModalHeader>
  //       <ModalBody>
  //         {state.loadingSummary ||
  //         state.loadingCategories ||
  //         state.loadingQuestions ? (
  //           <>
  //             <div className="d-flex justify-content-center align-items-center">
  //               <Spinner
  //                 as="span"
  //                 animation="border"
  //                 role="status"
  //                 className="spinner-theme"
  //               />
  //             </div>
  //           </>
  //         ) : (
  //           <>
  //             <Row>
  //               <Col>
  //                 POOR
  //                 <br />
  //                 <p className="fs-3">{state.poor}</p>
  //               </Col>
  //               <Col>
  //                 UNSATISFACTORY
  //                 <br />
  //                 <p className="fs-3">{state.unsatisfactory}</p>
  //               </Col>
  //               <Col>
  //                 SATISFACTORY
  //                 <br />
  //                 <p className="fs-3">{state.satisfactory}</p>
  //               </Col>
  //               <Col>
  //                 VERY SATISFACTORY
  //                 <br />
  //                 <p className="fs-3">{state.very_satisfactory}</p>
  //               </Col>
  //               <Col>
  //                 OUTSTANDING
  //                 <br />
  //                 <p className="fs-3">{state.outstanding}</p>
  //               </Col>
  //             </Row>
  //             {state.categories.map((category) => (
  //               <Row>
  //                 <Table hover size="sm" responsive="sm">
  //                   <caption>{category.category}</caption>
  //                   <thead>
  //                     <tr className="align-middle">
  //                       <td className="text-center">NO.</td>
  //                       <td className="text-center">QUESTION</td>
  //                       <td className="text-center">POOR</td>
  //                       <td className="text-center">UNSATISFACTORY</td>
  //                       <td className="text-center">SATISFACTORY</td>
  //                       <td className="text-center">VERY SATISFACTORY</td>
  //                       <td className="text-center">OUTSTANDING</td>
  //                     </tr>
  //                   </thead>
  //                   <tbody>
  //                     {state.questions[category.category_id] ? (
  //                       state.questions[category.category_id].map(
  //                         (question, index) => (
  //                           <tr className="align-middle">
  //                             <td className="text-center">{index + 1}</td>
  //                             <td>{question.question}</td>
  //                             <td className="text-center">
  //                               {question.question_poor}
  //                             </td>
  //                             <td className="text-center">
  //                               {question.question_unsatisfactory}
  //                             </td>
  //                             <td className="text-center">
  //                               {question.question_satisfactory}
  //                             </td>
  //                             <td className="text-center">
  //                               {question.question_very_satisfactory}
  //                             </td>
  //                             <td className="text-center">
  //                               {question.question_outstanding}
  //                             </td>
  //                           </tr>
  //                         )
  //                       )
  //                     ) : (
  //                       <tr className="align-middle">
  //                         <td colSpan={7} className="text-center">
  //                           <Spinner
  //                             as="span"
  //                             animation="border"
  //                             role="status"
  //                           />
  //                         </td>
  //                       </tr>
  //                     )}
  //                   </tbody>
  //                 </Table>
  //               </Row>
  //             ))}
  //           </>
  //         )}
  //       </ModalBody>
  //       <ModalFooter>
  //         <Button className="btn-theme" onClick={handleCloseResponseSummary}>
  //           CLOSE
  //         </Button>
  //       </ModalFooter>
  //     </Modal>
  //   </>
  // );
  // return (
  //   <Layout
  //     content={
  //       state.loadingAcademicYears ? (
  //         <>
  //           <div
  //             className="d-flex justify-content-center align-items-center"
  //             style={{ minHeight: "80vh" }}
  //           >
  //             <Spinner
  //               as="span"
  //               animation="border"
  //               role="status"
  //               className="spinner-theme"
  //             />
  //           </div>
  //         </>
  //       ) : (
  //         content
  //       )
  //     }
  //   />
  // );

  const [state, setState] = useState({
    loadingAcademicYears: true,
    loadingSemesters: false,
    loadingEmployees: false,
    loadingCategories: false,
    loadingQuestions: false,
    loadingResult: false,
    academicYears: [] as AcademicYears[],
    semesters: [] as Semesters[],
    employees: [] as Employees[],
    categories: [] as Categories[],
    questions: {} as { [key: number]: Questions[] },
    academic_year: "",
    semester: "",
    category: "",
    totalPoor: 0,
    totalUnsatisfactory: 0,
    totalSatisfactory: 0,
    totalVerySatisfactory: 0,
    totalOutstanding: 0,
    questionTotalPoor: 0,
    questionTotalUnsatisfactory: 0,
    questionTotalSatisfactory: 0,
    questionTotalVerySatisfactory: 0,
    questionTotalOutstanding: 0,
    showResultModal: false,
  });

  const handleInput = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "academic_year") {
      setState((prevState) => ({
        ...prevState,
        loadingSemesters: true,
      }));

      handleLoadSemesters(parseInt(value));
    }

    const academicYearId =
      name === "academic_year"
        ? parseInt(value)
        : parseInt(state.academic_year);
    const semesterId =
      name === "semester" ? parseInt(value) : parseInt(state.semester);

    if (academicYearId && semesterId) {
      setState((prevState) => ({
        ...prevState,
        loadingEmployees: true,
      }));

      handleLoadEmployees(academicYearId, semesterId);
    }
  };

  const handleLoadAcademicYears = async () => {
    axiosInstance
      .get("/academic_year/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            academicYears: res.data.academicYears,
            loadingAcademicYears: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleLoadSemesters = async (academicYearId: number) => {
    axiosInstance
      .get(`/semester/load/semesters/by/academic_year/${academicYearId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            semesters: res.data.semesters,
            loadingSemesters: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleLoadEmployees = async (
    academicYearId: number,
    semesterId: number
  ) => {
    axiosInstance
      .get(
        `/employee/load/by/academic_year/and/semester/${academicYearId}/${semesterId}`
      )
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            employees: res.data.employees,
            loadingEmployees: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleEmployeeFullName = (employee: Employees) => {
    let fullName = "";

    if (employee.middle_name) {
      fullName = `${employee.last_name}, ${
        employee.first_name
      } ${employee.middle_name.charAt(0)}.`;
    } else {
      fullName = `${employee.last_name}, ${employee.first_name}`;
    }

    if (employee.suffix_name) {
      fullName += ` ${employee.suffix_name}`;
    }

    return fullName;
  };

  const handleLoadCountOverallTotalResponses = async (
    employeeId: number,
    semesterId: number
  ) => {
    axiosInstance
      .get(
        `/response/count/overall/total/responses/${employeeId}/${semesterId}`
      )
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            totalPoor: res.data.overallTotalResponses.poor,
            totalUnsatisfactory: res.data.overallTotalResponses.unsatisfactory,
            totalSatisfactory: res.data.overallTotalResponses.satisfactory,
            totalVerySatisfactory:
              res.data.overallTotalResponses.very_satisfactory,
            totalOutstanding: res.data.overallTotalResponses.outstanding,
            loadingResult: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleLoadQuestionsWithCountOfResponses = async (
    employeeId: number,
    semesterId: number,
    categoryId: number
  ) => {
    setState((prevState) => ({
      ...prevState,
      loadingQuestions: true,
    }));

    axiosInstance
      .get(
        `/response/load/questions/with/count/of/responses/${employeeId}/${semesterId}/${categoryId}`
      )
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            questions: {
              ...prevState.questions,
              [categoryId]: res.data.questionsAndResponses,
            },
            loadingQuestions: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const handleOpenResultModal = (employee: Employees) => {
    setState((prevState) => ({
      ...prevState,
      loadingResult: true,
    }));

    handleLoadCountOverallTotalResponses(
      employee.employee_id,
      parseInt(state.semester)
    );

    const handleLoadCategories = async () => {
      setState((prevState) => ({
        ...prevState,
        loadingCategories: true,
      }));

      axiosInstance
        .get("/response/load/categories")
        .then((res) => {
          if (res.status === 200) {
            res.data.categories.map((category: Categories) => {
              handleLoadQuestionsWithCountOfResponses(
                employee.employee_id,
                parseInt(state.semester),
                category.category_id
              );
            });
            setState((prevState) => ({
              ...prevState,
              categories: res.data.categories,
              loadingCategories: false,
            }));
          } else {
            console.error("Unexpected status error: ", res.status);
          }
        })
        .catch((error) => {
          errorHandler(error);
        });
    };

    handleLoadCategories();

    setState((prevState) => ({
      ...prevState,
      showResultModal: true,
    }));
  };

  const handleCloseResultModal = () => {
    setState((prevState) => ({
      ...prevState,
      questions: {} as { [key: number]: Questions[] },
      showResultModal: false,
    }));
  };

  useEffect(() => {
    document.title = "RESULTS | FCU HR EMS";
    handleLoadAcademicYears();
  }, []);

  const content = (
    <>
      <Row className="mt-2">
        <Col sm={3}>
          <div className="mb-3">
            <FormLabel htmlFor="academic_year">ACADEMIC YEAR</FormLabel>
            <FormSelect
              name="academic_year"
              id="academic_year"
              value={state.academic_year}
              onChange={handleInput}
            >
              <option value="">N/A</option>
              {state.academicYears.map((academicYear) => (
                <option
                  value={academicYear.academic_year_id}
                  key={academicYear.academic_year_id}
                >
                  {academicYear.academic_year}
                </option>
              ))}
            </FormSelect>
          </div>
        </Col>
        <Col sm={3}>
          <div className="mb-3">
            <FormLabel htmlFor="semester">SEMESTER</FormLabel>
            <FormSelect
              name="semester"
              id="semester"
              value={state.semester}
              onChange={handleInput}
            >
              <option value="">N/A</option>
              {state.loadingSemesters ? (
                <option value="">LOADING...</option>
              ) : (
                state.semesters.map((semester) => (
                  <option
                    value={semester.semester_id}
                    key={semester.semester_id}
                  >
                    {semester.semester}
                  </option>
                ))
              )}
            </FormSelect>
          </div>
        </Col>
      </Row>
      <Table hover size="sm" responsive="sm">
        <thead>
          <tr>
            <th>NO.</th>
            <th>NAME OF EMPLOYEE</th>
            <th>DEPARTMENT</th>
            <th>POSITION</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {state.loadingEmployees ? (
            <tr>
              <td colSpan={5} className="text-center">
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  className="spinner-theme"
                />
              </td>
            </tr>
          ) : (
            state.employees.map((employee, index) => (
              <tr key={employee.employee_id} className="align-middle">
                <td>{index + 1}</td>
                <td>{handleEmployeeFullName(employee)}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>
                  <Button
                    className="btn-theme"
                    size="sm"
                    onClick={() => handleOpenResultModal(employee)}
                  >
                    VIEW RESULT
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal
        fullscreen={true}
        show={state.showResultModal}
        onHide={handleCloseResultModal}
      >
        <ModalHeader>EVALUATION RESULT</ModalHeader>
        <ModalBody>
          {state.loadingResult ||
          state.loadingCategories ||
          state.loadingQuestions ? (
            <>
              <div className="d-flex justify-content-center align-items center">
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  className="spinner-theme"
                />
              </div>
            </>
          ) : (
            <>
              <Row>
                <Col>
                  <div className="mb-3">
                    POOR
                    <br />
                    <p className="fs-3">{state.totalPoor}</p>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    UNSATISFACTORY
                    <br />
                    <p className="fs-3">{state.totalUnsatisfactory}</p>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    SATISFACTORY
                    <br />
                    <p className="fs-3">{state.totalSatisfactory}</p>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    VERY SATISFACTORY
                    <br />
                    <p className="fs-3">{state.totalVerySatisfactory}</p>
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    OUTSTANDING
                    <br />
                    <p className="fs-3">{state.totalOutstanding}</p>
                  </div>
                </Col>
              </Row>
              {state.categories.map((category) => (
                <Row key={category.category_id}>
                  <Table hover size="sm" responsive="sm">
                    <caption>{category.category}</caption>
                    <thead>
                      <tr>
                        <th>NO.</th>
                        <th>QUESTION</th>
                        <th>POOR</th>
                        <th>UNSATISFACTORY</th>
                        <th>SATISFACTORY</th>
                        <th>VERY SATISFACTORY</th>
                        <th>OUTSTANDING</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.questions[category.category_id] ? (
                        state.questions[category.category_id].map(
                          (question, index) => (
                            <tr key={question.question_id}>
                              <td>{index + 1}</td>
                              <td>{question.question}</td>
                              <td>{question.totalPoor}</td>
                              <td>{question.totalUnsatisfactory}</td>
                              <td>{question.totalSatisfactory}</td>
                              <td>{question.totalVerySatisfactory}</td>
                              <td>{question.totalOutstanding}</td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr className="align-middle">
                          <td colSpan={7} className="text-center">
                            <Spinner
                              as="span"
                              animation="border"
                              role="status"
                              className="spinner-theme"
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Row>
              ))}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button className="btn-theme" onClick={handleCloseResultModal}>
            CLOSE
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  return (
    <Layout
      content={
        state.loadingAcademicYears ? (
          <>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "80vh" }}
            >
              <Spinner
                as="span"
                animation="border"
                role="status"
                className="spinner-theme"
              />
            </div>
          </>
        ) : (
          content
        )
      }
    />
  );
};

export default Results;
