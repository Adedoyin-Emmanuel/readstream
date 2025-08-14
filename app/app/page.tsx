import React from "react";

import FileUpload from "./components/file-upload";

const App = () => {
  return (
    <div>
      <h1 className="text-lg py-4 ">Chairman, upload your README.md file</h1>
      <FileUpload />
    </div>
  );
};

export default App;
