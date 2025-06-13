import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register } from "../../services/authService";
import styles from "./AuthModal.module.css";
import { RegisterValues, User } from "../../types/User/authTypes";

interface Props {
  onSwitch: () => void;
  onRegisterSuccess: (user: User) => void;
}


export const RegisterForm = ({ onSwitch }: Props) => {
  const initialValues: RegisterValues = {
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    fechaNacimiento: "",
    aceptarTyC: false,
    recibirNotificaciones: false,
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Requerido"),
    apellido: Yup.string().required("Requerido"),
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
    fechaNacimiento: Yup.date().required("Requerido"),
    aceptarTyC: Yup.boolean().oneOf([true], "Debes aceptar los Términos y Condiciones"),
  });

  const handleSubmit = async (values: RegisterValues) => {
    try {
      await register(values);
      alert("Registro exitoso");
    } catch (error) {
      alert("Error al registrarse");
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form className={styles.form}>
        <label>Nombre</label>
        <Field name="nombre" />
        <ErrorMessage name="nombre" component="div" className={styles.error} />

        <label>Apellido</label>
        <Field name="apellido" />
        <ErrorMessage name="apellido" component="div" className={styles.error} />

        <label>Email</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" component="div" className={styles.error} />

        <label>Contraseña</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" component="div" className={styles.error} />

        <label>Fecha de nacimiento</label>
        <Field name="fechaNacimiento" type="date" />
        <ErrorMessage name="fechaNacimiento" component="div" className={styles.error} />

        <label>
          <Field type="checkbox" name="aceptarTyC" />
          Acepto los Términos y Condiciones
        </label>
        <ErrorMessage name="aceptarTyC" component="div" className={styles.error} />

        <label>
          <Field type="checkbox" name="recibirNotificaciones" />
          Quiero recibir novedades
        </label>

        <button type="submit" className={styles.submit}>Registrarse</button>
        <button type="button" className={styles.switch} onClick={onSwitch}>
          ¿Ya tenés cuenta? Iniciá sesión
        </button>
      </Form>
    </Formik>
  );
};
