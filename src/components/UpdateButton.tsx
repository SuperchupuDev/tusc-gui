import { TuscOptions } from '@superchupu/tusc';
import { useState } from 'react';

declare const tusc: {
  run: (options: TuscOptions) => Promise<void>;
  update: () => Promise<void>;
};

type UpdateStatus = 'none' | 'downloading' | 'done' | 'fail';

export const UpdateButton = () => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('none');
  return (
    <>
      <br />
      <button
        disabled={updateStatus !== 'none'}
        onClick={async () => {
          setUpdateStatus('downloading');
          await tusc
            .update()
            .then(() => setUpdateStatus('done'))
            .catch(() => setUpdateStatus('fail'));
        }}
      >
        {updateText[updateStatus]}
      </button>
    </>
  );
};

const updateText: Record<UpdateStatus, string> = {
  done: 'Update complete! Please try to download again.',
  downloading: 'Updating yt-dlp... Please wait...',
  fail: 'Update failed sorry :(',
  none: 'Update yt-dlp (recommended fix)'
};
