export const DataDisplay = ({ data }: { data: string[] }) => {
  return (
    <>
      {data.slice(-3).map(line => (
        <>
          <code>{line}</code>
          <br />
        </>
      ))}
    </>
  );
};
