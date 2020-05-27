class UI {
	constructor () {
		//Dom Elements
		this.budgetFeedback = document.querySelector('.budget-feedback');
		this.expenseFeedback = document.querySelector('.expense-feedback');
		this.budgetForm = document.getElementById('budget-form');
		this.budgetInput = document.getElementById('budget-input');
		this.budgetAmount = document.getElementById('budget-amount');
		this.expenseAmount = document.getElementById('expense-amount');
		this.balance = document.getElementById('balance');
		this.balanceAmount = document.getElementById('balance-amount');
		this.expenseForm = document.getElementById('expense-form');
		this.expenseInput = document.getElementById('expense-input');
		this.amountInput = document.getElementById('amount-input');
		this.expenseTableBody = document.getElementById('expense-TableBody');
		this.itemList = [];
		this.itemID = 0;
	}

	//Submit Budget Method
	//If value in the input is empty or less than 0 then add showItem classs
	submitBudgetForm () {
		//Get the input value
		const value = this.budgetInput.value;

		//If value is less than 0 or it is empty then add class showItem to the budgetfeedback which is an alert which will make its display to block from hidden
		if (value === '' || value < 0) {
			this.budgetFeedback.classList.add('showItem');
			this.budgetFeedback.innerHTML = `<p>Value cannot be negative or empty</p>`;

			//store reference of the class to self as for setTimeout function this refers to global window object
			const self = this;

			//Make the feedback hidden after 2 secs
			setTimeout(() => {
				self.budgetFeedback.classList.remove('showItem');
			}, 2000);
		} else {
			this.budgetAmount.textContent = value;
			this.budgetInput.value = '';

			//Update the balance amount by calling showBalance method
			this.showBalance();
		}
	}

	//showBalance
	showBalance () {
		//Get the total expenses from totalExpenses method
		const expenses = this.totalExpense();
		//Calculate total balance by substracting expenses from budgetamount
		const total = parseInt(this.budgetAmount.textContent) - expenses;
		//Update the balance amount
		this.balanceAmount.textContent = total;

		//If total amount is negative show entire balance amount along with dollar sign in red and .....
		if (total < 0) {
			this.balance.classList.remove('showGreen', 'showBlack');
			this.balance.classList.add('showRed');
		} else if (total > 0) {
			this.balance.classList.remove('showRed', 'showBlack');
			this.balance.classList.add('showGreen');
		} else {
			this.balance.classList.remove('showGreen', 'showRed');
			this.balance.classList.add('showBlack');
		}
	}

	//Total expenses
	totalExpense () {
		let total = 0;
		// let tableBody = this.expenseTableBody;
		// let getAllTrs = tableBody.querySelectorAll('tr');
		// if (getAllTrs.length > 0) {
		// 	for (let tr of getAllTrs) {
		// 		let allTds = tr.querySelectorAll('td');
		// 		let expenseAmount = parseInt(allTds[1].textContent);
		// 		console.log(expenseAmount);
		// 		total = total + expenseAmount;
		// 	}
		// }
		// return total;
		if (this.itemList.length > 0) {
			total = this.itemList.reduce((accum, currval) => {
				accum += currval.amount;
				return accum;
			}, 0);
		}
		return total;
	}

	//SubmitExpenseForm

	submitExpenseForm () {
		const expenseValue = this.expenseInput.value;
		const amountValue = this.amountInput.value;

		if (expenseValue === '' || amountValue === '' || amountValue < 0) {
			this.expenseFeedback.classList.add('showItem');
			this.expenseFeedback.innerHTML = `<p>Expense title or amount cannot be negative/empty.</p>`;
			const self = this;
			setTimeout(() => {
				self.expenseFeedback.classList.remove('showItem');
			}, 2000);
		} else {
			let amount = parseInt(amountValue);
			this.expenseInput.value = '';
			this.amountInput.value = '';

			//Create an expense object
			let expense = {
				id: this.itemID,
				title: expenseValue,
				amount: amount
			};

			this.itemID++;

			//push expense object to array itemList
			this.itemList.push(expense);
			this.addExpense(expense);
			this.showBalance();
			this.showExpense();
		}
	}

	//Add Expense
	addExpense (expense) {
		let tr = document.createElement('tr');
		for (let item in expense) {
			if (item !== 'id') {
				let td = document.createElement('td');
				td.textContent = expense[item];
				if (item === 'title') {
					td.style.color = 'red';
					td.style.fontWeight = '600';
					td.textContent = `- ${expense[item]}`;
				}
				tr.appendChild(td);
			}
		}
		let editTd = document.createElement('td');
		editTd.innerHTML = `
    <a href="#" class="edit-icon mx-2" data-id="${expense['id']}">
      <i class="fas fa-edit"></i>
    </a>
    `;
		let delTd = document.createElement('td');
		delTd.innerHTML = `
    <a href="#" class="delete-icon" data-id="${expense['id']}">
      <i class="fas fa-trash"></i>
    </a>
    `;
		tr.appendChild(editTd);
		tr.appendChild(delTd);
		tr.style.borderBottom = 'hidden';
		this.expenseTableBody.appendChild(tr);
	}

	showExpense () {
		this.expenseAmount.textContent = parseInt(this.totalExpense());
	}

	deleteExpense (element) {
		let tableBody = this.expenseTableBody;
		let remove = element.parentElement.parentElement;
		let id = element.dataset.id;
		for (let i = 0; i < this.itemList.length; i++) {
			if (this.itemList[i].id == id) {
				this.itemList.splice(i, 1);
				break;
			}
		}
		tableBody.removeChild(remove);
		this.showExpense();
		this.showBalance();
	}

	editExpense (element) {
		let expenseTitle = '';
		let expenseValue = 0;
		let tableBody = this.expenseTableBody;
		let id = parseInt(element.dataset.id);

		//Remove from itemList
		let expense = this.itemList.filter((item) => {
			return item.id == id;
		});

		//Update itemList
		this.itemList = this.itemList.filter((item) => {
			return item.id != id;
		});

		this.expenseInput.value = expense[0].title;
		this.amountInput.value = expense[0].amount;
		//Remove from DOM
		tableBody.removeChild(element.parentElement.parentElement);
		this.showExpense();
		this.showBalance();
	}
}

function eventListeners () {
	//Get the elements on which we will add eventListeners
	const budgetForm = document.getElementById('budget-form');
	const expenseForm = document.getElementById('expense-form');
	const expenseTablebody = document.getElementById('expense-TableBody');

	//Instantiate the UI class
	const ui = new UI();

	//Bodget Form Submit
	budgetForm.addEventListener('submit', function (event) {
		//To prevent page refresh
		event.preventDefault();
		ui.submitBudgetForm();
	});
	//Expense Form Submit
	expenseForm.addEventListener('submit', function (event) {
		event.preventDefault();
		ui.submitExpenseForm();
	});

	//Expense Table Body Click
	expenseTablebody.addEventListener('click', function (event) {
		if (event.target.parentElement.classList.contains('edit-icon')) {
			ui.editExpense(event.target.parentElement);
		} else if (event.target.parentElement.classList.contains('delete-icon')) {
			ui.deleteExpense(event.target.parentElement);
		}
	});
}

//When the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	eventListeners();
});
