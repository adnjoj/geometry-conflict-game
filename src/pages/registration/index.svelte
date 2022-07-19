<script lang="ts">
  import { navigate } from 'svelte-routing';

  import RegistrationForm from '../../components/RegistrationForm/RegistrationForm.svelte';
</script>

<RegistrationForm on:registration={() => navigate('/')} />
