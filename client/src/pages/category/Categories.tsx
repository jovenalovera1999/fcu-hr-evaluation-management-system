import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import Layout from "../layout/Layout";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "react-bootstrap";
import ToastMessage from "../../components/ToastMessage";
import { useNavigate } from "react-router-dom";

interface Categories {
  category_id: number;
  category: string;
}

interface Errors {
  category?: string[];
}

const Categories = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    loadingCategories: true,
    loadingCategory: false,
    categories: [] as Categories[],
    category_id: 0,
    category: "",
    errors: {} as Errors,
    showAddCategoryModal: false,
    showEditCategoryModal: false,
    showDeleteCategoryModal: false,
    toastSuccess: false,
    toastBody: "",
    showToast: false,
  });

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLoadCategories = async () => {
    axiosInstance
      .get("/category/index")
      .then((res) => {
        if (res.data.status) {
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
        errorHandler(error, navigate, null);
      });
  };

  const handleStoreCategory = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingCategory: true,
    }));

    axiosInstance
      .post("/category/store", state)
      .then((res) => {
        if (res.data.status === 200) {
          handleLoadCategories();

          setState((prevState) => ({
            ...prevState,
            category_id: 0,
            category: "",
            errors: {} as Errors,
            toastSuccess: true,
            toastBody: "CATEGORY SUCCESSFULLY STORED.",
            showToast: true,
            loadingCategory: false,
            showAddCategoryModal: false,
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
            loadingCategory: false,
          }));
        } else {
          errorHandler(error, navigate, null);
        }
      });
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingCategory: true,
    }));

    axiosInstance
      .put(`/category/update/${state.category_id}`, state)
      .then((res) => {
        if (res.data.status === 200) {
          handleLoadCategories();

          setState((prevState) => ({
            ...prevState,
            category_id: 0,
            category: "",
            errors: {} as Errors,
            toastSuccess: true,
            toastBody: "CATEGORY SUCCESSFULLY UPDATED.",
            showToast: true,
            loadingCategory: false,
            showEditCategoryModal: false,
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
            loadingCategory: false,
          }));
        } else {
          errorHandler(error, navigate, null);
        }
      });
  };

  const handleDeleteCategory = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingCategory: true,
    }));

    axiosInstance
      .put(`/category/delete/${state.category_id}`)
      .then((res) => {
        if (res.data.status === 200) {
          handleLoadCategories();

          setState((prevState) => ({
            ...prevState,
            category_id: 0,
            category: "",
            errors: {} as Errors,
            toastSuccess: true,
            toastBody: "CATEGORY SUCCESSFULLY DELETED.",
            showToast: true,
            loadingCategory: false,
            showDeleteCategoryModal: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error, navigate, null);
      });
  };

  const handleOpenAddCategoryModal = () => {
    setState((prevState) => ({
      ...prevState,
      showAddCategoryModal: true,
    }));
  };

  const handleCloseAddCategoryModal = () => {
    setState((prevState) => ({
      ...prevState,
      category_id: 0,
      errors: {} as Errors,
      showAddCategoryModal: false,
    }));
  };

  const handleOpenEditCategoryModal = (category: Categories) => {
    setState((prevState) => ({
      ...prevState,
      category_id: category.category_id,
      category: category.category,
      showEditCategoryModal: true,
    }));
  };

  const handleOpenDeleteCategoryModal = (category: Categories) => {
    setState((prevState) => ({
      ...prevState,
      category_id: category.category_id,
      category: category.category,
      showDeleteCategoryModal: true,
    }));
  };

  const handleCloseEditAndDeleteCategoryModal = () => {
    setState((prevState) => ({
      ...prevState,
      category_id: 0,
      category: "",
      errors: {} as Errors,
      showEditCategoryModal: false,
      showDeleteCategoryModal: false,
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
    document.title = "LIST OF CATEGORIES | FCU HR EMS";
    handleLoadCategories();
  }, []);

  const content = (
    <>
      <ToastMessage
        success={state.toastSuccess}
        body={state.toastBody}
        showToast={state.showToast}
        onClose={handleCloseToast}
      />
      <div className="mx-auto mt-2">
        <div className="d-flex justify-content-between align-items-center">
          <h3>CATEGORIES</h3>
          <div className="mb-3">
            <Button type="button" onClick={handleOpenAddCategoryModal}>
              ADD CATEGORY
            </Button>
          </div>
        </div>
        <Table hover responsive>
          <thead>
            <tr className="align-middle">
              <th>NO.</th>
              <th>CATEGORY</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {state.categories.map((category, index) => (
              <tr className="align-middle" key={category.category_id}>
                <td>{index + 1}</td>
                <td>{category.category}</td>
                <td>
                  <div className="btn-group"></div>
                  <ButtonGroup>
                    <Button
                      type="button"
                      style={{
                        backgroundColor: "yellow",
                        borderColor: "yellow",
                        color: "black",
                      }}
                      onClick={() => handleOpenEditCategoryModal(category)}
                    >
                      EDIT
                    </Button>
                    <Button
                      type="button"
                      style={{
                        backgroundColor: "red",
                        borderColor: "red",
                        color: "white",
                      }}
                      onClick={() => handleOpenDeleteCategoryModal(category)}
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
        show={state.showAddCategoryModal}
        onHide={handleCloseAddCategoryModal}
        backdrop="static"
      >
        <ModalHeader>ADD CATEGORY</ModalHeader>
        <ModalBody>
          <FormLabel htmlFor="category">CATEGORY</FormLabel>
          <FormControl
            type="text"
            className={`${state.errors.category ? "is-invalid" : ""}`}
            name="category"
            id="category"
            value={state.category}
            onChange={handleInput}
            autoFocus
          />
          {state.errors.category && (
            <p className="text-danger">{state.errors.category[0]}</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            onClick={handleCloseAddCategoryModal}
            disabled={state.loadingCategory}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
            onClick={handleStoreCategory}
            disabled={state.loadingCategory}
          >
            {state.loadingCategory ? (
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
        show={state.showEditCategoryModal}
        onHide={handleCloseEditAndDeleteCategoryModal}
        backdrop="static"
      >
        <ModalHeader>EDIT CATEGORY</ModalHeader>
        <ModalBody>
          <FormLabel htmlFor="category">CATEGORY</FormLabel>
          <FormControl
            type="text"
            className={`${state.errors.category ? "is-invalid" : ""}`}
            name="category"
            id="category"
            value={state.category}
            onChange={handleInput}
            autoFocus
          />
          {state.errors.category && (
            <p className="text-danger">{state.errors.category[0]}</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            onClick={handleCloseEditAndDeleteCategoryModal}
            disabled={state.loadingCategory}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
            onClick={handleUpdateCategory}
            disabled={state.loadingCategory}
          >
            {state.loadingCategory ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  size="sm"
                  className="spinner-theme me-1"
                />{" "}
                UPDATING...
              </>
            ) : (
              "SAVE"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        show={state.showDeleteCategoryModal}
        onHide={handleCloseEditAndDeleteCategoryModal}
        backdrop="static"
      >
        <ModalHeader>DELETE CATEGORY</ModalHeader>
        <ModalBody>
          <FormLabel htmlFor="category">
            ARE YOU SURE YOU WANT TO DELETE THIS CATEGORY?
          </FormLabel>
          <FormControl
            type="text"
            className="form-control"
            name="category"
            id="category"
            value={state.category}
            readOnly
          />
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            onClick={handleCloseEditAndDeleteCategoryModal}
            disabled={state.loadingCategory}
          >
            CLOSE
          </Button>
          <Button
            type="submit"
            onClick={handleDeleteCategory}
            disabled={state.loadingCategory}
          >
            {state.loadingCategory ? (
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
              "YES"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );

  return (
    <Layout
      content={
        state.loadingCategories ? (
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
        ) : (
          content
        )
      }
    />
  );
};

export default Categories;
