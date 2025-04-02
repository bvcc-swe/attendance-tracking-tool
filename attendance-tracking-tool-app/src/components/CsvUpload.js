//This is the react code that allows users to upload a CSV file
import React from 'react';

function CsvUpload() {
  return (
    <div>
      <h2>CSV Upload</h2>
      <input type="file" accept=".csv" />
    </div>
  );
}

export default CsvUpload;
