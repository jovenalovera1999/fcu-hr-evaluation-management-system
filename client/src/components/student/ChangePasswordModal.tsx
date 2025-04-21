import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import StudentService from "../../services/StudentService";
import { StudentChangePasswordErrorFields } from "../../interfaces/StudentChangePasswordErrorFields";

interface Students {
  student_id: number;
  student_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  department_id: string;
  department: string;
  course_id: string;
  course: string;
  section_id: string;
  section: string;
  year_level: string;
  is_irregular: boolean;
}

interface ChangePasswordModalProps {
  selectedStudent: Students | null;
  isVisible: boolean;
  onPasswordUpdated: (message: string) => void;
  onClose: () => void;
}

const ChangePasswordModal = ({
  selectedStudent,
  isVisible,
  onPasswordUpdated,
  onClose,
}: ChangePasswordModalProps) => {
  const [state, setState] = useState({
    loadingUpdate: false,
    student_id: 0,
    password: "",
    password_confirmation: "",
    errors: {} as StudentChangePasswordErrorFields,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingUpdate: true,
    }));

    try {
      const res = await StudentService.updatePassword(state.student_id, state);

      if (res.status === 200) {
        setState((prevState) => ({
          ...prevState,
          password: "",
          password_confirmation: "",
          errors: {} as StudentChangePasswordErrorFields,
        }));

        onPasswordUpdated(res.data.message);
      } else {
        console.error(
          "Unexpected status error occurred during update student password: ",
          res.status
        );
      }
    } catch (error: any) {
      if (error.response.status === 422) {
        setState((prevState) => ({
          ...prevState,
          errors: error.response.data.errors,
        }));
      } else {
        console.error(
          "Unexpected server error occurred during update student password: ",
          error
        );
      }
    } finally {
      setState((prevState) => ({
        ...prevState,
        loadingUpdate: false,
      }));
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      setState((prevState) => ({
        ...prevState,
        student_id: selectedStudent.student_id,
      }));
    }
  }, [selectedStudent]);

  return (
    <>
      <Modal show={isVisible} onHide={onClose} backdrop="static">
        <Form onSubmit={handleUpdatePassword}>
          <Modal.Header>CHANGE PASSWORD</Modal.Header>
          <Modal.Body>
            <Form.Floating className="mb-3">
              <Form.Control
                type="password"
                name="password"
                className={`${state.errors.password ? "is-invalid" : ""}`}
                id="password"
                placeholder="PASSWORD"
                value={state.password}
                onChange={handleInputChange}
                autoFocus
              />
              <label htmlFor="password">PASSWORD</label>
              {state.errors.password && (
                <p className="text-danger">{state.errors.password[0]}</p>
              )}
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="password"
                className={`${
                  state.errors.password_confirmation ? "is-invalid" : ""
                }`}
                name="password_confirmation"
                id="password_confirmation"
                placeholder="PASSWORD CONFIRMATION"
                value={state.password_confirmation}
                onChange={handleInputChange}
              />
              <label htmlFor="password_confirmation">
                PASSWORD CONFIRMATION
              </label>
              {state.errors.password_confirmation && (
                <p className="text-danger">
                  {state.errors.password_confirmation[0]}
                </p>
              )}
            </Form.Floating>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              onClick={onClose}
              disabled={state.loadingUpdate}
            >
              CLOSE
            </Button>
            <Button
              type="submit"
              onClick={handleUpdatePassword}
              disabled={state.loadingUpdate}
            >
              {state.loadingUpdate ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    size="sm"
                  />{" "}
                  UPDATING...
                </>
              ) : (
                "SAVE"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
