const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.Provider.env();      // Get data from `solana config get`
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Call start_stuff_off, pass it the params it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // You'll need to now pass a GIF link to the function! You'll also need to pass in the user submitting the GIF!
  await program.rpc.addGif("https://media4.giphy.com/media/3ohc1cssVhCXQTbmlW/giphy.gif?cid=790b7611bbf8647e764cdb98d073ff2a3d4c9d8b5d78a566&rid=giphy.gif&ct=g", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  
  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log('👀 GIF List', account.gifList)

}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();