// print help text if there aren't arguments or if user asks for help
if (!process.argv[2] || process.argv.includes("--help") || process.argv.includes("-h")) help();
else {
  const { isLowerCase, isUpperCase } = getOptions(process.argv);

  process.argv.slice(2).forEach((argument) => {
    if (isInputValid(argument)) {
      const amount = parseInt(argument.substr(0, 1));
      const input = isLowerCase
        ? argument.substr(1).toLowerCase()
        : isUpperCase
        ? argument.substr(1).toUpperCase()
        : argument.substr(1);

      increment(amount, input, isLowerCase);
    }
  });
}

// get upper case and none options and set isLowerCase and isUpperCase
function getOptions(args) {
  let isLowerCase = true;
  let isUpperCase = false;

  if (args.includes("--upper")) {
    args.splice(args.indexOf("--upper"), 1);
    isUpperCase = true;
    isLowerCase = false;
  }
  if (args.includes("--none")) {
    args.splice(args.indexOf("--none"), 1);
    isUpperCase = false;
    isLowerCase = false;
  }
  return { isLowerCase, isUpperCase };
}

// Error handling
function isInputValid(argument) {
  const amount = parseInt(argument.substr(0, 1));
  const input = argument.substr(1);
  const secondChar = parseInt(input.substr(1, 1));
  let isValid = true;
  try {
    if (!amount && amount !== 0) {
      isValid = false;
      throw new Error(`Error: First character must be a number in '${argument}'\n`);
    }
    if (secondChar) {
      isValid = false;
      throw new Error(`Error: Number must be between 0 and 9 in '${argument}'\n`);
    }
    if (!input || !input.match(/^[a-zA-Z]+$/)) {
      isValid = false;
      throw new Error(`Error: A string between a and z must be included in '${argument}'\n`);
    }
  } catch (e) {
    process.stdout.write(e.message);
  } finally {
    return isValid;
  }
}

// increase characters with respect to upper/lower case
function increment(amount, input, isLowerCase) {
  for (let i = 0; i < input.length; i++) {
    let charCode = input.charCodeAt(i) + amount;
    if (charCode > 122 || (!isLowerCase && 97 > charCode && charCode > 90)) charCode -= 26;

    input = replaceChar(input, i, String.fromCharCode(charCode));
  }
  process.stdout.write(input + "\n");
}

function replaceChar(input, index, value) {
  return input.substr(0, index) + value + input.substr(index + 1);
}

function help() {
  process.stdout.write("This app increases characters in given string by amount provided.\n");
  process.stdout.write(
    `Each parameter should be of the form <number><string> where <number> is a single digit from 0 to 9
     and <string> is a lower case string composed of the characters from a to z with length of at least 1.\n`
  );
  process.stdout.write(`Example: "node main.js 0apple 1lzru" outputs:
     apple
     masv\n`);
  process.stdout.write(
    `Default output is lower case.
    Use "--upper" for upper case or "--none" to maintain case and wrap from upper to lower\n`
  );
}
