import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import axios from "axios";
import Spinner from "../../components/Spinner";

interface Positions {
  position_id: number;
  position: string;
}

interface Departments {
  department_id: number;
  department: string;
}

interface Errors {
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  position?: string[];
  department?: string[];
}

const AddEmployee = () => {
  const [state, setState] = useState({
    loadingPositions: true,
    loadingDepartments: true,
    positions: [] as Positions[],
    departments: [] as Departments[],
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix_name: "",
    position: "",
    department: "",
    errors: {} as Errors,
  });

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLoadPositions = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/position/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            loadingPositions: false,
            positions: res.data.positions,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  const handleLoadDepartments = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/department/index")
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            loadingDepartments: false,
            departments: res.data.departments,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        console.error("Unexpected server error: ", error);
      });
  };

  useEffect(() => {
    document.title = "ADD EMPLOYEE | FCU HR EMS";

    handleLoadPositions();
    handleLoadDepartments();
  }, []);

  const content = (
    <>
      <form>
        <div className="card shadow mx-auto mt-3 p-3">
          <h5 className="card-title">ADD EMPLOYEE</h5>
          <div className="row">
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="first_name">FIRST NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  id="first_name"
                  value={state.first_name}
                  onChange={handleInput}
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="middle_name">MIDDLE NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="middle_name"
                  id="middle_name"
                  value={state.middle_name}
                  onChange={handleInput}
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="last_name">LAST NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  id="last_name"
                  value={state.last_name}
                  onChange={handleInput}
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="mb-3">
                <label htmlFor="suffix_name">SUFFIX NAME</label>
                <input
                  type="text"
                  className="form-control"
                  name="suffix_name"
                  id="suffix_name"
                  value={state.suffix_name}
                  onChange={handleInput}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="position">POSITION</label>
                <select
                  name="position"
                  id="position"
                  className="form-select"
                  value={state.position}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.positions.map((position) => (
                    <option
                      value={position.position_id}
                      key={position.position_id}
                    >
                      {position.position}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="department">DEPARTMENT</label>
                <select
                  name="department"
                  id="department"
                  className="form-select"
                  value={state.department}
                  onChange={handleInput}
                >
                  <option value="">N/A</option>
                  {state.departments.map((department) => (
                    <option
                      value={department.department_id}
                      key={department.department_id}
                    >
                      {department.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-theme">
              SAVE EMPLOYEE
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return state.loadingPositions && state.loadingDepartments ? (
    <Spinner />
  ) : (
    <Layout content={content} />
  );
};

export default AddEmployee;
