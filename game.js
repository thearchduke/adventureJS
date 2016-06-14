/*
A GAME THAT I'M USING TO TEACH MYSELF SOME MORE JAVASCRIPT
it's a text adventure

J. Tynan Burke

This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License. 
Copyright 2016 J. Tynan Burke
*/


// FORMATTING

function renderForOutput(text) {
	var out = $("<div>", {class: "commandResponse"});
	var firstLine = $("<span>", {class: "commandEcho", text: text});
	var secondLine = $("<span>", {class: "commandResponse", text: 'hi hi hi'});
	out.append([firstLine, $("<br>"), secondLine]);
	return out;
};


// MODELS

var Game = function(name) {
	this.name = name;
	this.rooms = [];
	this.players = [];
};

var Room = function(container=game, rooms=[]) {

	// init
	if (container) {
		this.container = container
		container.rooms.push(this);
	};

	if (Array.isArray(rooms)) {
		this.rooms = rooms
	} else {
		this.rooms = []
	};


	// functions
	this.contains = function()
	{
		console.log(this.rooms)
	};

	this.helloWorld = function() {
		alert("hello world!");
	};
};



// INITIALIZE

game = new Game("My Game!");
limbo = new Room();
limbo2 = new Room(limbo);

$(document).ready(function () {

	// DOM logic
	$('#inputForm').submit(function() {
		command = $(this).children().eq(0).val();
		$('#outputBox').append(renderForOutput(command));
		return false;
	});
});