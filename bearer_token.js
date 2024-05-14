const axios = require("axios")
const ethers = require("ethers")

// Set API endpoint and contract/operator addresses
const apiEndpoint = "https://waitlist-api.prod.blast.io/v1/dapp-auth"
const contractAddress = "0x621aad6c52609599a2c6d87a3a2f8186afbf7e9d"
const operatorAddress = "0x1111111110e2d2cafdf9e82bfbce84ad3623e4e1"
const operatorPrivateKey = ""

axios
  .post(`${apiEndpoint}/challenge`, {
    contractAddress,
    operatorAddress
  })
  .then(async response => {
    const challengeData = response.data.challengeData
    const message = response.data.message

    const signer = new ethers.Wallet(operatorPrivateKey)
    const signature = await signer.signMessage(message)

    console.log("Challenge:", challengeData)
    console.log("Message:", message)
    console.log("Signature:", signature)

    axios
      .post(`${apiEndpoint}/solve`, {
        challengeData,
        signature
      })
      .then(response => {
        const bearerToken = response.data.bearerToken
        console.log("Bearer Token:", bearerToken)
        const myBearerToken = bearerToken
      })
      .catch(error => console.error(error))
  })
  .catch(error => console.error(error))
