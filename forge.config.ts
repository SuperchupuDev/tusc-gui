import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { PublisherGithub } from '@electron-forge/publisher-github';
import type { ForgeConfig } from '@electron-forge/shared-types';

const ytDlp = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
export default {
  packagerConfig: {
    extraResource: [`node_modules/@superchupu/tusc/dist/${ytDlp}`]
  },
  rebuildConfig: {},
  makers: [new MakerDeb({}), new MakerDMG({}), new MakerRpm({}), new MakerSquirrel({}), new MakerZIP({})],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'SuperchupuDev',
        name: 'tusc-gui'
      }
    })
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/index.ts',
          config: 'vite.main.config.ts'
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts'
        }
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts'
        }
      ]
    })
  ]
} satisfies ForgeConfig;
