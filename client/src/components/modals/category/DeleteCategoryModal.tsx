import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  Spinner,
} from "react-bootstrap";
import Categories from "../../../interfaces/Categories";
import { FormEvent, useEffect, useState } from "react";
import CategoryService from "../../../services/CategoryService";
import errorHandler from "../../../handler/errorHandler";

interface DeleteCategoryModalProps {
  showModal: boolean;
  category: Categories | null;
  onCategoryDeleted: (message: string) => void;
  onClose: () => void;
}

const DeleteCategoryModal = ({
  showModal,
  category,
  onCategoryDeleted,
  onClose,
}: DeleteCategoryModalProps) => {
  const [state, setState] = useState({
    loadingDestroy: false,
    category_id: 0,
    category: "",
  });

  const handleDestroyCategory = (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingDestroy: true,
    }));

    CategoryService.destroyCategory(state.category_id)
      .then((res) => {
        if (res.status === 200) {
          onCategoryDeleted(res.data.message);
          onClose();
        } else {
          console.error(
            "Unexpected status error while deleting category: ",
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
          loadingDestroy: false,
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
        <Modal.Header>DELETE CATEGORY</Modal.Header>
        <form onSubmit={handleDestroyCategory}>
          <Modal.Body>
            <FormLabel htmlFor="category">CATEGORY</FormLabel>
            <FormControl
              type="text"
              name="category"
              id="category"
              value={state.category}
              readOnly
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              disabled={state.loadingDestroy}
              onClick={onClose}
            >
              CLOSE
            </Button>
            <Button type="submit" disabled={state.loadingDestroy}>
              {state.loadingDestroy ? (
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
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default DeleteCategoryModal;
