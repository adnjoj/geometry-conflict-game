<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { Sveltik, Field, ErrorMessage } from 'sveltik';

  import { initializeForm } from './form-config';

  const dispatch = createEventDispatcher();

  const formProps = initializeForm(() => {
    dispatch('login', {});
  });
</script>

<div class="login-form__wrapper">
  <Sveltik {...formProps} let:props>
    <form class="login-form" on:submit|preventDefault={props.handleSubmit}>
      <div class="login-form__register-button-wrapper">
        <button
          class="login-form__image-button"
          type="button"
          on:click={() => navigate('/register')}
        >
          <img
            class="login-form__button"
            src="/images/login-page/register-button.png"
            alt="register button"
          />
        </button>
      </div>

      <div class="login-form__row">
        <label for="username-input">ИМЯ ПОЛЬЗОВАТЕЛЯ:</label>
        <Field id="username-input" name="username" />
        <ErrorMessage
          name="username"
          as="div"
          class="login-form__error-message"
        />
      </div>

      <div class="login-form__row">
        <label for="password-input">ПАРОЛЬ:</label>
        <Field id="password-input" name="password" type="password" />
        <ErrorMessage
          name="password"
          as="div"
          class="login-form__error-message"
        />
      </div>

      <div class="login-form__buttons-group">
        <button type="submit" class="login-form__image-button">
          <img
            class="login-form__button"
            src="/images/login-page/login-button.png"
            alt="login button"
          />
        </button>

        <button type="button" class="login-form__image-button">
          <img
            style="float: right;"
            class="login-form__button"
            src="/images/login-page/exit-button.png"
            alt="exit button"
          />
        </button>
      </div>
    </form>
  </Sveltik>
</div>

<style lang="scss">
  @import './LoginForm.scss';
</style>
