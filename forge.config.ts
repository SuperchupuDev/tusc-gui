import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { PublisherGithub } from '@electron-forge/publisher-github';
import type { ForgeConfig } from '@electron-forge/shared-types';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const ytDlp = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const config = {
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
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts'
            }
          }
        ]
      }
    })
  ]
} satisfies ForgeConfig;

export default config;
