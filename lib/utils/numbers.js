

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function leftPadWithoutZero (str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    pad = '';
    padLength = length - str.length;

    while(padLength--) {
        pad += randomIntInc (1, 9);
    }

    return pad + str;
}

function randomIntIncPadingNoStartZero (low, high, length) {
	length = length == null ? 0 : length;
	var n = '' + randomIntInc (low, high);
	return leftPadWithoutZero(n, length);
}

module.exports.randomIntInc = randomIntInc;
module.exports.randomIntIncPadingNoStartZero = randomIntIncPadingNoStartZero;