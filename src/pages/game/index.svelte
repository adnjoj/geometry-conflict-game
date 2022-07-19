<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { GameWsApiClient } from '../../core/api-client/game/GameWsApiClient';

  import { GameScene } from './scenes/Game';

  let canvas: HTMLCanvasElement;
  let game: Phaser.Game;

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      scale: {
        mode: Phaser.Scale.RESIZE,
      },
      backgroundColor: '#2d2d2d',
      scene: [GameScene],
      canvas,
    };

    game = new Phaser.Game(config);
  });

  onDestroy(() => {
    game?.scene.destroy();
    GameWsApiClient.closeSocket();
  });
</script>

<canvas bind:this={canvas} />
