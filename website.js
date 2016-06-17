function authorShow(author, jsauthor) {
	$(author).on('click', function(event) {
    	event.preventDefault();

    	$(jsauthor).addClass('is-visible');
    	$('.js-modal-overlay').addClass('is-visible');
  	});
	$('.js-modal-overlay').on('click', function(event) {
		$(jsauthor).removeClass('is-visible');
    	$('.js-modal-overlay').removeClass('is-visible');
	});
}

$(document).ready(function() {
	$('.js-like').on('click', function(event) {
		event.preventDefault();
		$(this).text('Liked')
		.closest('.story-item')
		.addClass('is-liked');
	});

	// Add link
	$('.js-add-link').on('click', function(event) {
		event.preventDefault();
		$('.js-form').toggleClass('is-visible');
	});

	// Modal
	authorShow('.david', '.js-david');
	authorShow('.daniel', '.js-daniel');
	authorShow('.lucy', '.js-lucy');
});
