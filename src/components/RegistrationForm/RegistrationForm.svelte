<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { Sveltik, Field, ErrorMessage } from 'sveltik';

  import { initializeForm } from './form-config';

  const dispatch = createEventDispatcher();

  const formProps = initializeForm(() => {
    dispatch('registration', {});
  });
</script>

<div class="registration-form__wrapper">
  <Sveltik {...formProps} let:props>
    <form
      class="registration-form"
      on:submit|preventDefault={props.handleSubmit}
    >
      <div class="registration-form__login-button-wrapper">
        <button
          class="registration-form__image-button"
          type="button"
          on:click={() => navigate('/login')}
        >
          <img
            class="registration-form__button"
            src="/images/login-page/login-button.png"
            alt="register button"
          />
        </button>
      </div>

      <div class="registration-form__row">
        <label for="username-input">ИМЯ ПОЛЬЗОВАТЕЛЯ:</label>
        <Field id="username-input" name="username" />
        <ErrorMessage
          name="username"
          as="div"
          class="registration-form__error-message"
        />
      </div>

      <div class="registration-form__row">
        <label for="password-input">ПАРОЛЬ:</label>
        <Field id="password-input" name="password" type="password" />
        <ErrorMessage
          name="password"
          as="div"
          class="registration-form__error-message"
        />
      </div>

      <div class="registration-form__buttons-group">
        <button type="submit" class="registration-form__image-button">
          <img
            class="registration-form__button"
            src="/images/login-page/register-button.png"
            alt="registration button"
          />
        </button>

        <button type="button" class="registration-form__image-button">
          <img
            style="float: right;"
            class="registration-form__button"
            src="/images/login-page/exit-button.png"
            alt="exit button"
          />
        </button>
      </div>
    </form>
  </Sveltik>
</div>

<style lang="scss">
  @import './RegistrationForm.scss';
</style>
