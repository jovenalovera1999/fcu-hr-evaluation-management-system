import { useEffect, useState } from "react";
import { Toast, ToastBody, ToastContainer } from "react-bootstrap";

interface AlertToastMessageProps {
  success: boolean;
  body: string;
  showToast: boolean;
  onClose: () => void;
}

const AlertToastMessage = ({
  success,
  body,
  showToast,
  onClose,
}: AlertToastMessageProps) => {
  const [show, setShow] = useState(showToast);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  useEffect(() => {
    setShow(showToast);
  }, [showToast]);

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="position-relative">
        <ToastContainer
          position="top-end"
          className="p-3 position-fixed"
          style={{ top: 20, right: 20, zIndex: 1050 }}
        >
          <Toast
            show={show}
            onClose={handleClose}
            delay={3000}
            bg={success ? "success" : "danger"}
            autohide
          >
            <ToastBody className="text-white">{body}</ToastBody>
          </Toast>
        </ToastContainer>
      </div>
    </>
  );
};

export default AlertToastMessage;
