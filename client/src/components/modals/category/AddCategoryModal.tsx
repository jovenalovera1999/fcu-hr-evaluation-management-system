import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  Spinner,
} from "react-bootstrap";
import CategoryFieldErrors from "../../../interfaces/CategoryFieldErrors";
import CategoryService from "../../../services/CategoryService";
import errorHandler from "../../../handler/errorHandler";

interface AddCategoryModalProps {
  showModal: boolean;
  onCategoryAdded: (message: string) => void;
  onClose: () => void;
}

const AddCategoryModal = ({
  showModal,
  onCategoryAdded,
  onClose,
}: AddCategoryModalProps) => {
  const [state, setState] = useState({
    loadingStore: false,
    category: "",
    errors: {} as CategoryFieldErrors,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStoreCategory = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingStore: true,
    }));

    CategoryService.storeCategory(state)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            category: "",
          }));

          onCategoryAdded(res.data.message);
        } else {
          console.error(
            "Unexpected status error while storing category: ",
            res.status
          );
        }
      })
      .catch((error) => {
        errorHandler(error, null, (errors) =>
          setState((prevState) => ({
            ...prevState,
            errors: errors as CategoryFieldErrors,
          }))
        );
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingStore: false,
        }));
      });
  };

  useEffect(() => {}, []);

  return (
    <>
      <Modal show={showModal} onHide={onClose} backdrop="static">
        <Modal.Header>ADD CATEGORY</Modal.Header>
        <form onSubmit={handleStoreCategory}>
          <Modal.Body>
            <FormLabel htmlFor="category">CATEGORY</FormLabel>
            <FormControl
              type="text"
              className={`${state.errors.category ? "is-invalid" : ""}`}
              name="category"
              id="category"
              value={state.category}
              onChange={handleInputChange}
              autoFocus
            />
            {state.errors.category && (
              <p className="text-danger">{state.errors.category[0]}</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              disabled={state.loadingStore}
              onClick={onClose}
            >
              CLOSE
            </Button>
            <Button type="submit" disabled={state.loadingStore}>
              {state.loadingStore ? (
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
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default AddCategoryModal;
