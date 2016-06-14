/*
A GAME THAT I'M USING TO TEACH MYSELF SOME MORE JAVASCRIPT
it's a text adventure

J. Tynan Burke

This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License. 
Copyright 2016 J. Tynan Burke
*/


// FORMATTING


// MODELS
function Game(name) {
	this.name = name;
	this.rooms = [];
	this.players = [];
};

function Room(name="a default room", description="a default description", parent=null, rooms=[]) {

	// init
	if (parent) {
		parent.rooms.push(this);
	};
	game.rooms.push(this);

	if (Array.isArray(rooms)) {
		this.rooms = rooms
	} else {
		this.rooms = []
	};

	this.name = name;
	this.description = description;
	this.holds = [];

	function toDir(dir) {

	};

	// functions
	this.contains = function()
	{
		console.log(this.rooms);
		console.log(this.holds)
	};
};

function Item(name="some item", description="") {
	this.name = name;
	this.holder = null;
	this.holds = [];
	this.container = null;
	this.player = null;
	this.quantity = 1;
	this.description = description;

};

function addHolder(item, holder) {
	if (!item.holder) {
		item.holder = holder;
	};
	item.holder.holds.push(item);
};

function getContents(room, l=[]) {
	for (var i in room.holds) {
		try {
			l.push(room.holds[i]);
			//console.log(l);
			getContents(room.holds[i], l);
		} catch(err) {console.log(err)};
	};
	return l;
};

function getDescription(room) {
	if (room.holds) {
		l = '<br/>you see:'
		for (var i in room.holds) {
			l += '<br/>--' + room.holds[i].name;
		};
	};
	if (l) {
		return room.description + l;
	} else {
	return room.description
	};
};

function moveRoom(oldRoom, newRoom) {
	currentRoom = newRoom;
};


// INPUT PARSING
function lDistance (s, t) {
    if (!s.length) return t.length;
    if (!t.length) return s.length;

    return Math.min(
        lDistance(s.substr(1), t) + 1,
        lDistance(t.substr(1), s) + 1,
        lDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    ) + 1;
}

function parseInput(s) {
	s = s.toLowerCase();

	if (s == 'look') {
		return getDescription(currentRoom);

	} else if (s.match('look ')) {
		if (s.match('look at ')) {
			lookAt = s.split('look at ')[1]
		} else {
			lookAt = s.split('look ')[1]
		}

	l = getContents(currentRoom)// currentRoom.holds
	best = null
	best_d = 100
	for (var i in l) {
		test = lDistance(l[i].name, lookAt)
		if (test < best_d) {
			best = l[i]
			best_d = test
			console.log(l[i].name, best.name, best_d)
		}
	}
	return getDescription(best)

		
	} else {
		return "-";
	};
};

function getOutput(text) {
	return parseInput(text);
};

function renderOutput(text) {
	var out = $("<div>", {class: "commandResponse"});
	var firstLine = $("<span>", {class: "commandEcho", text: text});
	var secondLine = $("<span>", {class: "currentRoom", text: '(you are in ' + currentRoom.name + ')'})
	var o = getOutput(text);
	var thirdLine = $("<span>", {class: "commandResponse", html: o});
	out.append([firstLine, $("<br>"), secondLine, $("<br>"), thirdLine]);
	return out;
};


// INITIALIZE
game = new Game("My Game!");
currentRoom = null;

// POPULATE
function popLimbo() {
	limbo = new Room("limbo", "you look around and see the void behind and all around you");
	limbo2 = new Room();
	shelf = new Item("a bookshelf", "a cheap wooden bookshelf");
	book = new Item("a yellow book", "a book about javascript programming for dummies");
	page = new Item("a page", "what it sounds like");
	addHolder(shelf, limbo);
	addHolder(book, shelf);
	addHolder(page, book);
	currentRoom = limbo;
	//contents = getContents(limbo)
	//console.log(getContents(limbo, contents))
};

$(document).ready(function () {
	// DOM logic
	popLimbo();
	$('#inputForm').on('submit', function(e) {
		e.preventDefault();
		command = $(this).children().eq(0).val();
		$('#outputBox').prepend(renderOutput(command));
		return false;
	});
});