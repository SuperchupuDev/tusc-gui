declare const tusc: {
  run: (url: string | null, path: string, openExplorer: boolean) => Promise<void>
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
  await tusc.run(textbox.value.trim(), `${userProfile}/Downloads/videos`, true).then(() => {
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
  }).catch(() => {
    status.innerText = 'Download failed! Make sure you got the URL right.';
    status.children[0]?.remove();
  }).finally(() => {
    downloadButton.disabled = false
  });
});
