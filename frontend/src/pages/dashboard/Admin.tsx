import { ChangeEvent, useEffect, useState } from "react";
import Layout from "../layout/Layout";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import Spinner from "../../components/Spinner";
import axiosInstance from "../../axios/axiosInstance";
import errorHandler from "../../handler/errorHandler";
import { Col, Row } from "react-bootstrap";

interface AcademicYears {
  academic_year_id: number;
  academic_year: string;
}

interface Semesters {
  semester_id: number;
  semester: string;
}

const Admin = () => {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const [state, setState] = useState({
    loadingAcademicYears: true,
    loadingSemesters: false,
    loadingStatistics: false,
    academicYears: [] as AcademicYears[],
    semesters: [] as Semesters[],
    academic_year: "",
    semester: "",
    totalEmployees: 0,
    totalStudents: 0,
    totalResponders: 0,
    totalResponded: 0,
    totalPoor: 0,
    totalMediocre: 0,
    totalSatisfactory: 0,
    totalGood: 0,
    totalExcellent: 0,
  });

  const handleInput = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        loadingStatistics: true,
      }));

      handleLoadStatistics(academicYearId, semesterId);
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
      .catch();
  };

  const handleLoadStatistics = async (
    academicYearId: number,
    semesterId: number
  ) => {
    axiosInstance
      .get(
        `/dashboard/admin/load/statistics/by/academic_year/and/semester/${academicYearId}/${semesterId}`
      )
      .then((res) => {
        if (res.data.status === 200) {
          setState((prevState) => ({
            ...prevState,
            totalEmployees: res.data.totalEmployees,
            totalStudents: res.data.totalStudents,
            totalResponders: res.data.totalResponders,
            totalResponded: res.data.totalResponded,
            totalPoor: res.data.totalPoor,
            totalMediocre: res.data.totalMediocre,
            totalSatisfactory: res.data.totalSatisfactory,
            totalGood: res.data.totalGood,
            totalExcellent: res.data.totalExcellent,
            loadingStatistics: false,
          }));
        } else {
          console.error("Unexpected status error: ", res.data.status);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const optionsPieChart: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
  };

  const dataPieChart: ChartData<"pie", number[], string> = {
    labels: ["STUDENTS", "EMPLOYEES", "NO. OF RESPONDERS", "NO. OF RESPONDED"],
    datasets: [
      {
        data: [
          state.totalStudents,
          state.totalEmployees,
          state.totalResponders,
          state.totalResponded,
        ],
        backgroundColor: [
          "rgba(255, 111, 97, 1)",
          "rgba(107, 91, 149, 1)",
          "rgba(136, 176, 75, 1)",
          "rgba(247, 202, 201, 1)",
        ],
        borderColor: [
          "rgba(255, 111, 97, 1)",
          "rgba(107, 91, 149, 1)",
          "rgba(136, 176, 75, 1)",
          "rgba(247, 202, 201, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsBarChart: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const dataBarChart: ChartData<"bar", number[], string> = {
    labels: ["POOR", "MEDIOCRE", "SATISFACTORY", "GOOD", "EXCELLENT"],
    datasets: [
      {
        data: [
          state.totalGood,
          state.totalMediocre,
          state.totalSatisfactory,
          state.totalGood,
          state.totalExcellent,
        ],
        backgroundColor: "rgba(12, 30, 125, 0.2)",
        borderColor: "rgba(12, 30, 125, 1)",
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    document.title = "ADMIN DASHBOARD | FCU HR EMS";

    if (
      !token ||
      !user ||
      !parsedUser ||
      parsedUser.position !== "ADMIN" ||
      !parsedUser.position
    ) {
      errorHandler(401);
    } else {
      handleLoadAcademicYears();
    }
  }, []);

  const statisticsComponents = (
    <>
      <Row>
        <Col className="g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">TOTAL NO. OF STUDENTS</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">
              {state.totalStudents}
            </p>
          </div>
        </Col>
        <Col className="g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">TOTAL NO. OF EMPLOYEES</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">
              {state.totalEmployees}
            </p>
          </div>
        </Col>
        <Col className="g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">TOTAL RESPONDERS</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">
              {state.totalResponders}
            </p>
          </div>
        </Col>
        <Col className="g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">TOTAL RESPONDED</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">
              {state.totalResponded}
            </p>
          </div>
        </Col>
      </Row>
      <Row></Row>
      <div className="row mb-3">
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED POOR</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">
              {state.totalPoor}
            </p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED MEDIOCRE</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">
              {state.totalMediocre}
            </p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED SATISFACTORY</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">
              {state.totalSatisfactory}
            </p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED GOOD</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">
              {state.totalGood}
            </p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED EXECELLENT</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">
              {state.totalExcellent}
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4 g-2">
          <Pie options={optionsPieChart} data={dataPieChart} />
        </div>
        <div className="col-sm-8 g-2">
          <Bar options={optionsBarChart} data={dataBarChart} />
        </div>
      </div>
    </>
  );

  const content = (
    <>
      <div className="row mb-2">
        <div className="col-sm-3">
          <label htmlFor="academic_year">ACADEMIC YEAR</label>
          <select
            name="academic_year"
            id="academic_year"
            className="form-select"
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
          </select>
        </div>
        <div className="col-sm-3">
          <label htmlFor="semester">SEMESTER</label>
          <select
            name="semester"
            id="semester"
            className="form-select"
            value={state.semester}
            onChange={handleInput}
          >
            <option value="">N/A</option>
            {state.loadingSemesters ? (
              <option value="">Loading...</option>
            ) : (
              state.semesters.map((semester) => (
                <option value={semester.semester_id}>
                  {semester.semester}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      {state.loadingStatistics ? <Spinner /> : statisticsComponents}
    </>
  );

  return (
    <Layout content={state.loadingAcademicYears ? <Spinner /> : content} />
  );
};

export default Admin;
