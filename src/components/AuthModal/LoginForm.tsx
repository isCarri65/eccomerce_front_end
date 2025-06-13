import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../../services/authService";
import styles from "./AuthModal.module.css";
import { LoginValues, User } from "../../types/User/authTypes";

interface Props {
  onSwitch: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginForm = ({ onSwitch }: Props) => {
  const initialValues: LoginValues = { email: "", password: "" };
    
  const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().required("Requerido"),
  });

  const handleSubmit = async (values: LoginValues) => {
    try {
      await login(values.email, values.password);
      alert("Inicio de sesión exitoso");
    } catch (error) {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form className={styles.form}>
        <label>Email</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" component="div" className={styles.error} />

        <label>Contraseña</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" component="div" className={styles.error} />

        <button type="submit" className={styles.submit}>Ingresar</button>
        <button type="button" className={styles.switch} onClick={onSwitch}>
          ¿No tenés cuenta? Registrate
        </button>
      </Form>
    </Formik>
  );
};
