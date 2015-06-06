var v = [];

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    	results = regex.exec(location.search);

	v.push(regex); v.push(results);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};


// HELPER
function elem(name){
	return document.getElementById(name);
};

function createListener(element, callback){
	elem(element).addEventListener("click", callback, false);
};

createListener("btnCUrl", function(){
	var param = getParameterByName("name");
	
	elem("dvUrlResults").textContent = param;
});

// TESTING FOR RESPONSE PASSING TO SERVER
createListener("btnJQResquest", function(){
	var requestFrom = { url: encodeURIComponent( elem("dvJQRequest").value )};
	
	request("Request", "POST", requestFrom, function(data){
		alert(data);
	});
});

function updateUI(name, context){
	elem(name).innerHTML = context;
};

function request(urlString, methodString, param, callback){
	
	var options = {
		url: urlString,
		method: methodString,
		data: param,
		success: callback,
		error: function(e){
			console.error("Error Occurred: " + e);
		}
	}
	
	$.ajax(options);
};
