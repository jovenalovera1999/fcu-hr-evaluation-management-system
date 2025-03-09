import { useEffect, useState } from "react";
import { Toast, ToastBody, ToastContainer } from "react-bootstrap";

interface ToastMessageProps {
  success: boolean;
  body: string;
  showToast: boolean;
  onClose: () => void;
}

const ToastMessage = ({
  success,
  body,
  showToast,
  onClose,
}: ToastMessageProps) => {
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
        <ToastContainer position="bottom-end" className="p-3 position-fixed">
          {success ? (
            <Toast
              show={show}
              bg="success"
              onClose={handleClose}
              delay={3000}
              autohide
            >
              <ToastBody className="text-white">{body}</ToastBody>
            </Toast>
          ) : (
            <Toast
              show={show}
              bg="danger"
              onClose={handleClose}
              delay={3000}
              autohide
            >
              <ToastBody className="text-white">{body}</ToastBody>
            </Toast>
          )}
        </ToastContainer>
      </div>
    </>
  );
};

export default ToastMessage;
