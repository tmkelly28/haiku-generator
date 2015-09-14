var fs = require('fs');

// reads a txt and parses into a dictionary; passes into the createHaiku function to generate a haiku
fs.readFile('cmudict.txt', function (error, data) {
  
  /* dictionary contains an index of words by syllable count
  */
  var dictionary = {};
  
  /* sums the values in an array of numbers
  */
  function sum(array) {
    var result = 0;
    for (var i = 0; i < array.length; i++) {
      result += array[i];
    }
    return result;
  }

  /* creates a function that generates a random number between a specified lowerBound and upperBound
  */
  function createRandomGenerator(lowerBound, upperBound) {
    var n = (upperBound - lowerBound) + 1;
    var m = lowerBound - 1;
    var generator = function () {
      return Math.floor((Math.random() * n) + 1) + m;
    };
    return generator;
  }

  /* generates an array of elements that add up to a specified number
  *  array: contains a starting array
  *  minValue: the minimum value that numbers in the array should have
  *  maxValue: the maximum value that numbersin the array should have (not not be higher than maxSum)
  *  maxSum: the maximum sum of the values in the array
  */
  function createRandomPattern(array, minValue, maxValue, maxSum) {
    var rand = createRandomGenerator(minValue, maxValue);
    array.push(rand());
    var currentSum = sum(array);
    if (currentSum == maxSum) {
      return array;
    } else if (currentSum < maxSum) {
      var newMaxValue = maxSum - currentSum;
      return createRandomPattern(array, minValue, newMaxValue, maxSum);
    }
  }

  /* Creates the 5-7-5 pattern of a haiku
  *  Represented as an array of arrays with numbers representing the syllables of a word
  */
  function createHaikuPattern() {
    result = [];
    result.push(createRandomPattern([], 1, 5, 5));
    result.push(createRandomPattern([], 1, 7, 7));
    result.push(createRandomPattern([], 1, 5, 5));
    return result;
  }

  /* Logs a haiku to the console given a dictionary of words indexed by number of syllables and a syllable pattern
  */
  function createHaiku(dictionary, pattern) {
    result = "";
    for (var i = 0; i < pattern.length; i++) {
      for (var j = 0; j < pattern[i].length; j++) {
        var syllables = pattern[i][j].toString();
        var indexLength = dictionary[syllables].length;
        var rand = createRandomGenerator(0, indexLength - 1);
        var word = dictionary[syllables][rand()].replace(/\d|\(|\)/g, "");
        result += word + " ";
      }
      if (i !== pattern.length - 1) { result += "\n"; };
    }
    console.log(result);
  }
  
  /*
  *  begin the actual readfile callback
  */
  
  // error checking
  if (error) {
    return console.log(error);
  }
  // parse the lines
  var lines = data.toString().split('\n');
  
  // generate the dictionary
  lines.forEach(function(line) {
    var line_split = line.split("  ");
    var word = line_split[0];
    try {
      var syllables = line_split[1].match(/\d/g).length.toString();
    } catch (error) {};
    
    // create the index for the letter
    if (dictionary[syllables] === undefined) {
      dictionary[syllables] = [];
    }
    dictionary[syllables].push(word);
  });
  createHaiku(dictionary, createHaikuPattern());
});