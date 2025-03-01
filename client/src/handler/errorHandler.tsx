import { useNavigate } from "react-router-dom";
import CategoryFieldErrors from "../interfaces/CategoryFieldErrors";

interface State {
  errors: CategoryFieldErrors;
}

const errorHandler = (
  error: any,
  navigate: ReturnType<typeof useNavigate> | null,
  setState: React.Dispatch<React.SetStateAction<State>> | null
) => {
  if (error.response && error.response.status === 422 && setState) {
    setState((prevState: State) => ({
      ...prevState,
      errors: error.response.data.errors,
    }));
  } else if (navigate) {
    if ((error.response && error.response.status === 401) || error === 401) {
      navigate("/", {
        state: {
          toastMessage:
            "UNAUTHORIZED! KINDLY LOGGED IN YOUR AUTHORIZED ACCOUNT!",
          toastMessageSuccess: false,
          toastMessageVisible: true,
        },
      });
    }
  } else {
    console.error("Unexpected server error: ", error);
  }
};

export default errorHandler;
