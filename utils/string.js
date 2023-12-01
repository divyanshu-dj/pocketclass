const cutString = (originalString, word) => {
	let words = originalString.split(" ");
	let indexOfClass = words.indexOf(word);
	let resultString = words.slice(indexOfClass + 1).join(" ");
	return resultString;
};

export default cutString;
