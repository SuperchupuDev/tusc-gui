import type { Extension } from '@superchupu/tusc';
import { StrictMode, useEffect, useState, useRef } from 'react';

import { DownloadButton } from './DownloadButton';
import { Select } from './Select';
import { Status } from './Status';

declare function on(channel: string, listener: (...args: any[]) => void): void;
declare function off(channel: string, listener: (...args: any[]) => void): void;

export type AppStatus = 'none' | 'done' | 'downloading' | 'error';

export const App = () => {
  const input = useRef<HTMLInputElement>(null);

  const [extension, setExtension] = useState<Extension>('mp4');
  const [resolution, setResolution] = useState<'best' | number>(1080);

  const [downloadedUrl, setDownloadedUrl] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>('none');

  const [data, setData] = useState<string[]>([]);
  const [errorData, setErrorData] = useState<string[]>([]);

  const [progressBar, setProgressBar] = useState<string>('');

  useEffect(() => {
    if (status === 'done' && input.current) {
      input.current.value = '';
    }
  }, [status]);

  useEffect(() => {
    const onTuscData = (newData: string) => {
      console.log(newData);
      if (newData.startsWith('\r[download]')) {
        const progress = newData.replace('[download] ', '').trim();
        return setProgressBar(progress);
      }

      if (newData.includes('[download]')) {
        const newDataArray = newData.split('[download]');
        return setData([...data, ...newDataArray]);
      }

      setData([...data, newData]);
    };

    const onTuscErrorData = (newData: string) => {
      console.error(newData);
      setErrorData([...errorData, newData]);
    };

    on('tuscData', onTuscData);
    on('tuscErrorData', onTuscErrorData);

    return () => {
      off('tuscData', onTuscData);
      off('tuscErrorData', onTuscErrorData);
    };
  }, [data]);

  return (
    <StrictMode>
      <h2>tusc</h2>
      <div className="container">
        <input ref={input} type="text" id="textbox" size={43} disabled={status === 'downloading'} />
        <Select
          defaultValue={extension}
          values={['mp4', 'mp3', '3gp', 'm4a', 'ogg', 'wav', 'webm']}
          onChange={value => setExtension(value)}
          disabled={status === 'downloading'}
        />
        <Select
          defaultValue={resolution}
          values={['best', 1080, 720, 480, 360, 240, 144]}
          displayValues={['Highest', '1080p', '720p', '480p', '360p', '240p', '144p']}
          onChange={value => setResolution(value)}
          disabled={status === 'downloading'}
        />
        <DownloadButton
          input={input}
          extension={extension}
          resolution={resolution}
          setData={setData}
          setDownloadedUrl={setDownloadedUrl}
          setProgressBar={setProgressBar}
          setStatus={setStatus}
          status={status}
        >
          Download
        </DownloadButton>
      </div>
      <Status data={data} errorData={errorData} progressBar={progressBar} status={status} url={downloadedUrl} />
    </StrictMode>
  );
};
