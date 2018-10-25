

var today = new Date();
var locale = "en-us";
var year = today.getFullYear();
var month = today.toLocaleString(locale, {month: "short"});
var day = today.getDate();

var listItem = 3;
var numCompleted = 0;
var completedDisplay = $("#numComplete");


init();


function init(){
	$("h1").html(month + " " + day + ", " + year + '<i class="fas fa-plus fa-xs"></i>');
}


//The rich text paste into the contenteditable area will be adjusted to the pre-determined font style
$('ul').on('paste', '.content', function(e) {								 
    e.preventDefault();														 //prevent the "paste" of text onto the clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');	 //get the text on the clipboard
    document.execCommand('insertText', false, text);						 //re-paste the entire text onto the clipboard
});


// Overwrite the "isEmpty function" to check if the string is blank or only white-space
String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};


//Make "ul" sortable
$(function(){
	$("#container ul").sortable({
		tolerance: 'pointer',				//standard determining whether the item being moved is hovering over another item
		handle: '.dragger',					//items can only be move using the 'dragger' element
		cursor: 'move',						//cursor remains in the "move" icon until item is dropped
		axis: 'y',							//drag and drop in the vertical direction

		//to stop dragged "li" from aligning left of the screen
		stop: function( event, ui ) { 		
		    ui.item.removeAttr("style");
      	}
	});
	$( "#sortable" ).disableSelection();
});


//Double-clicking on a list item will toggle a strike-through, where "this" refers to ".content"
$("ul").on("dblclick", ".content", function(){
	if($(this).hasClass("completed")){			
		$(this).removeClass("completed");
		numCompleted--;
	}
	else{
		$(this).addClass("completed");
		numCompleted++;
	}

	updateStatus();
});


//Clicking on the delete button will fade and remove the corresponding list item
$("ul").on("click", ".delete", function(event){
	$(this).parent().fadeOut(500, function(){							//After "li" fade away:
		if($(this).children(".content").hasClass("completed")){			
			numCompleted--;
		}
		$(this).remove();
		listItem--;
		updateStatus();
	});
	event.stopPropagation();											//to prevent firing same actions of parent/ancestor elements
});


//Pressing 'enter' key on the text input for new list item will 
//1st: clear the text box, 2nd: add the item to the bottom of the list
$("input[type='text']").keypress(function(event){
	var input;
	var todo;
	var draggerHTML;
	var contentHTML;
	var deleteHTML;

	if(event.which === 13){												//13 is the "enter" key
		input = $(this).val();
		todo = input.replace(/\s\s+/g, ' ');
		draggerHTML = "<div class='dragger'><i class='fas fa-angle-right fa-sm'></i></div>";
		contentHTML = "<span class='content' contenteditable='true' spellcheck='false'>" + todo + "</span>"
		deleteHTML  = "<span class='delete'><i class='fas fa-times'></i></span>"
		$(this).val("");
		if(!todo.isEmpty()){
			$("ul").append("<li>" + draggerHTML + contentHTML + deleteHTML + "</li>");
			listItem++;
			updateStatus();
		}
	}
});


//Click 'edit' icon to fade the new listItem textInput in/out
$(".fa-plus").click(function(){
	$("input[type='text']").fadeToggle();
});


//Click "clear" to remove completed tasks
$("#clear").click(function(){
	$(".content").each(function(){				//check each list item
		if($(this).hasClass("completed")){		//"this" = ".content"/listItem
			$(this).parent().remove();			//remove entire "li"
		}
	});

	listItem = listItem - numCompleted;			
	numCompleted = 0;
	updateStatus();
});


function updateStatus(){
	if($("li").length === 0){
		completedDisplay.text(numCompleted + "/" + listItem + " Completed");
	}
	else if(numCompleted === listItem){
		completedDisplay.text("All Completed!");
	}
	else{
		completedDisplay.text(numCompleted + "/" + listItem + " Completed");		
	}
}