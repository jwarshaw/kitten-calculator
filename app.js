/*kitten calculator javascript*/

//user can enter equation in text box by keyboard or button clicks
	//bind keypress to button click
	//don't allow non-button keys by keyboard in textbox

//dom elements
var eqBox = document.getElementById('equationBox');
var calc = document.getElementById('calc');
var convButton = document.querySelector('td.convert');
var title = document.querySelector('h1');

//create array of textbox value
var createArr = function(str) {
	//make array of eqBox values
	var arr = str.split('');
	//define empty array and empty array index
	var eqArr = [];
	var j = 0, numVal = '';
	//loop through textbox array and populate empty array with appropriate values
	for(var i = 0; i < arr.length; i++) {
		//if arr val is a number or decimal concatenate to itself until encounter a symbol
		if(parseFloat(arr[i]) || arr[i] === '.' || arr[i] === '0') {
			numVal += arr[i];
		} else {
			//push numVal if it exists then clear it
			if(numVal != '') {
				eqArr.push(numVal);
				numVal = '';
			}		
			//push symbol
			eqArr.push(arr[i]);
		}
	}
	//last check for numVal
	if(parseFloat(numVal) || numVal === '0') {
		eqArr.push(numVal);
		numVal = '';		
	}
	return eqArr;
}

//calc contents of parens first
var PCalc = function(arr) {
	var newArr = [];

	//loop through array
	for(var i = 0; i < arr.length; i++) {
		//if encounter parens
		if(arr[i] === '(') {
			//create empty parens array for pushing values
			var parenArr = [];
			//check left of parens and add multiplier if needed
			if(!isNaN(parseFloat(newArr[newArr.length-1]))) 
				newArr.push('*');
			//increment arr to begin calculating value within parens	
			i++;
			while(arr[i] != ')') 
			{
				parenArr.push(arr[i]);
				i++;
			}

			//order of operations
			var MDArr = MDCalc(parenArr);
			var val = ASCalc(MDArr);
			//add calculated value to new array
			newArr.push(val[0]);

			console.log(newArr);

			//check right of parens and add multiplier if needed
			if(arr[i+1] && !isNaN(parseFloat(arr[i+1])))
				newArr.push('*');
		} else {
			newArr.push(arr[i]);
		}
	}
	console.log(newArr);
	return newArr;
}

//calc multiplication and division
var MDCalc = function (arr) {
	var newArr = [];
	var val = 0;

	//loop through array for mult and div
	for(var i = 0; i < arr.length; i++) {

		//switch statement with arr shuffle and math
		switch(arr[i]) {
			case '%':
				var left = parseFloat(newArr.pop());
				val = left * 0.01;
				newArr.push(val);
				i++;
				break;
			case '*': 
				var left = parseFloat(newArr.pop());
				var right = parseFloat(arr[i + 1]);
				val = left * right;
				newArr.push(val);
				i++;
				break;
			case '/':
				var left = parseFloat(newArr.pop());
				var right = parseFloat(arr[i + 1]);
				val = left / right;
				newArr.push(val);
				i++;
				break;
			default:
				newArr.push(arr[i]);
				break;
		}
	}
	return newArr;
}

//calc addition and subtraction
var ASCalc = function (arr) {
	var newArr = [];
	var val = 0;

	//loop through array for mult and div
	for(var i = 0; i < arr.length; i++) {

		//switch statement with arr shuffle and math
		switch(arr[i]) {
			case '+': 
				var left = parseFloat(newArr.pop());
				var right = parseFloat(arr[i + 1]);
				val = left + right;
				newArr.push(val);
				i++;
				break;
			case '-':
				var left = parseFloat(newArr.pop());
				var right = parseFloat(arr[i + 1]);
				val = left - right;
				newArr.push(val);
				i++;
				break;
			default:
				newArr.push(arr[i]);
				break;
		}
	}
	return newArr;
}

//unit function for conversion button
var unit = {
	type: ' kitten',
	convert: function(){
		if(this.type === ' kitten') {
			title.innerText = 'Puppy Calculator';
			convButton.innerText = 'convert to kittens';
			this.type = ' puppie';
		} else {
			title.innerText = 'Kitten Calculator';
			convButton.innerText = 'convert to puppies';
			this.type = ' kitten';
		}
	}
}

//calculate total
var total = 0; //defined in global for event handler access
var calcTotal = function(str) {
	//call create array function
	var arr = createArr(str);

	//order of operations
	var PArr = PCalc(arr);
	var MDArr = MDCalc(PArr);
	var ASArr = ASCalc(MDArr);

	//pop total and return
	total = ASArr.pop();
}

//check error and add units
var addUnits = function() {
	if(isNaN(total))
		eqBox.value = 'Error';
	else if(total === 1)
		eqBox.value = total + unit.type;
	else
		eqBox.value = total + unit.type + 's';
}

//eqsign switch for continuation of equation
var eqSign = {
	status: false,
	open: function(){this.status = true;},
	close: function(){this.status = false;}					
}
//paren switch to auto close parens
var paren = {
	status: false,
	open: function(){this.status = true;},
	close: function(){
			this.status = false;
			eqBox.value += ')';
		}		
}
//symbol switch to enable symbol replacement
var sym = {
	status: false,
	open: function(){this.status = true;},
	close: function(){this.status = false;}		
}

//event listener using event delegation
calc.addEventListener('click', function(e){
	
	//if convert button change units to puppies
	if(e.target && e.target.classList.contains('convert')) {
		unit.convert();
	}

	//if button is 'AC' clear textbox
	else if(e.target && e.target.classList.contains('clear')) {
		//eqSign toggle check
		if(eqSign.status)
			eqSign.close();
		//clear box
		eqBox.value = '0';
		//close sym switch
		sym.close();
	}

	//if button is '=' calculate total
	else if(e.target && e.target.classList.contains('equal')) {
		if(!eqSign.status) {
			//close parens if needed
			if(paren.status)
				paren.close();
			//calculate total
			calcTotal((eqBox.value));
			//delay for effect then add units and display
			setTimeout(addUnits, 250);
			//open eqSign switch
			eqSign.open();
			//close sym switch
			sym.close();
		}
	}

	//openparen button event handler
	else if(e.target && e.target.classList.contains('openparen')) {
		paren.open();
		//if eqbox is zero or eq sign was just hit, number replaces eqBox value
		if (e.target && eqBox.value === '0' || eqSign.status) {
			eqSign.close();	
			eqBox.value = e.target.innerText;
		} 
		else
			eqBox.value += e.target.innerText;
		//close sym switch
		sym.close();
	}
	//closeparen event handler
	else if(e.target && e.target.classList.contains('closeparen')) {	
		paren.close();
		//close sym switch
		sym.close();
	}

	//number and paren buttons handler
	else if(e.target.classList.contains('num')) {
		//if eqbox is zero or eq sign was just hit, number replaces eqBox value
		if (e.target && eqBox.value === '0' || eqSign.status) {
			eqSign.close();	
			eqBox.value = e.target.innerText;
		} 
		else
			eqBox.value += e.target.innerText;
		//close sym switch
		sym.close();
	}

	//symbol buttons handler
	else if(e.target && e.target.classList.contains('sym')) {
		//eqSign toggle check
		if(eqSign.status) {
			eqSign.close();
			eqBox.value = total + e.target.innerText;
		} else if(sym.status) 
			eqBox.value = eqBox.value.substring(0, eqBox.value.length-1) + e.target.innerText;
		else
			eqBox.value += e.target.innerText;
		//open sym switch
		sym.open();
	}
});