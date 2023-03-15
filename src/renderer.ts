declare const tusc: {
  run: (options: import('@superchupu/tusc').TuscOptions) => Promise<void>
  update: () => Promise<void>
};

declare const userProfile: string;
declare const openExternal: (url: string) => Promise<void>;

// rome-ignore lint/style/noNonNullAssertion: useless here
const downloadButton = document.getElementById('download')! as HTMLButtonElement;
downloadButton.addEventListener('click', async () => {
  // rome-ignore lint/style/noNonNullAssertion: useless here
  const textbox = document.getElementById('textbox')! as HTMLInputElement;
  // rome-ignore lint/style/noNonNullAssertion: useless here
  const status = document.getElementById('status')! as HTMLParagraphElement;

  if (!textbox.value.trim()) {
    return;
  }

  status.innerText = 'Downloading... Please wait...';

  downloadButton.disabled = true;
  await tusc.run({
    url: textbox.value.trim(),
    path: `${userProfile}/Downloads/videos`,
    openExplorer: true
  }).then(() => {
    status.innerText = 'Download complete! Video downloaded: ';
    const link = document.createElement('a');
    link.appendChild(document.createTextNode(textbox.value.trim()));
    link.href = textbox.value.trim();
    link.target = '_blank';
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      await openExternal(link.href);
    });
    status.appendChild(link);
    textbox.value = '';
  }).catch((error) => {
    const code = document.createElement('code');
    code.appendChild(document.createTextNode(error.message));
    status.innerText = "Download failed! Make sure you got the URL right.";
    status.children[0]?.remove();
    status.append(document.createElement('br'));
    status.append(code);
    console.error(error);
    if (error.message.includes('Confirm you are on the latest version')) {
      status.append(document.createElement('br'));
      const updateButton = document.createElement('button');
      updateButton.innerText = 'Update yt-dlp (recommended fix)';
      status.appendChild(updateButton);
      updateButton.addEventListener('click', async () => {
        downloadButton.disabled = true;
        updateButton.disabled = true;
        updateButton.innerText = 'Updating yt-dlp... Please wait...';
        await tusc.update().then(() => {
        updateButton.innerText = 'Update complete! Please try to download again.';
        }).catch((error) => {
          // yt-dlp can succesfully be updated but still fail to remove the old version
          updateButton.innerText = error.message.includes('Unable to remove the old version') ?
            'Update complete! Please try to download again.' :
            'Update failed sorry :(';
          console.error(error);
        }).finally(() => {
          downloadButton.disabled = false;
        });
      });
    }
  }).finally(() => {
    downloadButton.disabled = false
  });
});
