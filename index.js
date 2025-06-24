const pdf2doi = require("./pdf2doi.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

pdf2doi.verbose = true;

UploadAndGetDOIData = async(file) => {
  if (!file) { console.log("No File Sent."); return; }
  try {
      await fs.promises.readFile(file.path);
      var documentDOI;
      const toDOIData = await pdf2doi.getDOI(file.path);
      if (toDOIData) {
          documentDOI = toDOIData.split('DOI:')[1].split(',')[0];
          var documentData;
          const documentDataFetch = await fetch(`https://api.openalex.org/works/https://doi.org/${documentDOI}`);
          if (documentDataFetch.ok) {
              const documentDataFetchGot = await documentDataFetch.json();
              documentData = {title: documentDataFetchGot.title, authors: documentDataFetchGot.authorships.map(a => a.author.display_name)}
              documentData = `${documentData.title}; ${documentData.authors.join(', ')}`;
          }
      }
      console.log(`Document Name: ${file.originalname} | Document DOI: ${documentDOI} | Document Data: ${documentData}`);
  } catch (err) {
      console.error("Error When Trying to Load File From Disk.");
      return;
  }
}
