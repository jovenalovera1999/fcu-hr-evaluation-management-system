import CurrentEvaluationTable from "../../components/tables/evaluation/CurrentEvaluationTable";
import Layout from "../layout/Layout";

const CurrentEvaluations = () => {
  const content = (
    <>
      <CurrentEvaluationTable />
    </>
  );

  return <Layout content={content} />;
};

export default CurrentEvaluations;
