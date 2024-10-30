import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { Link } from "react-router-dom";
import Layout from "../layout/Layout";
import Spinner from "../../components/Spinner";

interface Categories {
  category_id: number;
  category: string;
}

const Categories = () => {
  const [state, setState] = useState({
    loadingCategories: true,
    categories: [] as Categories[],
  });

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
        errorHandler(error);
      });
  };

  useEffect(() => {
    document.title = "LIST OF CATEGORIES | FCU HR EMS";
    handleLoadCategories();
  }, []);

  const content = (
    <>
      <div className="mx-auto mt-2">
        <div className="table-responsive">
          <table className="table table-sm table-hover">
            <caption>LIST OF CATEGORIES</caption>
            <thead>
              <tr>
                <th>NO.</th>
                <th>CATEGORY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {state.categories.map((category, index) => (
                <tr className="align-middle">
                  <td>{index + 1}</td>
                  <td>{category.category}</td>
                  <td>
                    <div className="btn-group">
                      <Link to={"#"} className="btn btn-theme">
                        EDIT
                      </Link>
                      <Link to={"#"} className="btn btn-theme">
                        DELETE
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return <Layout content={state.loadingCategories ? <Spinner /> : content} />;
};

export default Categories;
