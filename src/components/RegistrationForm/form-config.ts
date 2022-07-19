import * as yup from 'yup';
import { AuthApiClient } from '../../core/api-client/auth/AuthApiClient';

export function initializeForm(onRegisterCallback) {
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .required('Обязательное поле')
      .max(50, 'Максимальная длина - 50 символов'),
    password: yup
      .string()
      .required('Обязательное поле')
      .min(6, 'Минимальная длина - 6 символов')
      .max(50, 'Максимальная длина - 50 символов'),
  });

  const validate = (values) => {
    try {
      validationSchema.validateSync(values, { abortEarly: false });
    } catch (error) {
      const errors = {};

      error.inner.forEach(({ path, errors: [firstError] }) => {
        errors[path] = firstError;
      });

      return errors;
    }

    return {};
  };

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const response = await AuthApiClient.register(username, password);
      const json = await response.json();

      if (response.status === 401) throw new Error('401');

      localStorage.token = `Bearer ${json.token}`;

      onRegisterCallback();
    } catch (error) {
      alert('Пользователь с таким именем уже существует');
    }
  };

  return { initialValues, validate, onSubmit };
}
