<script lang="ts">
  import { navigate } from 'svelte-routing';

  import LoginForm from '../../components/LoginForm/LoginForm.svelte';
</script>

<LoginForm on:login={() => navigate('/')} />
