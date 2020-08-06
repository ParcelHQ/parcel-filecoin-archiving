require('dotenv').config();
const  {createPow, ffsTypes} = require('@textile/powergate-client');
const fs = require('fs');
const host = "https://grpcweb.hfs.textile.io"; // or whatever powergate instance you want
const pow = createPow({ host });
const chalk = require('chalk');

pow.setToken(process.env.POWERGATE_FFS_ID);

async function createToken () {
    const { token } = await pow.ffs.create();
    pow.setToken(token);
    return token;
}


async function generateNewAddress () {
    const { token } = await pow.ffs.create();
    return token;
}


async function addDataToHotStorage (data) {
  try {
    const { cid } = await pow.ffs.addToHot(data);
    return cid;
  } catch (error) {
    throw new Error(error);
  }
}


async function addDataToColdStorage (cid) {
  try {
    const { jobId } = await pow.ffs.pushConfig(cid);
    return jobId;
  } catch (error) {
    throw new Error(error);
  }
}
async function archiveData(data) {
  try {
    // const { info } = await pow.ffs.info();

    console.log(`Add it to ffs hot storage`);
    let cid = await addDataToHotStorage(data);
    console.log(`Added to ffs hot storage succesfully`);

    console.log(`Add it to ffs cold storage`);
    let jobId = await addDataToColdStorage(cid);
    console.log(`Added to ffs hot storage succesfully with jobId ${jobId}`);

    // watch the FFS job status to see the storage process progressing
  console.log(`Watching for jobId ${jobId}`);
   const jobsCancel = pow.ffs.watchJobs((job) => {
     console.log(job);
     if (job.status === ffsTypes.JobStatus.JOB_STATUS_CANCELED) {
       console.log("job canceled")
     } else if (job.status === ffsTypes.JobStatus.JOB_STATUS_FAILED) {
       console.log("job failed")
     } else if (job.status === ffsTypes.JobStatus.JOB_STATUS_SUCCESS) {
       console.log("job success!")
     }
   }, jobId)

   // watch all FFS events for a cid
    const logsCancel = pow.ffs.watchLogs((logEvent) => {
      console.log(logEvent);
      console.log(`Received event for cid ${logEvent.cid}`)
    }, cid)
  } catch (error) {
    throw new Error(chalk.red(error))
  }

}

async function getBalance () {
  const { info } = await pow.ffs.info()
   const { addrsList } = await pow.ffs.addrs();
   console.log(info.balancesList);
}


module.exports = {
  createToken,
  generateNewAddress,
  addDataToHotStorage,
  addDataToColdStorage,
  archiveData

}
