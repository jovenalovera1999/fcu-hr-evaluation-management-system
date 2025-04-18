import { useEffect, useState } from "react";
import { Button, ButtonGroup, Spinner, Table } from "react-bootstrap";
import Categories from "../../../pages/category/Categories";
import CategoryService from "../../../services/CategoryService";
import errorHandler from "../../../handler/errorHandler";

interface CategoryTableProps {
  refreshCategories: boolean;
  onEditCategory: (category: Categories) => void;
  onDeleteCategory: (category: Categories) => void;
}

const CategoryTable = ({
  refreshCategories,
  onEditCategory,
  onDeleteCategory,
}: CategoryTableProps) => {
  const [state, setState] = useState({
    loadingCategories: true,
    categories: [] as Categories[],
  });

  const handleLoadCategories = async () => {
    CategoryService.loadCategories()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            categories: res.data.categories,
          }));
        } else {
          console.error(
            "Unexpected status error while loading categories: ",
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
          loadingCategories: false,
        }));
      });
  };

  useEffect(() => {
    handleLoadCategories();
  }, [refreshCategories]);

  return (
    <>
      <Table hover responsive>
        <thead>
          <tr className="align-middle">
            <th>NO.</th>
            <th>CATEGORY</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {state.loadingCategories ? (
            <tr className="align-middle">
              <td colSpan={3} className="text-center">
                <Spinner as="span" animation="border" role="status" />
              </td>
            </tr>
          ) : (
            state.categories.map((category, index) => (
              <tr className="align-middle table-row" key={category.category_id}>
                <td>{index + 1}</td>
                <td>{category.category}</td>
                <td>
                  <ButtonGroup className="table-button-group">
                    <Button
                      type="button"
                      style={{
                        backgroundColor: "yellow",
                        borderColor: "yellow",
                        color: "black",
                      }}
                      onClick={() => onEditCategory(category)}
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
                      onClick={() => onDeleteCategory(category)}
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
    </>
  );
};

export default CategoryTable;
