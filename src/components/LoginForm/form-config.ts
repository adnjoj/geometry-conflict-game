import * as yup from 'yup';
import { AuthApiClient } from '../../core/api-client/auth/AuthApiClient';

export function initializeForm(onLoginCallback) {
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = yup.object({
    username: yup.string().required('Обязательное поле'),
    password: yup.string().required('Обязательное поле'),
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
      const response = await AuthApiClient.login(username, password);
      const json = await response.json();

      if (response.status === 401) throw new Error('401');

      localStorage.token = `Bearer ${json.token}`;

      onLoginCallback();
    } catch (error) {
      alert('Неправильное имя пользователя или пароль');
    }
  };

  return { initialValues, validate, onSubmit };
}
