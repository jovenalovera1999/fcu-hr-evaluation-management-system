import { useEffect } from "react";
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

const Admin = () => {
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
      legend: { display: false },
      title: { display: false },
    },
  };

  const dataPieChart: ChartData<"pie", number[], string> = {
    labels: ["STUDENTS", "EMPLOYEES", "NO. OF RESPONDERS", "NO. OF RESPONDED"],
    datasets: [
      {
        data: [45, 100, 54, 79],
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
        data: [15, 20, 55, 51, 89],
        backgroundColor: "rgba(12, 30, 125, 0.2)",
        borderColor: "rgba(12, 30, 125, 1)",
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    document.title = "ADMIN DASHBOARD | FCU HR EMS";
  });

  const content = (
    <>
      <div className="row mb-2">
        <div className="col-sm-3">
          <label htmlFor="semester">SEMESTER</label>
          <select name="semester" id="semester" className="form-select">
            <option value="">N/A</option>
            <option value="">1ST</option>
            <option value="">2ND</option>
            <option value="">3RD</option>
            <option value="">4TH</option>
            <option value="">5TH</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-3 g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">TOTAL NO. OF STUDENTS</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-3 g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">TOTAL NO. OF EMPLOYEES</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-3 g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">TOTAL RESPONDERS</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-3 g-2">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">TOTAL RESPONDED</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED POOR</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED MEDIOCRE</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED SATISFACTORY</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED GOOD</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
          </div>
        </div>
        <div className="col-sm-2 g-2 mx-auto">
          <div
            className="card shadow bg-theme h-100 ps-2 pt-2 pe-2"
            style={{ minHeight: "100px" }}
          >
            <h5 className="card-title">NO. OF RESPONDED EXECELLENT</h5>
            <p className="position-absolute bottom-0 end-0 m-2 fs-5">0</p>
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

  return <Layout content={content} />;
};

export default Admin;
