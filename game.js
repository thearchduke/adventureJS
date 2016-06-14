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
	this.name = name
	this.rooms = []
	this.items = []
	this.players = []
	this.currentRoom = null

	this.getContents = function(room=this, l=[]) {
		this.holds = this.rooms
		for (var i in room.holds) {
			try {
				l.push(room.holds[i]);
				getContents(room.holds[i], l);
			} catch(err) {console.log(err)};
		};
		return l;
	};

	this.moveRoom = function(dir) {
		if (this.currentRoom.exits[dir]) {
			this.currentRoom = this.currentRoom.exits[dir]
			return this.currentRoom.getDescription()
		}
		else {
			return "there's no exit in that direction"
		}
	}

	this.parseInput = function(s) {
		s = s.toLowerCase();

		if (s == 'look') {
			return this.currentRoom.getDescription()

		} else 

		if (s.match('look ')) {
			if (s.match('look at ')) {
				lookAt = s.split('look at ')[1]
			} else {
				lookAt = s.split('look ')[1]
			}

			best = this.currentRoom.bestMatch(lookAt)
			return best.getDescription()		
		} else

		if (s == 'exits') {
			return this.currentRoom.getExits()
		} else

		if (s.match('go ')) {
			return this.moveRoom(s.split('go ')[1])
		} else

		{
			return "-";
		};
	}

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
	this.exits = {'east': null, 'west': null, 'south': null, 'north': null}

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
	}

	this.getExits = function() {
		var l = '';
		for (var dir in this.exits) {
			if (this.exits[dir]) {
				l += dir + ': ' + this.exits[dir].name + '<br/>'
			}
		}
		if (l != '') {
			return l
		} else {
			return 'no exits'
		}
	}

	this.addExit = function(room, dir) {
		this.exits[dir] = room
		if (dir == 'east') {
			room.exits['west'] = this
		}
		else if (dir == 'west') {
			room.exits['east'] = this
		}
		else if (dir == 'north') {
			room.exits['south'] = this
		}
		else if (dir == 'south') {
			room.exits['north'] = this
		}
	}

	this.removeExit = function(room, dir) {
		this.exits[dir] = null
		if (dir == 'east') {
			room.exits['west'] = null
		}
		else if (dir == 'west') {
			room.exits['east'] = null
		}
		else if (dir == 'north') {
			room.exits['south'] = null
		}
		else if (dir == 'south') {
			room.exits['north'] = null
		}
	}
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
	game.items.push(this)
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
	game.currentRoom = newRoom;
};


// INPUT PARSING
function getOutput(text) {
	return game.parseInput(text);
};

function renderOutput(text) {
	var out = $("<div>", {class: "commandResponse"});
	var firstLine = $("<span>", {class: "commandEcho", text: text});
	if (text.toLowerCase() == 'look') {
		firstLine.append($("<span>", {class: "currentRoom", text: ' (you are in ' + game.currentRoom.name + ')'}))
		// add exits
	}
	var o = getOutput(text);
	var lastLine = $("<span>", {class: "commandResponse", html: o});
	out.append([firstLine, $("<br>"), lastLine]);
	return out;
};


// INITIALIZE
game = new Game("My Game!");

// POPULATE
function populateGame() {
	limbo = new Room("limbo", "you look around and see the void behind and all around you");
	limbo2 = new Room("also limbo", "another description");
	shelf = new Item("a bookshelf", "a cheap wooden bookshelf");
	book = new Item("a yellow book", "a book about javascript programming for dummies");
	page = new Item("a page", "what it sounds like");
	addHolder(shelf, limbo);
	addHolder(book, shelf);
	addHolder(page, book);
	game.currentRoom = limbo
	limbo.addExit(limbo2, 'west')
};

function startGame() {
	$('#outputBox')
}

$(document).ready(function () {
	// DOM logic
	populateGame();
	startGame();
	/*
	$('#myButton').on('click', function() {
		command = $('#inputBox').val();//$('#inputForm').children().eq(0).val();
		$('#outputBox').prepend(renderOutput(command));
		$('#inputForm').children().eq(0).val('')
	});
	*/
	$('#inputForm').on('submit', function(e) {
		e.preventDefault();
		command = $(this).children().eq(0).val();
		$('#outputBox').prepend(renderOutput(command));
		$(this).children().eq(0).val('')
		return false;
	});
});