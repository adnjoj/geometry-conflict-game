<script lang="ts">
  import { onMount } from 'svelte';

  import { PersonalCabinetScene } from './scenes/PersonalCabinet';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      scale: {
        mode: Phaser.Scale.RESIZE,
      },
      backgroundColor: '#2d2d2d',
      scene: [PersonalCabinetScene],
      canvas,
    };

    new Phaser.Game(config);
  });
</script>

<canvas bind:this={canvas} />
