import type { AppStatus } from './App';
import { DataDisplay } from './DataDisplay';
import { Link } from './Link';
import { UpdateButton } from './UpdateButton';

type StatusProps = {
  data: string[];
  errorData: string[];
  progressBar: string;
  status: AppStatus;
  url: string;
};

export const Status = (props: StatusProps) => <h3>{getStatus(props)}</h3>;

function getStatus({ data, errorData, progressBar, status, url }: StatusProps) {
  switch (status) {
    case 'downloading':
      return (
        <>
          Downloading... Please wait...
          <br />
          <DataDisplay data={data} />
          <code id="progressbar">{progressBar}</code>
        </>
      );
    case 'done':
      return (
        <>
          {'Download complete! Video downloaded: '}
          <Link url={url} />
        </>
      );
    case 'error':
      const error = errorData.at(-1);
      return (
        <>
          Download failed! Make sure you got the URL right.
          <br />
          <code>{error}</code>
          {error?.includes('Confirm you are on the latest version') && (
            <>
              <br />
              <UpdateButton />
            </>
          )}
        </>
      );
    default:
      return '';
  }
}
