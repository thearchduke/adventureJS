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
		console.log(this.rooms)
		console.log(this.holds)
	};

	this.getDescription = function() {
		var l;
		if (this.holds) {
			l = '<br/>you see:'
			for (var i in this.holds) {
				l += '<br/>--' + this.holds[i].name;
			};
		};
		if (l) {
			return this.description + l;
		} else {
		return this.description
		};
	};

	this.getContents = function(room=this, l=[]) {
		for (var i in room.holds) {
			try {
				l.push(room.holds[i]);
				getContents(room.holds[i], l);
			} catch(err) {console.log(err)};
		};
		return l;
	};

	this.bestMatch = function(test) {
		bestDist = 100
		bestMatch = null
		contents = this.getContents()
		testItem = {name: test}
		for (var i in contents) {
			item = contents[i]
			diff = item.getDiff(testItem)
			//console.log(item, diff, testItem)
			if (diff < bestDist) {
				bestDist = diff
				bestMatch = item
			}
		}		
	return bestMatch
	}
};

function Item(name="some item", description="") {
	this.name = name;
	this.holder = null;
	this.holds = [];
	this.container = null;
	this.player = null;
	this.quantity = 1;
	this.description = description;

	this.getDescription = function() {
		var l;
		console.log(this.holds)
		if (this.holds.length > 0) {
			l = '<br/>you see:'
			for (var i in this.holds) {
				l += '<br/>--' + this.holds[i].name;
			};
		};
		if (l) {
			return this.description + l;
		} else {
		return this.description
		};
	};

	this.getContents = function(room=this, l=[]) {
		for (var i in room.holds) {
			try {
				l.push(room.holds[i]);
				getContents(room.holds[i], l);
			} catch(err) {console.log(err)};
		};
		return l;
	};

	this.histogram = function(item=this) {
		out = {}
		s = item.name
		for (var i in s) {
			ltr = s[i]
			if (ltr in out) {
				out[ltr]++;
			} else {
				out[ltr] = 1;
			}
		}
		return out
	}

	this.getDiff = function(item) {
		h1 = this.histogram(this)
		h2 = this.histogram(item)
		diff = 0
		for (var i in h1) {
			if (i in h2) {
				diff -= 1
				diff += Math.abs(h1[i] - h2[i])
			}
			else {
				diff += 1
			}
		}
		for (var i in h2) {
			if (i in h1) {
				diff -= 1
				diff += Math.abs(h1[i] - h2[i])
			}
			else {
				diff += 1
			}
		}
		return diff		
	}
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
			getContents(room.holds[i], l);
		} catch(err) {console.log(err)};
	};
	return l;
};

function moveRoom(oldRoom, newRoom) {
	currentRoom = newRoom;
};


// INPUT PARSING
function parseInput(s) {
	s = s.toLowerCase();

	if (s == 'look') {
		return currentRoom.getDescription()

	} else 

	if (s.match('look ')) {
		if (s.match('look at ')) {
			lookAt = s.split('look at ')[1]
		} else {
			lookAt = s.split('look ')[1]
		}

		best = currentRoom.bestMatch(lookAt)
		return best.getDescription()		
	} else

	{
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