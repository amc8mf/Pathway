module.exports = (firstName, secondName) => {
  var letterList = ['Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  var wallName = '';
  if (letterList.indexOf(firstName.charAt(0)) < letterList.indexOf(secondName.charAt(0))) {
    wallName += firstName.charAt(0);
  } else {
    wallName += secondName.charAt(0);
  }
  if (parseInt(firstName.charAt(1)) < parseInt(secondName.charAt(1))) {
    wallName += firstName.charAt(1);
  } else {
    wallName += secondName.charAt(1);
  }
  if (firstName.charAt(0) == secondName.charAt(0)) {
    wallName += 'v'
  } else {
    wallName += 'h'
  }
  return wallName;
};