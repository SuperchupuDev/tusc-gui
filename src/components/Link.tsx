export const Link = ({ url }: { url: string }) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {url}
    </a>
  );
};
