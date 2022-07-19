<script lang="ts">
  import { isLoading } from 'svelte-i18n';
  import { Router, Route, navigate } from 'svelte-routing';

  import { ApiClient } from './core/api-client/ApiClient';

  import GamePage from './pages/game/index.svelte';
  import LoginPage from './pages/login/index.svelte';
  import RegistrationPage from './pages/registration/index.svelte';
  import PersonalCabinetPage from './pages/personal-cabinet/index.svelte';

  ApiClient.unauthorizedListener = () => {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login');
    }
  };
</script>

{#if $isLoading}
  Please wait...
{:else}
  <Router url="">
    <Route path="/game" component={GamePage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/register" component={RegistrationPage} />
    <Route path="/" component={PersonalCabinetPage} />
  </Router>
{/if}
