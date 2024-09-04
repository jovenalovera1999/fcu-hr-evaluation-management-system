import Layout from "../layout/Layout";

const AddEmployee = () => {
  const content = (
    <>
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return <Layout content={content} />;
};

export default AddEmployee;
