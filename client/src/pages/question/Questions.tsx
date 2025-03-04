import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import ToastMessage from "../../components/ToastMessage";
import { useNavigate } from "react-router-dom";
import CategoryTable from "../../components/tables/category/CategoryTable";
import AddCategoryModal from "../../components/modals/category/AddCategoryModal";
import EditCategoryModal from "../../components/modals/category/EditCategoryModal";
import DeleteCategoryModal from "../../components/modals/category/DeleteCategoryModal";

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
    selected_category: "",
    selected_position: "",
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

    handleQuestionsPageChange(1);
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
        errorHandler(error, navigate, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingCategories: false,
        }));
      });
  };

  const handleLoadQuestions = async () => {
    setState((prevState) => ({
      ...prevState,
      loadingQuestions: true,
      questions: [] as Questions[],
    }));

    let apiRoute = `/question/loadQuestions?page=${state.questionsCurrentPage}`;

    if (state.selected_category && state.selected_position) {
      apiRoute = `/question/loadQuestions?page=${state.questionsCurrentPage}&categoryId=${state.selected_category}&positionId=${state.selected_position}`;
    } else if (state.selected_position) {
      apiRoute = `/question/loadQuestions?page=${state.questionsCurrentPage}&positionId=${state.selected_position}`;
    } else if (state.selected_category) {
      apiRoute = `/question/loadQuestions?page=${state.questionsCurrentPage}&categoryId=${state.selected_category}`;
    }

    axiosInstance
      .get(apiRoute)
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
        errorHandler(error, navigate, null);
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
        errorHandler(error, null, null);
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
          errorHandler(401, navigate, null);
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
          errorHandler(error, null, null);
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
          errorHandler(error, null, null);
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

  const [refreshCategories, setRefreshCategories] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(
    null
  );

  const handleOpenEditCategoryModal = (category: Categories) => {
    setSelectedCategory(category);
    setShowEditCategoryModal(true);
  };

  const handleOpenDeleteCategoryModal = (category: Categories) => {
    setSelectedCategory(category);
    setShowDeleteCategoryModal(true);
  };

  const handleCloseEditCategoryModal = () => {
    setSelectedCategory(null);
    setShowEditCategoryModal(false);
  };

  const handleCloseDeleteCategoryModal = () => {
    setSelectedCategory(null);
    setShowDeleteCategoryModal(false);
  };

  const [toastMessage, setToastMessage] = useState("");
  const [toastMessageIsSuccess, setToastMessageIsSuccess] = useState(false);
  const [toastMessageIsVisible, setToastMessageIsVisible] = useState(false);

  const handleShowToastMessage = (
    message: string,
    isSuccess: boolean,
    isVisible: boolean
  ) => {
    setToastMessage(message);
    setToastMessageIsSuccess(isSuccess);
    setToastMessageIsVisible(isVisible);
  };

  const handleCloseToastMessage = () => {
    setToastMessage("");
    setToastMessageIsSuccess(false);
    setToastMessageIsVisible(false);
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
      errorHandler(401, navigate, null);
    } else {
      handleLoadQuestions();
      handleLoadCategories();
      handleLoadPositions();
    }
  }, []);

  useEffect(() => {
    handleLoadQuestions();
  }, [
    state.selected_category,
    state.selected_position,
    state.questionsCurrentPage,
  ]);

  const content = (
    <>
      <ToastMessage
        success={state.toastSuccess}
        body={state.toastBody}
        showToast={state.showToast}
        onClose={handleCloseToast}
      />
      <ToastMessage
        body={toastMessage}
        success={toastMessageIsSuccess}
        showToast={toastMessageIsVisible}
        onClose={handleCloseToastMessage}
      />
      <div className="mx-auto mt-2">
        <div className="d-flex justify-content-between align-items-center">
          <h3>CATEGORIES</h3>
          <div className="mb-3">
            <Button type="button" onClick={() => setShowAddCategoryModal(true)}>
              ADD CATEGORY
            </Button>
          </div>
        </div>
        <AddCategoryModal
          showModal={showAddCategoryModal}
          onCategoryAdded={(message) => {
            setRefreshCategories((prev) => !prev);
            handleShowToastMessage(message, true, true);
          }}
          onClose={() => setShowAddCategoryModal(false)}
        />
        <EditCategoryModal
          showModal={showEditCategoryModal}
          category={selectedCategory}
          onCategoryUpdated={(message) => {
            setRefreshCategories((prev) => !prev);
            handleShowToastMessage(message, true, true);
          }}
          onClose={handleCloseEditCategoryModal}
        />
        <DeleteCategoryModal
          showModal={showDeleteCategoryModal}
          category={selectedCategory}
          onCategoryDeleted={(message) => {
            setRefreshCategories((prev) => !prev);
            handleShowToastMessage(message, true, true);
          }}
          onClose={handleCloseDeleteCategoryModal}
        />
        <CategoryTable
          refreshCategories={refreshCategories}
          onEditCategory={handleOpenEditCategoryModal}
          onDeleteCategory={handleOpenDeleteCategoryModal}
        />
        <div className="d-flex justify-content-between align-items-center">
          <div className="mb-3">
            <h3>QUESTIONS</h3>
          </div>
          <div className="mb-3">
            <Button type="button" onClick={handleOpenAddQuestionModal}>
              ADD QUESTION
            </Button>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <Row>
            <Col md={8}>
              <Form.Floating className="mb-3">
                <Form.Select
                  name="selected_category"
                  id="selected_category"
                  value={state.selected_category}
                  onChange={handleInput}
                >
                  <option value="">ALL CATEGORIES</option>
                  {state.loadingCategories ? (
                    <option value="">LOADING...</option>
                  ) : (
                    state.categories.map((category, index) => (
                      <option value={category.category_id} key={index}>
                        {category.category}
                      </option>
                    ))
                  )}
                </Form.Select>
                <label htmlFor="selected_category">CATEGORY</label>
              </Form.Floating>
            </Col>
            <Col md={8}>
              <Form.Floating className="mb-3">
                <Form.Select
                  name="selected_position"
                  id="selected_position"
                  value={state.selected_position}
                  onChange={handleInput}
                >
                  <option value="">ALL POSITIONS</option>
                  {state.loadingPositions ? (
                    <option value="">LOADING...</option>
                  ) : (
                    state.positions.map((position, index) => (
                      <option value={position.position_id} key={index}>
                        {position.position}
                      </option>
                    ))
                  )}
                </Form.Select>
                <label htmlFor="position">POSITION</label>
              </Form.Floating>
            </Col>
          </Row>
          <ButtonGroup>
            <Button
              type="button"
              disabled={state.questionsCurrentPage <= 1}
              onClick={() =>
                handleQuestionsPageChange(state.questionsCurrentPage - 1)
              }
            >
              PREVIOUS
            </Button>
            <Button
              type="button"
              disabled={state.questionsCurrentPage >= state.questionsLastPage}
              onClick={() =>
                handleQuestionsPageChange(state.questionsCurrentPage + 1)
              }
            >
              NEXT
            </Button>
          </ButtonGroup>
        </div>
        <Table hover responsive="sm">
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
            {state.loadingQuestions ? (
              <tr className="align-middle">
                <td colSpan={5} className="text-center">
                  <Spinner as="span" animation="border" role="status" />
                </td>
              </tr>
            ) : (
              state.questions.map((question, index) => (
                <tr key={index} className="align-middle">
                  <td>{(state.questionsCurrentPage - 1) * 10 + index + 1}</td>
                  <td>{question.category}</td>
                  <td>{question.question}</td>
                  <td>{question.position}</td>
                  <td>
                    <ButtonGroup>
                      <Button
                        type="button"
                        onClick={() => handleOpenEditQuestionModal(question)}
                      >
                        EDIT
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleOpenDeleteQuestionModal(question)}
                      >
                        DELETE
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            )}
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
          <Form.Floating className="mb-3">
            <Form.Select
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
            </Form.Select>
            <label htmlFor="category">CATEGORY</label>
            {state.errors.category && (
              <p className="text-danger">{state.errors.category[0]}</p>
            )}
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              as="textarea"
              className={`${state.errors.question ? "is-invalid" : ""}`}
              style={{ height: "100px" }}
              name="question"
              id="question"
              placeholder=""
              value={state.question}
              onChange={handleInput}
            />
            <label htmlFor="question">QUESTION</label>
            {state.errors.question && (
              <p className="text-danger">{state.errors.question[0]}</p>
            )}
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Select
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
            </Form.Select>
            <label htmlFor="position">QUESTION FOR</label>
            {state.errors.position && (
              <p className="text-danger">{state.errors.position[0]}</p>
            )}
          </Form.Floating>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            onClick={handleCloseAddQuestionModal}
            disabled={state.loadingQuestion}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
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
              <Form.Label htmlFor="category">CATEGORY</Form.Label>
              <Form.Select
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
              </Form.Select>
              {state.errors.category && (
                <p className="text-danger">{state.errors.category[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="question">QUESTION</Form.Label>
              <Form.Control
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
              type="button"
              onClick={handleCloseEditQuestionModal}
              disabled={state.loadingQuestion}
            >
              CLOSE
            </Button>
            <Button type="submit" disabled={state.loadingQuestion}>
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
              <Form.Label htmlFor="category">CATEGORY</Form.Label>
              <Form.Select
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
              </Form.Select>
              {state.errors.category && (
                <p className="text-danger">{state.errors.category[0]}</p>
              )}
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="question">QUESTION</Form.Label>
              <Form.Control
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
              type="button"
              onClick={handleCloseDeleteQuestionModal}
              disabled={state.loadingQuestion}
            >
              CLOSE
            </Button>
            <Button type="submit" disabled={state.loadingQuestion}>
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

  return <Layout content={content} />;
};

export default Questions;
