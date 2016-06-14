/*
A GAME THAT I'M USING TO TEACH MYSELF SOME MORE JAVASCRIPT
it's a text adventure

A certain accident prone, curmudgeonly, but really big hearted blogger/blog owner 
gets sucked through a dimensional rift while trying to rescue a wayward dog. 
Once on the other side he, and his now faithful canine companion, 
have to rescue a kingdom by freeing the secret for making mustard from an evil tyrant.

On second thought no one would buy an accident prone, 
curmudgeonly, 
but really big hearted blogger/blog owner 
who has a penchant for rescuing wayward dogs and likes mustard. 

I think you can probably sell the dimension rift thing. That’s plausible.

Perhaps after he gets sucked through the dimensional rift 
he comes to naked in a bathroom with a torn rotator cuff(?) and a broken mop. Puzzle time!!
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

		if (s.match('open ')) {
			opening = s.split('open ')[1]
			best = this.currentRoom.bestMatch(opening)
			best.open = true

			if (best == back_door) {
				kitchen.description = "You are in the kitchen. \
		There's a fridge and stuff, some cabinets. The back door is open! Rosie ran out to the back yard!"
				kitchen.addExit(backyard, 'south')
				return kitchen.getDescription()
			}

			return best.getDescription()
		} else

		if (s.match('close ')) {
			opening = s.split('close ')[1]
			best = this.currentRoom.bestMatch(opening)
			best.open = false

			if (best == back_door) {
				kitchen.description = "You are in the kitchen. \
		There's a fridge and stuff, some cabinets. The back door is closed, but Rosie is still in the yard."
				kitchen.removeExit(backyard, 'south')
				return kitchen.getDescription()
			}
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
	this.name = name
	this.holder = null
	this.holds = []
	game.items.push(this)
	this.container = null
	this.player = null
	this.quantity = 1
	this.description = description
	this.open = true
	this.closable = false
	this.closed_description = ''

	this.getDescription = function() {
		var l;
		//console.log(this.holds)

		if (this.open == false) {
			return this.closed_description + " It is closed."
		}

		if (this.holds.length > 0) {
			l = '<br/>it holds:'
			for (var i in this.holds) {
				l += '<br/>--' + this.holds[i].name;
			};
		};

		if (l) {
			if (this.open && this.closable) 
				{return this.description + " It is open." + l}
		 else {
		return this.description
			}
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
	rosie_in_kitchen = true
	kitchen = new Room("The kitchen", "You are in the kitchen. \
		There's a fridge and stuff, some cabinets. You can see Rosie. The back door is closed.")
	backyard = new Room("The back yard", "The sunshine hits your face as you step into the back yard. \
		It's kind of nice, by West Virginia standards.")
	bathroom = new Room("The bathroom", "You're in the bathroom. It's alright I guess. The floor really needs new tiles though.")

	kitchen.addExit(bathroom, 'east')

	mop = new Item("A mop", "It's a mop. Moppity mop mop.")
	addHolder(mop, bathroom)

	cabinet = new Item("The kitchen cabinet", "It's vintage. (It's old.)")
	cabinet.open = false
	cabinet.closable = true
	addHolder(cabinet, kitchen)

	fridge = new Item("The refrigerator", "Inside of the refrigerator is a feast fit for a king! And two dogs, and a cat. \
		The feast is suitable for two dogs and a cat, that is. They're not inside the fridge.")
	fridge.closed_description = "A slightly-used Kenmore. One of the white ones, with the weird \
		mottled surface. Slightly dusty. (Just a little.) Some frat kid's handprints are on it."
	fridge.open = false
	fridge.closable = true

	no_mustard = new Item("No mustard", "A distinct lack of mustard.")
	addHolder(no_mustard, cabinet)

	back_door = new Item("The back door", "The door to the backyard.")
	back_door.open = false
	back_door.closable = true
	addHolder(back_door, kitchen)

	game.currentRoom = kitchen
};

/*
function populateGame() {
	limbo = new Room("limbo", "you look around and see the void behind and all around you.");
	limbo2 = new Room("also limbo", "another description");
	shelf = new Item("a bookshelf", "a cheap wooden bookshelf.");
	book = new Item("a yellow book", "a book about javascript programming for dummies");
	page = new Item("a page", "what it sounds like");
	addHolder(shelf, limbo);
	addHolder(book, shelf);
	addHolder(page, book);
	shelf.open = false
	shelf.closable = true
	game.currentRoom = limbo
	limbo.addExit(limbo2, 'west')
};
*/

function startText(text, time, decoration=null) {
	if (decoration) {
		text = '<' + decoration + '>' + text + '</' + decoration + '>'
	}
	setTimeout(function() {
		$('#prologueBox').append(text);
		}, time);
}

function startGame() {
	startText("An 'adventure' 'game'", 300, 'h1')
	startText("enjoy?", 4000, 'h4')
	startText("Once upon a time...", 500, 'h3')
	startText("A certain accident prone,", 600, 'p')
	startText("curmudgeonly,", 700, 'p')
	startText("but really big hearted", 800, 'p')
	startText("Blogger/Blog Owner", 900, 'h3')
	startText("gets sucked through a dimensional rift while trying to rescue a wayward dog. Once on the other side he, and his now faithful canine companion, have to rescue a kingdom by freeing the secret for making mustard from an evil tyrant.", 1000, 'p')
	startText("On second thought,", 1100, 'h3')
	startText("no one would buy", 1200, 'h4')
	startText("An accident prone,", 1300, 'p')
	startText("curmudgeonly,", 1400, 'p')
	startText("but really big hearted Blogger/Blog Owner", 1500, 'h4')
	startText("who has a penchant for rescuing wayward dogs and likes mustard.", 1600, 'p')
	startText("<br/><br/>I think you can probably sell the dimension rift thing. That's plausible.", 1700, 'h3')
	startText("--Adam L. Silverman", 1800, 'h4')
	setTimeout(function() {
		$('#outputBox').append(renderOutput('look'));
	}, 1900);
	/*
	startText("An 'adventure' 'game'", 300, 'h1')
	startText("enjoy?", 1000, 'h4')
	startText("Once upon a time...", 2000, 'h3')
	startText("A certain accident prone,", 2600, 'p')
	startText("curmudgeonly,", 3200, 'p')
	startText("but really big hearted", 3800, 'p')
	startText("Blogger/Blog Owner", 4400, 'h3')
	startText("gets sucked through a dimensional rift while trying to rescue a wayward dog. Once on the other side he, and his now faithful canine companion, have to rescue a kingdom by freeing the secret for making mustard from an evil tyrant.", 5000, 'p')
	startText("On second thought,", 10000, 'h3')
	startText("no one would buy", 10600, 'h4')
	startText("An accident prone,", 11200, 'p')
	startText("curmudgeonly,", 11800, 'p')
	startText("but really big hearted Blogger/Blog Owner", 12400, 'h4')
	startText("who has a penchant for rescuing wayward dogs and likes mustard.", 13000, 'p')
	startText("<br/><br/>I think you can probably sell the dimension rift thing. That's plausible.", 15000, 'h3')
	startText("--Adam L. Silverman", 17000, 'h4')

	*/
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
		command = $(this).children().eq(0).val()
		$('#outputBox').append(renderOutput(command))
		$("#outputBox").scrollTop($("#outputBox")[0].scrollHeight);
		$(this).children().eq(0).val('')
		return false;
	});
});