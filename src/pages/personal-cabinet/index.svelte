<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { PersonalCabinetScene } from './scenes/PersonalCabinet';

  let canvas: HTMLCanvasElement;
  let game: Phaser.Game;

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

    game = new Phaser.Game(config);
  });

  onDestroy(() => {
    game?.scene?.destroy();
    game?.destroy(true);
  });
</script>

<canvas bind:this={canvas} />
