require('dotenv').config();
const Web3 = require("web3");
const contractData = require("./data");
const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`));
const chalk = require('chalk');
const parcelFactoryContract = new web3.eth.Contract(contractData.data.abi, contractData.data.address);


async function getOrganisationsData () {
  console.log(chalk.yellow(`Getting the data from the smart contracts...`));
  const res = await parcelFactoryContract.methods.getParcelWallets().call();
  let data = [];

  for (var i = 0; i < res.length; i++) {
    let org = res[i];
    let orgObj= {};
    let parcelWalletContract = new web3.eth.Contract(contractData.data.walletAbi, org);
    let departments = await parcelWalletContract.methods.files('1').call();
    if (departments) {
      orgObj.departments = departments;
    }
    let people = await parcelWalletContract.methods.files('2').call();
    if (people) {
      orgObj.people = people;
    }
    let documents = await parcelWalletContract.methods.files('3').call();
    if (documents) {
      orgObj.documents = documents;
    }
    orgObj.organisation = org;

    data.push(orgObj);
  }

  console.log(chalk.yellow(`Data from smart contracts fetched succesfully`));

  return data;
}

module.exports = {
  getOrganisationsData
}
