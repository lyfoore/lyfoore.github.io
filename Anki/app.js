let items = [];

function addItem() {
	let template = items.map(item => capitalizeFirstLetter(item)).map(item => `<li>${item}</li>`).join('\n');
	document.querySelector('ul').innerHTML = template;
}

addItem();

let addingMenu = document.getElementById('addingMenu');
let hide = document.getElementById('hide');
let add = document.getElementById('add');
let input = document.getElementById('input');
let newItem = document.getElementById('newItem');
let item = document.getElementById('item');
let  i = 0;


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


hide.addEventListener('click', () => {
	console.log('hide');
	if (!(i % 2)) {
		addingMenu.style.display = 'none';
	}
	else {
		addingMenu.style.display = 'block';
	}
	i += 1;
});

input.addEventListener('keyup', (key) => {
	if (key.keyCode === 13) {
		add.click();
	}
});

add.addEventListener('click', () => {
	items.push(capitalizeFirstLetter(input.value));
	addItem();
	input.value = "";
	console.log(input.value);
});

newItem.addEventListener('click', () => {
	item.innerHTML = `${items[getRandomInt(items.length)]}`;
});