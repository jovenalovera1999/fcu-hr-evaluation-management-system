import { useNavigate } from "react-router-dom";

const errorHandler = (
  error: any,
  navigate: ReturnType<typeof useNavigate> | null
) => {
  if (navigate) {
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
