/**
* Calls the server endpoint to get the list of people visible to this app.
*/
people: function() {
	$.ajax({
		type: 'GET',
		url: window.location.href + 'people',
		contentType: 'application/octet-stream; charset=utf-8',
		success: function(result) {
			helper.appendCircled(result);
		},
		processData: false
	});
},
/**
* Displays visible People retrieved from server.
*
* @param {Object} people A list of Google+ Person resources.
*/
appendCircled: function(people) {
	$('#visiblePeople').empty();

	$('#visiblePeople').append('Number of people visible to this app: ' +
			people.totalItems + '<br/>');
	for (var personIndex in people.items) {
		person = people.items[personIndex];
		$('#visiblePeople').append('<img src="' + person.image.url + '">');
	}
},
