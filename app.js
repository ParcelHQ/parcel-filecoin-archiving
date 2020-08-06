const parcel = require("parcel-sdk");
const filecoin = require("./filecoin/powergate");
const smartContracts = require("./smart-contracts");
const chalk = require('chalk');

(async ()=> {
  try {
    let organisationsData = await smartContracts.getOrganisationsData();
    console.log(`Organisation Data:`);
    console.log(organisationsData);
    let organisationsDataTemp =  [];

    organisationsDataTemp = organisationsDataTemp.concat(organisationsData);

    console.log(chalk.yellow(`Getting the data from Ipfs for every organisation`));

    for (let i = 0; i < organisationsData.length; i++) {
      let {departments, organisation, people, documents} = organisationsData[i];

      if (departments) {
       console.log(chalk.yellow(`Fetching the encrypted departments data from the ipfs hash ${departments}`));
       organisationsDataTemp[i].departments = await parcel.ipfs.getData(departments);
      }

      if (people) {
        console.log(chalk.yellow(`Fetching the encrypted people data from the ipfs hash ${people}`));
        organisationsDataTemp[i].people = await parcel.ipfs.getData(people);
      }

      if (documents) {
        console.log(chalk.yellow(`Fetching the encrypted documents data from the ipfs hash ${documents}`));
        organisationsDataTemp[i].documents = await parcel.ipfs.getData(documents);
      }
    }

    console.log(chalk.yellow(`Preparing the ipfs data to store on filecoin using Powergate`));
    console.log(`Sending Organisation encrypted to powergate`);

    let data = Buffer.from(JSON.stringify(organisationsDataTemp));


    console.log(chalk.yellow(`Sending it for archiving..`));
    await filecoin.archiveData(data);
  } catch (error) {
    console.log(error);
  }

})();
