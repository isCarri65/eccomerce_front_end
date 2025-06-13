import * as Yup from "yup";

export const loginSchema = Yup.object({
  correo: Yup.string().email().required("Requerido"),
  contraseña: Yup.string().required("Requerido"),
});

export const registerSchema = Yup.object({
  nombre: Yup.string().required("Requerido"),
  apellido: Yup.string().required("Requerido"),
  correo: Yup.string().email().required("Requerido"),
  contraseña: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  fechaNacimiento: Yup.string().required("Requerido"),
});
