var calculator = {

	entry: '',
	memory: '',
	expression: '',
	answer: null,
	state: 'empty',
	dontSlide: false,
	alreadyDecimal: false,
	pressNumber: function(number) {
		switch(this.state) {
			case 'empty':
			case 'number':
			case 'decimalPoint':
				this.state = 'number';
				this.entry += '' + number;
				this.dontSlide = false;
				view.render();
				break;
			case 'operation':
				this.slide();
				this.state = 'number';
				this.entry = number;
				this.dontSlide = false;
				view.render();
				break;
		}
	},
	pressOperation: function(operation) {
		switch(this.state) {
			case 'number':
				this.state = 'operation';
				this.entry += operation;
				this.alreadyDecimal = false;
				view.render();
				break;
			case 'answer':
				this.state = 'operation';
				this.expression = '(' + this.expression + ')' + operation;
				this.memory = this.expression;
				this.alreadyDecimal = false;
				view.render();
				break;
		}
	},
	pressDecimalPoint: function() {
		if(!this.alreadyDecimal) {
			this.state = 'decimalPoint';
			this.alreadyDecimal = true;
			this.entry += '.';
			view.render();
		}
	},
	pressEquals: function() {
		if(this.state === 'number') {
			this.slide();
			this.state = 'answer';
			this.answer = eval(this.expression);
			this.entry = this.answer;
			this.alreadyDecimal = true;
			this.dontSlide = true;
			view.render();
		}
	},
	pressClearEntry: function() {
		this.state = 'empty';
		this.entry = '';
		view.render();
	},
	pressAllClear: function() {
		this.state = 'empty';
		this.entry = '';
		this.expression = '';
		this.memory = this.expression;
		view.render();
	},
	pressBackspace: function() {
		if(this.entry) {
			this.entry = this.entry.slice(0, this.entry.length-1);
			view.render();
		}
	},
	slide: function() {
		if(!this.dontSlide) {
			this.expression += this.entry;
			if(this.expression.length >= 20) {
				this.memory = '...' + this.expression.slice(-20);
			} else {
				this.memory = this.expression;
			}
			view.render();
		}
	}

};

var view = {

	cache: function() {
		// screen
		this.entryField = document.getElementById('entry');
		this.memoryField = document.getElementById('memory');
		// buttons
		this.numbers = document.querySelectorAll('.number');
		this.operations = document.querySelectorAll('.operation');
		// special buttons
		this.equalsButton = document.getElementById('equals');
		this.clearEntryButton = document.getElementById('clearEntry');
		this.allClearButton = document.getElementById('allClear');
	},

	listen: function() {

		this.numbers.forEach(function(number) {
			number.addEventListener('click', calculator.pressNumber.bind(calculator, number.id));
		});

		this.operations.forEach(function(operation) {
			operation.addEventListener('click', calculator.pressOperation.bind(calculator, operation.id));
		});

		this.equalsButton.addEventListener('click', calculator.pressEquals.bind(calculator));
		this.clearEntryButton.addEventListener('click', calculator.pressClearEntry.bind(calculator));
		this.allClearButton.addEventListener('click', calculator.pressAllClear.bind(calculator));

		window.addEventListener('keyup', function(e) {
			if(view.keys.hasOwnProperty(e.keyCode)) {
				var key = view.keys[e.keyCode];
				if(typeof key === 'number') {
					calculator.pressNumber(key);
				} else if(typeof key === 'string') {
					calculator.pressOperation(key);
				} else if(typeof key === 'function') {
					key.call(calculator);
				}
			}
		});

	},

	render: function() {
		this.entryField.value = calculator.entry;
		this.memoryField.value = calculator.memory;
	},

	keys: {

		// numbers and decimal point
		48: 0,	96: 0,
		49: 1,	97: 1,
		50: 2,	98: 2,
		51: 3,	99: 3,
		52: 4,	100: 4,
		53: 5,	101: 5,
		54: 6,	102: 6,
		55: 7,	103: 7,
		56: 8,	104: 8,
		57: 9,	105: 9,
		110: calculator.pressDecimalPoint,	
		190: calculator.pressDecimalPoint,

		// operations
		107: '+', 109: '-', 106: '*', 111: '/',
		13: calculator.pressEquals,	187: calculator.pressEquals,

		8: calculator.pressBackspace.bind(calculator)

	}

}

view.cache();
view.listen();