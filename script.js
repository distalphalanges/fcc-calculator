var entry = document.getElementById('entry');
var memory = document.getElementById('memory');

var numbers = Array.prototype.slice.call(document.querySelectorAll('.number'));
var operations = Array.prototype.slice.call(document.querySelectorAll('.operation'));

var special = ['clearEntry', 'allClear', 'equals', 'decimalPoint'];

var clearNext = false;

numbers.forEach(function(number) {
	number.addEventListener('click', function() {
		pressNumber(number.id);
	});
});

operations.forEach(function(operation) {
	operation.addEventListener('click', function() {
		pressOperation(operation.id);
	});
});

special.forEach(function(ID) {
	var button = document.getElementById(ID);
	button.addEventListener('click', window[ID]);
});

function pressNumber(num) {
	if(clearNext) {
		memory.value += entry.value;
		entry.value = num;
		clearNext = false;
	} else {
		entry.value += num;
	}
}

function pressOperation(op) {
	if(clearNext) {
		entry.value = op;
	} else {
		memory.value += entry.value;
		entry.value = op;
		clearNext = true;
	}
}

function equals() {
	if(!clearNext) {
		memory.value += entry.value;
		entry.value = eval(memory.value);
		clearNext = true;
	}
}

function clearEntry() {
	entry.value = '';
}

function allClear() {
	entry.value = '';
	memory.value = '';
}

function decimalPoint() {
	entry.value += '.';
}

var keys = {

	48: 0,	96: 0,
	49: 1,	97: 1,
	50: 2,	98: 2,
	51: 3,	99: 3,
	52: 4,	100: 4,
	53: 5,	101: 5,
	54: 6,	102: 6,
	55: 7,	103: 7,
	56: 8,	104: 8,
	57: 9,	105: 9

};

window.addEventListener('keyup', function(e) {
	console.log(e.keyCode);
	if(keys.hasOwnProperty(e.keyCode)) {
		pressNumber(keys[e.keyCode]);
	}
});