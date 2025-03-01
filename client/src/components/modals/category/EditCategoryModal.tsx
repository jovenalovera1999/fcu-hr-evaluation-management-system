import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  Spinner,
} from "react-bootstrap";
import Categories from "../../../interfaces/Category";
import { FormEvent, useEffect, useState } from "react";
import CategoryFieldErrors from "../../../interfaces/CategoryFieldErrors";
import CategoryService from "../../../services/CategoryService";
import errorHandler from "../../../handler/errorHandler";

interface EditCategoryModalProps {
  showModal: boolean;
  category: Categories | null;
  onCategoryUpdated: (message: string) => void;
  onClose: () => void;
}

const EditCategoryModal = ({
  showModal,
  category,
  onCategoryUpdated,
  onClose,
}: EditCategoryModalProps) => {
  const [state, setState] = useState({
    loadingUpdate: false,
    category_id: 0,
    category: "",
    errors: {} as CategoryFieldErrors,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingUpdate: true,
    }));

    CategoryService.updateCategory(state.category_id, state)
      .then((res) => {
        if (res.status === 200) {
          onCategoryUpdated(res.data.message);
        } else {
          console.error(
            "Unexpected status error while updating category: ",
            res.status
          );
        }
      })
      .catch((error) => {
        errorHandler(error, null, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingUpdate: false,
        }));
      });
  };

  useEffect(() => {
    if (category) {
      setState((prevState) => ({
        ...prevState,
        category_id: category.category_id,
        category: category.category,
      }));
    }
  }, [category]);

  return (
    <>
      <Modal show={showModal} onHide={onClose} backdrop="static">
        <Modal.Header>EDIT CATEGORY</Modal.Header>
        <form onSubmit={handleUpdateCategory}>
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
              disabled={state.loadingUpdate}
              onClick={onClose}
            >
              CLOSE
            </Button>
            <Button type="submit" disabled={state.loadingUpdate}>
              {state.loadingUpdate ? (
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

export default EditCategoryModal;
