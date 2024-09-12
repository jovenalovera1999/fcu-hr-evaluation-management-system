interface LoginProps {
  baseUrl: string;
}

const Login = ({ baseUrl }: LoginProps) => {
  return (
    <>
      <form>
        <div className="card shadow col-12 col-sm-4">
          <div className="row background-theme">
            <h5 className="card-title mt-3">
              USER AUTHENTICATION | FCU HR EMS
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="username">USERNAME</label>
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">PASSWORD</label>
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-theme">
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
