require('dotenv').config();
const axios = require("axios");
const ethers = require("ethers");
const { exec } = require("child_process");

// Set API endpoint and contract/operator addresses
const apiEndpoint = "https://waitlist-api.prod.blast.io/v1/dapp-auth";
const contractAddress = "0x621aad6c52609599a2c6d87a3a2f8186afbf7e9d";
const operatorAddress = "0x1111111110e2d2cafdf9e82bfbce84ad3623e4e1";
const operatorPrivateKey = process.env.OPERATOR_PRIVATE_KEY;

axios
  .post(`${apiEndpoint}/challenge`, {
    contractAddress,
    operatorAddress
  })
  .then(async response => {
    const challengeData = response.data.challengeData;
    const message = response.data.message;

    const signer = new ethers.Wallet(operatorPrivateKey);
    const signature = await signer.signMessage(message);

    console.log("Challenge:", challengeData);
    console.log("Message:", message);
    console.log("Signature:", signature);

    axios
      .post(`${apiEndpoint}/solve`, {
        challengeData,
        signature
      })
      .then(response => {
        const bearerToken = response.data.bearerToken;
        console.log("Bearer Token:", bearerToken);

        // Construct the curl command with the bearer token
        const curlCommand = `curl --request GET \\
  --url https://waitlist-api.prod.blast.io/v1/contracts/${contractAddress}/point-balances \\
  --header 'Authorization: Bearer ${bearerToken}'`;

        // Execute the curl command
        exec(curlCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing curl: ${error}`);
            return;
          }
          console.log(`Curl output: ${stdout}`);
        });
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.error(error));
