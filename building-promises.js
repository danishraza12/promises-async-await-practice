const fs = require('fs');
const superagent = require('superagent');

/////////////   Promisified Version   /////////////////

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

readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    // since superagent.get returns a promise we can return that promise and chain
    // on another .then() to get access to the value returned by the promise
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);

    //since writeFilePro also returns a promise so we can chain .then() on it
    return writeFilePro('dog-image.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to file!');
  })
  /* We only need one catch for all the promises and it will run for
    that .then() where the error occurs */
  .catch((err) => {
    if (err) return console.log(err);
  });
