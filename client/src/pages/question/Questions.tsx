import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import {
  Button,
  ButtonGroup,
  Col,
  FormControl,
  FormLabel,
  FormSelect,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "react-bootstrap";
import AlertToastMessage from "../../components/AlertToastMessage";
import { Form, useNavigate } from "react-router-dom";

interface Categories {
  category_id: number;
  category: string;
}

interface Positions {
  position_id: number;
  position: string;
}

interface Questions {
  question_id: number;
  category_id: number;
  category: string;
  question: string;
  position_id: number;
  position: string;
}

interface Errors {
  category?: string[];
  question?: string[];
  position?: string[];
}

const Questions = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingCategories: true,
    loadingQuestions: true,
    loadingPositions: false,
    loadingQuestion: false,
    categories: [] as Categories[],
    positions: [] as Positions[],
    questions: [] as Questions[],
    questionsCurrentPage: 1,
    questionsLastPage: 1,
    question_id: 0,
    question: "",
    category: "",
    position: "",
    errors: {} as Errors,
    showAddQuestionModal: false,
    showEditQuestionModal: false,
    showDeleteQuestionModal: false,
    toastSuccess: false,
    toastBody: "",
    showToast: false,
  });

  const handleResetQuestionFields = () => {
    setState((prevState) => ({
      ...prevState,
      question_id: 0,
      question: "",
      category: "",
      position: "",
      errors: {} as Errors,
    }));
  };

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuestionsPageChange = (page: number) => {
    setState((prevState) => ({
      ...prevState,
      questionsCurrentPage: page,
    }));
  };

  const handleLoadCategories = async () => {
    setState((prevState) => ({
      ...prevState,
      loadingCategories: true,
      categories: [] as Categories[],
    }));

    axiosInstance
      .get("/category/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            categories: res.data.categories,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingCategories: false,
        }));
      });
  };

  const handleLoadQuestions = async () => {
    axiosInstance
      .get(`/question/index?page=${state.questionsCurrentPage}`)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            questions: res.data.questions.data,
            questionsCurrentPage: res.data.questions.current_page,
            questionsLastPage: res.data.questions.last_page,
          }));
        } else {
          console.error("Unexpected status error: ", res.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingQuestions: false,
        }));
      });
  };

  const handleLoadPositions = async () => {
    setState((prevState) => ({
      ...prevState,
      loadingPositions: true,
      positions: [] as Positions[],
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

  const handleStoreQuestion = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingQuestion: true,
    }));

    axiosInstance
      .post("/question/store", state)
      .then((res) => {
        handleLoadQuestions();

        if (res.data.status === 200) {
          handleResetQuestionFields();

          setState((prevState) => ({
            ...prevState,
            loadingQuestion: false,
            showAddQuestionModal: false,
            toastSuccess: true,
            toastBody: "QUESTION SUCCESSFULLY SAVED.",
            showToast: true,
          }));

          handleLoadQuestions();
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
            loadingQuestion: false,
          }));
        } else {
          errorHandler(error, navigate);
        }
      });
  };

  const handleUpdateQuestion = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingQuestion: true,
    }));

    axiosInstance
      .put(`/question/updateQuestion/${state.question_id}`, state)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: res.data.message,
            showToast: true,
          }));

          handleLoadQuestions();
        } else {
          console.error("Unexpected error status: ", res.status);
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          errorHandler(error, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingQuestion: false,
        }));
      });
  };

  const handleDestroyQuestion = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingQuestion: true,
    }));

    axiosInstance
      .put(`/question/destroyQuestion/${state.question_id}`)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            toastSuccess: true,
            toastBody: res.data.message,
            showToast: true,
          }));

          handleLoadQuestions();
        } else {
          console.error("Unexpected error status: ", res.status);
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          errorHandler(error, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingQuestion: false,
        }));
      });
  };

  const handleOpenAddQuestionModal = () => {
    setState((prevState) => ({
      ...prevState,
      showAddQuestionModal: true,
    }));
  };

  const handleOpenEditQuestionModal = (question: Questions) => {
    handleResetQuestionFields();

    setState((prevState) => ({
      ...prevState,
      question_id: question.question_id,
      category: question.category_id.toString(),
      question: question.question,
      position: question.position_id.toString(),
      showEditQuestionModal: true,
    }));
  };

  const handleOpenDeleteQuestionModal = (question: Questions) => {
    handleResetQuestionFields();

    setState((prevState) => ({
      ...prevState,
      question_id: question.question_id,
      category: question.category_id.toString(),
      question: question.question,
      position: question.position_id.toString(),
      showDeleteQuestionModal: true,
    }));
  };

  const handleCloseAddQuestionModal = () => {
    setState((prevState) => ({
      ...prevState,
      showAddQuestionModal: false,
    }));
  };

  const handleCloseEditQuestionModal = () => {
    handleResetQuestionFields();

    setState((prevState) => ({
      ...prevState,
      showEditQuestionModal: false,
    }));
  };

  const handleCloseDeleteQuestionModal = () => {
    handleResetQuestionFields();

    setState((prevState) => ({
      ...prevState,
      showDeleteQuestionModal: false,
    }));
  };

  const handleCloseToast = () => {
    setState((prevState) => ({
      ...prevState,
      toastSuccess: false,
      toastBody: "",
      showToast: false,
    }));
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
      errorHandler(401, navigate);
    } else {
      handleLoadQuestions();
      handleLoadCategories();
      handleLoadPositions();
    }
  }, [state.questionsCurrentPage]);

  const content = (
    <>
      <AlertToastMessage
        success={state.toastSuccess}
        body={state.toastBody}
        showToast={state.showToast}
        onClose={handleCloseToast}
      />
      <div className="mx-auto mt-2">
        <div className="d-flex justify-content-end">
          <div className="mb-3">
            <Button className="btn-theme" onClick={handleOpenAddQuestionModal}>
              ADD QUESTION
            </Button>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <Col md={3}>
            <div className="mb-3">
              <FormLabel htmlFor="category">CATEGORY</FormLabel>
              <FormSelect name="category" id="category">
                <option value="">N/A</option>
                {state.loadingCategories ? (
                  <option value="">LOADING...</option>
                ) : (
                  state.categories.map((category, index) => (
                    <option value={category.category_id} key={index}>
                      {category.category}
                    </option>
                  ))
                )}
              </FormSelect>
            </div>
          </Col>
          <Col md={3}>
            <div className="mb-3">
              <FormLabel htmlFor="position">POSITION</FormLabel>
              <FormSelect name="position" id="position">
                <option value="">N/A</option>
                {state.loadingPositions ? (
                  <option value="">LOADING...</option>
                ) : (
                  state.positions.map((position, index) => (
                    <option value={position.position_id} key={index}>
                      {position.position}
                    </option>
                  ))
                )}
              </FormSelect>
            </div>
          </Col>
          <ButtonGroup>
            <Button
              className="btn-theme"
              disabled={state.questionsCurrentPage <= 1}
              onClick={() =>
                handleQuestionsPageChange(state.questionsCurrentPage - 1)
              }
            >
              PREVIOUS
            </Button>
            <Button
              className="btn-theme"
              disabled={state.questionsCurrentPage >= state.questionsLastPage}
              onClick={() =>
                handleQuestionsPageChange(state.questionsCurrentPage + 1)
              }
            >
              NEXT
            </Button>
          </ButtonGroup>
        </div>
        <Table striped hover size="sm" responsive="sm">
          <caption>LIST OF QUESTIONS</caption>
          <thead>
            <tr className="align-middle">
              <th>NO.</th>
              <th>CATEGORY</th>
              <th>QUESTION</th>
              <th>QUESTION FOR</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {state.questions.map((question, index) => (
              <tr key={index} className="align-middle">
                <td>{(state.questionsCurrentPage - 1) * 10 + index + 1}</td>
                <td>{question.category}</td>
                <td>{question.question}</td>
                <td>{question.position}</td>
                <td>
                  <ButtonGroup>
                    <Button
                      className="btn-theme"
                      onClick={() => handleOpenEditQuestionModal(question)}
                    >
                      EDIT
                    </Button>
                    <Button
                      className="btn-theme"
                      onClick={() => handleOpenDeleteQuestionModal(question)}
                    >
                      DELETE
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal
        show={state.showAddQuestionModal}
        onHide={handleCloseAddQuestionModal}
        backdrop="static"
      >
        <ModalHeader>ADD QUESTION</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <FormLabel htmlFor="category">CATEGORY</FormLabel>
            <FormSelect
              className={`${state.errors.category ? "is-invalid" : ""}`}
              name="category"
              id="category"
              value={state.category}
              onChange={handleInput}
              autoFocus
            >
              <option value="" key={1}>
                N/A
              </option>
              {state.categories.map((category) => (
                <option value={category.category_id} key={category.category_id}>
                  {category.category}
                </option>
              ))}
            </FormSelect>
            {state.errors.category && (
              <p className="text-danger">{state.errors.category[0]}</p>
            )}
          </div>
          <div className="mb-3">
            <FormLabel htmlFor="question">QUESTION</FormLabel>
            <FormControl
              as="textarea"
              className={`${state.errors.question ? "is-invalid" : ""}`}
              rows={4}
              name="question"
              id="question"
              value={state.question}
              onChange={handleInput}
            />
            {state.errors.question && (
              <p className="text-danger">{state.errors.question[0]}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="position">QUESTION FOR</label>
            <select
              className={`form-select ${
                state.errors.position ? "is-invalid" : ""
              }`}
              name="position"
              id="position"
              value={state.position}
              onChange={handleInput}
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
            {state.errors.position && (
              <p className="text-danger">{state.errors.position[0]}</p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-theme"
            onClick={handleCloseAddQuestionModal}
            disabled={state.loadingQuestion}
          >
            CLOSE
          </Button>
          <Button
            className="btn-theme"
            onClick={handleStoreQuestion}
            disabled={state.loadingQuestion}
          >
            {state.loadingQuestion ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme"
                />{" "}
                SAVING...
              </>
            ) : (
              "SAVE"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={state.showEditQuestionModal}
        onHide={handleCloseEditQuestionModal}
        backdrop="static"
      >
        <Form onSubmit={handleUpdateQuestion}>
          <ModalHeader>EDIT QUESTION</ModalHeader>
          <ModalBody>
            <div className="mb-3">
              <FormLabel htmlFor="category">CATEGORY</FormLabel>
              <FormSelect
                className={`${state.errors.category ? "is-invalid" : ""}`}
                name="category"
                id="category"
                value={state.category}
                onChange={handleInput}
                autoFocus
              >
                <option value="" key={1}>
                  N/A
                </option>
                {state.categories.map((category) => (
                  <option
                    value={category.category_id}
                    key={category.category_id}
                  >
                    {category.category}
                  </option>
                ))}
              </FormSelect>
              {state.errors.category && (
                <p className="text-danger">{state.errors.category[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <FormLabel htmlFor="question">QUESTION</FormLabel>
              <FormControl
                as="textarea"
                className={`${state.errors.question ? "is-invalid" : ""}`}
                rows={4}
                name="question"
                id="question"
                value={state.question}
                onChange={handleInput}
              />
              {state.errors.question && (
                <p className="text-danger">{state.errors.question[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="position">QUESTION FOR</label>
              <select
                className={`form-select ${
                  state.errors.position ? "is-invalid" : ""
                }`}
                name="position"
                id="position"
                value={state.position}
                onChange={handleInput}
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
              {state.errors.position && (
                <p className="text-danger">{state.errors.position[0]}</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-theme"
              onClick={handleCloseEditQuestionModal}
              disabled={state.loadingQuestion}
            >
              CLOSE
            </Button>
            <Button
              type="submit"
              className="btn-theme"
              disabled={state.loadingQuestion}
            >
              {state.loadingQuestion ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    size="sm"
                    className="spinner-theme"
                  />{" "}
                  UPDATING...
                </>
              ) : (
                "SAVE"
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      <Modal
        show={state.showDeleteQuestionModal}
        onHide={handleCloseDeleteQuestionModal}
        backdrop="static"
      >
        <Form onSubmit={handleDestroyQuestion}>
          <ModalHeader>DELETE QUESTION</ModalHeader>
          <ModalBody>
            <div className="mb-3">
              <FormLabel htmlFor="category">CATEGORY</FormLabel>
              <FormSelect
                className={`${state.errors.category ? "is-invalid" : ""}`}
                name="category"
                id="category"
                value={state.category}
                onChange={handleInput}
                autoFocus
              >
                <option value="" key={1}>
                  N/A
                </option>
                {state.categories.map((category) => (
                  <option
                    value={category.category_id}
                    key={category.category_id}
                  >
                    {category.category}
                  </option>
                ))}
              </FormSelect>
              {state.errors.category && (
                <p className="text-danger">{state.errors.category[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <FormLabel htmlFor="question">QUESTION</FormLabel>
              <FormControl
                as="textarea"
                className={`${state.errors.question ? "is-invalid" : ""}`}
                rows={4}
                name="question"
                id="question"
                value={state.question}
                onChange={handleInput}
              />
              {state.errors.question && (
                <p className="text-danger">{state.errors.question[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="position">QUESTION FOR</label>
              <select
                className={`form-select ${
                  state.errors.position ? "is-invalid" : ""
                }`}
                name="position"
                id="position"
                value={state.position}
                onChange={handleInput}
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
              {state.errors.position && (
                <p className="text-danger">{state.errors.position[0]}</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-theme"
              onClick={handleCloseDeleteQuestionModal}
              disabled={state.loadingQuestion}
            >
              CLOSE
            </Button>
            <Button
              type="submit"
              className="btn-theme"
              disabled={state.loadingQuestion}
            >
              {state.loadingQuestion ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    size="sm"
                    className="spinner-theme"
                  />{" "}
                  DELETING...
                </>
              ) : (
                "DELETE"
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );

  return (
    <Layout
      content={
        state.loadingCategories || state.loadingQuestions ? (
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

export default Questions;
