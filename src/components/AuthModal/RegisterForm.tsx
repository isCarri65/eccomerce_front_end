import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./AuthModal.module.css";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  onSwitch: () => void;
}
interface RegisterValues {
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}
export const RegisterForm = ({ onSwitch }: Props) => {
  const initialValues: RegisterValues = {
    name: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
  };
  const { register } = useAuth();

  const validationSchema = Yup.object({
    name: Yup.string().required("Requerido"),
    lastName: Yup.string().required("Requerido"),
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().min(8, "Mínimo 8 caracteres").required("Requerido"),
    birthDate: Yup.date().required("Requerido"),
    aceptarTyC: Yup.boolean().oneOf(
      [true],
      "Debes aceptar los Términos y Condiciones"
    ),
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={styles.form}>
        <label>Nombre</label>
        <Field name="nombre" />
        <ErrorMessage name="nombre" component="div" className={styles.error} />

        <label>Apellido</label>
        <Field name="apellido" />
        <ErrorMessage
          name="apellido"
          component="div"
          className={styles.error}
        />

        <label>Email</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" component="div" className={styles.error} />

        <label>Contraseña</label>
        <Field name="password" type="password" />
        <ErrorMessage
          name="password"
          component="div"
          className={styles.error}
        />

        <label>Fecha de nacimiento</label>
        <Field name="fechaNacimiento" type="date" />
        <ErrorMessage
          name="fechaNacimiento"
          component="div"
          className={styles.error}
        />

        <label>
          <Field type="checkbox" name="aceptarTyC" />
          Acepto los Términos y Condiciones
        </label>
        <ErrorMessage
          name="aceptarTyC"
          component="div"
          className={styles.error}
        />

        <label>
          <Field type="checkbox" name="recibirNotificaciones" />
          Quiero recibir novedades
        </label>

        <button type="submit" className={styles.submit}>
          Registrarse
        </button>
        <button type="button" className={styles.switch} onClick={onSwitch}>
          ¿Ya tenés cuenta? Iniciá sesión
        </button>
      </Form>
    </Formik>
  );
};
