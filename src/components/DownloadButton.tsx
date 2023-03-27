import type { Extension, TuscOptions } from '@superchupu/tusc';
import type { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';

import { AppStatus } from './App';

declare const tusc: {
  run: (options: TuscOptions) => Promise<void>;
  update: () => Promise<void>;
};

declare const userProfile: string;

type DownloadButtonProps = {
  children: ReactNode;
  input: RefObject<HTMLInputElement>;
  extension: Extension;
  resolution: 'best' | number;
  setData: Dispatch<SetStateAction<string[]>>;
  setDownloadedUrl: Dispatch<SetStateAction<string>>;
  setProgressBar: Dispatch<SetStateAction<string>>;
  setStatus: Dispatch<SetStateAction<AppStatus>>;
  status: AppStatus;
};

export const DownloadButton = (props: DownloadButtonProps) => (
  <button disabled={props.status === 'downloading'} onClick={() => onDownloadClick(props)}>
    {props.children}
  </button>
);

async function onDownloadClick({
  input,
  extension,
  resolution,
  setData,
  setDownloadedUrl,
  setProgressBar,
  setStatus
}: DownloadButtonProps) {
  const url = input.current?.value.trim();
  if (!url) {
    return;
  }

  setStatus('downloading');
  await tusc
    .run({
      url,
      path: `${userProfile}/Downloads/videos`,
      resolution,
      extension,
      openExplorer: true
    })
    .then(() => {
      setStatus('done');
      setProgressBar('');
      setDownloadedUrl(url);
    })
    .catch(error => {
      setStatus('error');
      console.error(error);
    });

  setData([]);
}
