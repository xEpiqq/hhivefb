export default function PDFFile({ file }) {

    return (
      <div className="w-full">
        <embed src={file.url} width="100%" height="500" />
      </div>
    );
  }
  