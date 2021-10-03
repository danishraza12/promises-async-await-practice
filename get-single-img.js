const fs = require('fs');
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

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro('dog-image.txt', res.body.message);
    console.log('Random dog image saved to file!');
  } catch (error) {
    console.log(error);
    //we need to throw the error to mark the entire promise as rejected
    throw error;
  }
  return 'Got dog pictures';
};

// Method # 1:
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

// Method # 2:
/* This can also be used to make use of the return value of the async 
 function however code will directly jump to here as soon as the above 
 function is awaited then it calls the function and again gets awaited 
 and then runs whichever function which fetches data first in no order  */
console.log('\n1-1: STARTED using .then()');
getDogPicture()
  .then((out) => {
    console.log(`2-1: ${out}`);
    console.log('3-1: FINISHED');
  })
  .catch((err) => {
    console.log('4-1: ERROR');
  });

// Output when both are run at the same time
/* OUTPUT 1: 
1: STARTED

1-1: STARTED using .then()
Breed: retriever
Breed: retriever
https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_4519.jpg
https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_562.jpg
Random dog image saved to file!
2: Got dog pictures
3: FINISHED
Random dog image saved to file!
2-1: Got dog pictures
3-1: FINISHED 

OUTPUT 2:
1: STARTED

1-1: STARTED using .then()
Breed: retriever
Breed: retriever
https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_415.jpg
Random dog image saved to file!
2-1: Got dog pictures
3-1: FINISHED
https://images.dog.ceo/breeds/retriever-curly/n02099429_3402.jpg
Random dog image saved to file!
2: Got dog pictures
3: FINISHED*/
