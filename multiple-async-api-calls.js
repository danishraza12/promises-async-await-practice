//////////////////   MULTIPLE ASYNC REQUESTS without blocking      ///////////////

fs = require('fs');
const superagent = require('superagent');

// Using Promises to prevent callback hell
const readFilePro = (file) => {
  //resolve, reject are both functions
  //resolve sends the data to .then() of the promise
  //reject sends the data to .catch() of the promise
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) return reject('I could not find the file!');
      //this allows data to be available inside .then()
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) return reject('I could not write the data!');
      resolve('Successfully written');
    });
  });
};

//since this is async it automatically returns a promise so we can use .then()
const getDogPicture = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    // getting data from multiple requests without blocking the code
    const res1Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res2Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res3Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const allPromises = await Promise.all([
      res1Promise,
      res2Promise,
      res3Promise,
    ]);
    // Image link is inside .body.message
    const imgs = allPromises.map((pro) => pro.body.message);
    console.log(imgs);

    await writeFilePro('dog-image.txt', imgs.join('\n'));
    console.log('Random dog image saved to file!');
  } catch (error) {
    console.log(error);
    //we need to throw the error to mark the entire promise as rejected
    throw error;
  }
  return 'Got dog pictures';
};

/* Making use of the return value of the async function ()() 
can be used to run the function directly after declaring it */
(async () => {
  try {
    console.log('1: STARTED');
    const out = await getDogPicture();
    console.log(`2: ${out}`);
    console.log('3: FINISHED');
  } catch (err) {
    console.log('ERROR');
  }
})();
