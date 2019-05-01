'use strict';

/**
 * Accordion block functionality
 *
 * @author Shannon MacMillan, Corey Collins
 */
window.accordionBlockToggle = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			html: $('html'),
			accordion: $('.accordion'),
			items: $('.accordion-item'),
			headers: $('.accordion-item-header'),
			contents: $('.accordion-item-content'),
			button: $('.accordion-item-toggle'),
			anchorID: $(window.location.hash)
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.headers.on('click touchstart', app.toggleAccordion);
		app.$c.button.on('click touchstart', app.toggleAccordion);
		app.$c.window.on('load', app.openHashAccordion);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.accordion.length;
	};

	app.toggleAccordion = function () {

		// Add the open class to the item.
		$(this).parents('.accordion-item').toggleClass('open');

		// Is this one expanded?
		var isExpanded = $(this).parents('.accordion-item').hasClass('open');

		// Set this button's aria-expanded value.
		$(this).parents('.accordion-item').find('.accordion-item-toggle').attr('aria-expanded', isExpanded ? 'true' : 'false');

		// Set all other items in this block to aria-hidden=true.
		$(this).parents('.accordion-block').find('.accordion-item-content').not($(this).parents('.accordion-item')).attr('aria-hidden', 'true');

		// Set this item to aria-hidden=false.
		$(this).parents('.accordion-item').find('.accordion-item-content').attr('aria-hidden', isExpanded ? 'false' : 'true');

		// Hide the other panels.
		$(this).parents('.accordion-block').find('.accordion-item').not($(this).parents('.accordion-item')).removeClass('open');
		$(this).parents('.accordion-block').find('.accordion-item-toggle').not($(this)).attr('aria-expanded', 'false');

		return false;
	};

	app.openHashAccordion = function () {

		if (!app.$c.anchorID.selector) {
			return;
		}

		// Trigger a click on the button closest to this accordion.
		app.$c.anchorID.parents('.accordion-item').find('.accordion-item-toggle').trigger('click');

		// Not setting a cached variable as it doesn't seem to grab the height properly.
		var adminBarHeight = $('#wpadminbar').length ? $('#wpadminbar').height() : 0;

		// Animate to the div for a nicer experience.
		app.$c.html.animate({
			scrollTop: app.$c.anchorID.offset().top - adminBarHeight
		}, 'slow');
	};

	// Engage
	app.init();
})(window, jQuery, window.accordionBlockToggle);
'use strict';

/**
 * File carousel.js
 *
 * Deal with the Slick carousel.
 */
window.wdsCarousel = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			theCarousel: $('.carousel-block')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.doSlick);
		app.$c.window.on('load', app.doFirstAnimation);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.theCarousel.length;
	};

	// Animate the first slide on window load.
	app.doFirstAnimation = function () {

		// Get the first slide content area and animation attribute.
		var firstSlide = app.$c.theCarousel.find('[data-slick-index=0]'),
			firstSlideContent = firstSlide.find('.slide-content'),
			firstAnimation = firstSlideContent.attr('data-animation');

		// Add the animation class to the first slide.
		firstSlideContent.addClass(firstAnimation);
	};

	// Animate the slide content.
	app.doAnimation = function () {
		var slides = $(this).find('.slide'),
			activeSlide = $(this).find('.slick-current'),
			activeContent = activeSlide.find('.slide-content'),


		// This is a string like so: 'animated someCssClass'.
		animationClass = activeContent.attr('data-animation');

		if (undefined === animationClass) {
			return;
		}

		var splitAnimation = animationClass.split(' '),


		// This is the 'animated' class.
		animationTrigger = splitAnimation[0];

		// Go through each slide to see if we've already set animation classes.
		slides.each(function () {
			var slideContent = $(this).find('.slide-content');

			// If we've set animation classes on a slide, remove them.
			if (slideContent.hasClass('animated')) {

				// Get the last class, which is the animate.css class.
				var lastClass = slideContent.attr('class').split(' ').pop();

				// Remove both animation classes.
				slideContent.removeClass(lastClass).removeClass(animationTrigger);
			}
		});

		// Add animation classes after slide is in view.
		activeContent.addClass(animationClass);
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function () {

		// Get all the videos in our slides object.
		$('video').each(function () {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		});
	};

	// Kick off Slick.
	app.doSlick = function () {
		app.$c.theCarousel.on('init', app.playBackgroundVideos);

		app.$c.theCarousel.slick({
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: true,
			dots: true,
			focusOnSelect: true,
			waitForAnimate: true
		});

		app.$c.theCarousel.on('afterChange', app.doAnimation);
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsCarousel);
'use strict';

/**
 * Show/Hide the Search Form in the header.
 *
 * @author Corey Collins
 */
window.ShowHideSearchForm = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			body: $('body'),
			headerSearchToggle: $('.site-header-action .cta-button'),
			headerSearchForm: $('.site-header-action .form-container')
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.headerSearchToggle.on('keyup touchstart click', app.showHideSearchForm);
		app.$c.body.on('keyup touchstart click', app.hideSearchForm);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.headerSearchToggle.length;
	};

	// Checks to see if the menu has been opened.
	app.searchIsOpen = function () {

		if (app.$c.body.hasClass('search-form-visible')) {
			return true;
		}

		return false;
	};

	// Adds the toggle class for the search form.
	app.showHideSearchForm = function () {
		app.$c.body.toggleClass('search-form-visible');

		app.toggleSearchFormAriaLabel();
		app.toggleSearchToggleAriaLabel();

		return false;
	};

	// Hides the search form if we click outside of its container.
	app.hideSearchForm = function (event) {

		if (!$(event.target).parents('div').hasClass('site-header-action')) {
			app.$c.body.removeClass('search-form-visible');
			app.toggleSearchFormAriaLabel();
			app.toggleSearchToggleAriaLabel();
		}
	};

	// Toggles the aria-hidden label on the form container.
	app.toggleSearchFormAriaLabel = function () {
		app.$c.headerSearchForm.attr('aria-hidden', app.searchIsOpen() ? 'false' : 'true');
	};

	// Toggles the aria-hidden label on the toggle button.
	app.toggleSearchToggleAriaLabel = function () {
		app.$c.headerSearchToggle.attr('aria-expanded', app.searchIsOpen() ? 'true' : 'false');
	};

	// Engage
	$(app.init);
})(window, jQuery, window.ShowHideSearchForm);
'use strict';

/**
 * File js-enabled.js
 *
 * If Javascript is enabled, replace the <body> class "no-js".
 */
document.body.className = document.body.className.replace('no-js', 'js');
'use strict';

/**
 * File: mobile-menu.js
 *
 * Create an accordion style dropdown.
 */
window.wdsMobileMenu = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			body: $('body'),
			window: $(window),
			subMenuContainer: $('.mobile-menu .sub-menu, .utility-navigation .sub-menu'),
			subSubMenuContainer: $('.mobile-menu .sub-menu .sub-menu'),
			subMenuParentItem: $('.mobile-menu li.menu-item-has-children, .utility-navigation li.menu-item-has-children'),
			offCanvasContainer: $('.off-canvas-container')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDownArrow);
		app.$c.subMenuParentItem.on('click', app.toggleSubmenu);
		app.$c.subMenuParentItem.on('transitionend', app.resetSubMenu);
		app.$c.offCanvasContainer.on('transitionend', app.forceCloseSubmenus);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.subMenuContainer.length;
	};

	// Reset the submenus after it's done closing.
	app.resetSubMenu = function () {

		// When the list item is done transitioning in height,
		// remove the classes from the submenu so it is ready to toggle again.
		if ($(this).is('li.menu-item-has-children') && !$(this).hasClass('is-visible')) {
			$(this).find('ul.sub-menu').removeClass('slideOutLeft is-visible');
		}
	};

	// Slide out the submenu items.
	app.slideOutSubMenus = function (el) {

		// If this item's parent is visible and this is not, bail.
		if (el.parent().hasClass('is-visible') && !el.hasClass('is-visible')) {
			return;
		}

		// If this item's parent is visible and this item is visible, hide its submenu then bail.
		if (el.parent().hasClass('is-visible') && el.hasClass('is-visible')) {
			el.removeClass('is-visible').find('.sub-menu').removeClass('slideInLeft').addClass('slideOutLeft');
			return;
		}

		app.$c.subMenuContainer.each(function () {

			// Only try to close submenus that are actually open.
			if ($(this).hasClass('slideInLeft')) {

				// Close the parent list item, and set the corresponding button aria to false.
				$(this).parent().removeClass('is-visible').find('.parent-indicator').attr('aria-expanded', false);

				// Slide out the submenu.
				$(this).removeClass('slideInLeft').addClass('slideOutLeft');
			}
		});
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function () {

		app.$c.subMenuParentItem.find('a:first').after('<button type="button" aria-expanded="false" class="parent-indicator" aria-label="Open submenu"><span class="down-arrow"></span></button>');
	};

	// Deal with the submenu.
	app.toggleSubmenu = function (e) {

		var el = $(this),
			// The menu element which was clicked on.
		subMenu = el.children('ul.sub-menu'),
			// The nearest submenu.
		$target = $(e.target); // the element that's actually being clicked (child of the li that triggered the click event).

		// Figure out if we're clicking the button or its arrow child,
		// if so, we can just open or close the menu and bail.
		if ($target.hasClass('down-arrow') || $target.hasClass('parent-indicator')) {

			// First, collapse any already opened submenus.
			app.slideOutSubMenus(el);

			if (!subMenu.hasClass('is-visible')) {

				// Open the submenu.
				app.openSubmenu(el, subMenu);
			}

			return false;
		}
	};

	// Open a submenu.
	app.openSubmenu = function (parent, subMenu) {

		// Expand the list menu item, and set the corresponding button aria to true.
		parent.addClass('is-visible').find('.parent-indicator').attr('aria-expanded', true);

		// Slide the menu in.
		subMenu.addClass('is-visible animated slideInLeft');
	};

	// Force close all the submenus when the main menu container is closed.
	app.forceCloseSubmenus = function (event) {
		if ($(event.target).hasClass('off-canvas-container')) {

			// Focus offcanvas menu for a11y.
			app.$c.offCanvasContainer.focus();

			// The transitionend event triggers on open and on close, need to make sure we only do this on close.
			if (!$(this).hasClass('is-visible')) {
				app.$c.subMenuParentItem.removeClass('is-visible').find('.parent-indicator').attr('aria-expanded', false);
				app.$c.subMenuContainer.removeClass('is-visible slideInLeft');
				app.$c.body.css('overflow', 'visible');
				app.$c.body.unbind('touchstart');
			}

			if ($(this).hasClass('is-visible')) {
				app.$c.body.css('overflow', 'hidden');
				app.$c.body.bind('touchstart', function (e) {
					if (!$(e.target).parents('.contact-modal')[0]) {
						e.preventDefault();
					}
				});
			}
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsMobileMenu);
'use strict';

/**
 * File modal.js
 *
 * Deal with multiple modals and their media.
 */
window.wdsModal = {};
(function (window, $, app) {

	var $modalToggle = void 0,
		$focusableChildren = void 0,
		$player = void 0,
		$tag = document.createElement('script'),
		$firstScriptTag = document.getElementsByTagName('script')[0],
		YT = void 0;

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			$firstScriptTag.parentNode.insertBefore($tag, $firstScriptTag);
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			'body': $('body')
		};
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return $('.modal-trigger').length;
	};

	// Combine all events.
	app.bindEvents = function () {

		// Trigger a modal to open.
		app.$c.body.on('click touchstart', '.modal-trigger', app.openModal);

		// Trigger the close button to close the modal.
		app.$c.body.on('click touchstart', '.close', app.closeModal);

		// Allow the user to close the modal by hitting the esc key.
		app.$c.body.on('keydown', app.escKeyClose);

		// Allow the user to close the modal by clicking outside of the modal.
		app.$c.body.on('click touchstart', 'div.modal-open', app.closeModalByClick);

		// Listen to tabs, trap keyboard if we need to
		app.$c.body.on('keydown', app.trapKeyboardMaybe);
	};

	// Open the modal.
	app.openModal = function () {

		// Store the modal toggle element
		$modalToggle = $(this);

		// Figure out which modal we're opening and store the object.
		var $modal = $($(this).data('target'));

		// Display the modal.
		$modal.addClass('modal-open');

		// Add body class.
		app.$c.body.addClass('modal-open');

		// Find the focusable children of the modal.
		// This list may be incomplete, really wish jQuery had the :focusable pseudo like jQuery UI does.
		// For more about :input see: https://api.jquery.com/input-selector/
		$focusableChildren = $modal.find('a, :input, [tabindex]');

		// Ideally, there is always one (the close button), but you never know.
		if (0 < $focusableChildren.length) {

			// Shift focus to the first focusable element.
			$focusableChildren[0].focus();
		}
	};

	// Close the modal.
	app.closeModal = function () {

		// Figure the opened modal we're closing and store the object.
		var $modal = $($('div.modal-open .close').data('target')),


		// Find the iframe in the $modal object.
		$iframe = $modal.find('iframe');

		// Only do this if there are any iframes.
		if ($iframe.length) {

			// Get the iframe src URL.
			var url = $iframe.attr('src');

			// Removing/Readding the URL will effectively break the YouTube API.
			// So let's not do that when the iframe URL contains the enablejsapi parameter.
			if (!url.includes('enablejsapi=1')) {

				// Remove the source URL, then add it back, so the video can be played again later.
				$iframe.attr('src', '').attr('src', url);
			} else {

				// Use the YouTube API to stop the video.
				$player.stopVideo();
			}
		}

		// Finally, hide the modal.
		$modal.removeClass('modal-open');

		// Remove the body class.
		app.$c.body.removeClass('modal-open');

		// Revert focus back to toggle element
		$modalToggle.focus();
	};

	// Close if "esc" key is pressed.
	app.escKeyClose = function (event) {
		if (27 === event.keyCode) {
			app.closeModal();
		}
	};

	// Close if the user clicks outside of the modal
	app.closeModalByClick = function (event) {

		// If the parent container is NOT the modal dialog container, close the modal
		if (!$(event.target).parents('div').hasClass('modal-dialog')) {
			app.closeModal();
		}
	};

	// Trap the keyboard into a modal when one is active.
	app.trapKeyboardMaybe = function (event) {

		// We only need to do stuff when the modal is open and tab is pressed.
		if (9 === event.which && 0 < $('.modal-open').length) {
			var $focused = $(':focus'),
				focusIndex = $focusableChildren.index($focused);

			if (0 === focusIndex && event.shiftKey) {

				// If this is the first focusable element, and shift is held when pressing tab, go back to last focusable element.
				$focusableChildren[$focusableChildren.length - 1].focus();
				event.preventDefault();
			} else if (!event.shiftKey && focusIndex === $focusableChildren.length - 1) {

				// If this is the last focusable element, and shift is not held, go back to the first focusable element.
				$focusableChildren[0].focus();
				event.preventDefault();
			}
		}
	};

	// Hook into YouTube <iframe>.
	app.onYouTubeIframeAPIReady = function () {
		var $modal = $('div.modal'),
			$iframeid = $modal.find('iframe').attr('id');

		$player = new YT.Player($iframeid, {
			events: {
				'onReady': app.onPlayerReady,
				'onStateChange': app.onPlayerStateChange
			}
		});
	};

	// Do something on player ready.
	app.onPlayerReady = function () {};

	// Do something on player state change.
	app.onPlayerStateChange = function () {

		// Set focus to the first focusable element inside of the modal the player is in.
		$(event.target.a).parents('.modal').find('a, :input, [tabindex]').first().focus();
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsModal);
'use strict';

/**
 * File: navigation-primary.js
 *
 * Helpers for the primary navigation.
 */
window.wdsPrimaryNavigation = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			subMenuContainer: $('.main-navigation .sub-menu'),
			subMenuParentItem: $('.main-navigation li.menu-item-has-children')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDownArrow);
		app.$c.subMenuParentItem.find('a').on('focusin focusout', app.toggleFocus);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.subMenuContainer.length;
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function () {
		app.$c.subMenuParentItem.find('> a').append('<span class="caret-down" aria-hidden="true"></span>');
	};

	// Toggle the focus class on the link parent.
	app.toggleFocus = function () {
		$(this).parents('li.menu-item-has-children').toggleClass('focus');
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsPrimaryNavigation);
'use strict';

/**
 * File: off-canvas.js
 *
 * Help deal with the off-canvas mobile menu.
 */
window.wdsoffCanvas = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			body: $('body'),
			offCanvasClose: $('.off-canvas-close'),
			offCanvasContainer: $('.off-canvas-container'),
			offCanvasOpen: $('.off-canvas-open'),
			offCanvasScreen: $('.off-canvas-screen')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.body.on('keydown', app.escKeyClose);
		app.$c.offCanvasClose.on('click', app.closeoffCanvas);
		app.$c.offCanvasOpen.on('click', app.toggleoffCanvas);
		app.$c.offCanvasScreen.on('click', app.closeoffCanvas);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.offCanvasContainer.length;
	};

	// To show or not to show?
	app.toggleoffCanvas = function () {

		if ('true' === $(this).attr('aria-expanded')) {
			app.closeoffCanvas();
		} else {
			app.openoffCanvas();
		}
	};

	// Show that drawer!
	app.openoffCanvas = function () {
		app.$c.offCanvasContainer.addClass('is-visible');
		app.$c.offCanvasOpen.addClass('is-visible');
		app.$c.offCanvasScreen.addClass('is-visible');

		app.$c.offCanvasOpen.attr('aria-expanded', true);
		app.$c.offCanvasContainer.attr('aria-hidden', false);
	};

	// Close that drawer!
	app.closeoffCanvas = function () {
		app.$c.offCanvasContainer.removeClass('is-visible');
		app.$c.offCanvasOpen.removeClass('is-visible');
		app.$c.offCanvasScreen.removeClass('is-visible');

		app.$c.offCanvasOpen.attr('aria-expanded', false);
		app.$c.offCanvasContainer.attr('aria-hidden', true);

		app.$c.offCanvasOpen.focus();
	};

	// Close drawer if "esc" key is pressed.
	app.escKeyClose = function (event) {
		if (27 === event.keyCode) {
			app.closeoffCanvas();
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsoffCanvas);
'use strict';

/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
	var isWebkit = -1 < navigator.userAgent.toLowerCase().indexOf('webkit'),
		isOpera = -1 < navigator.userAgent.toLowerCase().indexOf('opera'),
		isIe = -1 < navigator.userAgent.toLowerCase().indexOf('msie');

	if ((isWebkit || isOpera || isIe) && document.getElementById && window.addEventListener) {
		window.addEventListener('hashchange', function () {
			var id = location.hash.substring(1),
				element;

			if (!/^[A-z0-9_-]+$/.test(id)) {
				return;
			}

			element = document.getElementById(id);

			if (element) {
				if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false);
	}
})();
'use strict';

/**
 * Make tables responsive again.
 *
 * @author Haris Zulfiqar
 */
window.wdsTables = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			table: $('table')
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDataLabel);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.table.length;
	};

	// Adds data-label to td based on th.
	app.addDataLabel = function () {
		var table = app.$c.table;
		var tableHeaders = table.find('thead th');
		var tableRow = table.find('tbody tr');

		tableRow.each(function () {
			var td = $(this).find('td');

			td.each(function (index) {
				if ($(tableHeaders.get(index))) {
					$(this).attr('data-label', $(tableHeaders.get(index)).text());
				}
			});
		});

		return false;
	};

	// Engage
	$(app.init);
})(window, jQuery, window.wdsTables);
'use strict';

/**
 * Video Playback Script.
 */
window.WDSVideoBackgroundObject = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			videoButton: $('.video-toggle')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.videoButton.on('click', app.doTogglePlayback);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.videoButton.length;
	};

	// Video Playback.
	app.doTogglePlayback = function () {
		$(this).parents('.content-block').toggleClass('video-toggled');

		if ($(this).parents('.content-block').hasClass('video-toggled')) {
			$(this).siblings('.video-background').trigger('pause');
		} else {
			$(this).siblings('.video-background').trigger('play');
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.WDSVideoBackgroundObject);
'use strict';

/**
 * File window-ready.js
 *
 * Add a "ready" class to <body> when window is ready.
 */
window.wdsWindowReady = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();
		app.bindEvents();
	};

	// Cache document elements.
	app.cache = function () {
		app.$c = {
			'window': $(window),
			'body': $(document.body)
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.load(app.addBodyClass);
	};

	// Add a class to <body>.
	app.addBodyClass = function () {
		app.$c.body.addClass('ready');
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsWindowReady);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ0YWJsZS5qcyIsInZpZGVvLmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImFjY29yZGlvbkJsb2NrVG9nZ2xlIiwiJCIsImFwcCIsImluaXQiLCJjYWNoZSIsIm1lZXRzUmVxdWlyZW1lbnRzIiwiYmluZEV2ZW50cyIsIiRjIiwiaHRtbCIsImFjY29yZGlvbiIsIml0ZW1zIiwiaGVhZGVycyIsImNvbnRlbnRzIiwiYnV0dG9uIiwiYW5jaG9ySUQiLCJsb2NhdGlvbiIsImhhc2giLCJvbiIsInRvZ2dsZUFjY29yZGlvbiIsIm9wZW5IYXNoQWNjb3JkaW9uIiwibGVuZ3RoIiwicGFyZW50cyIsInRvZ2dsZUNsYXNzIiwiaXNFeHBhbmRlZCIsImhhc0NsYXNzIiwiZmluZCIsImF0dHIiLCJub3QiLCJyZW1vdmVDbGFzcyIsInNlbGVjdG9yIiwidHJpZ2dlciIsImFkbWluQmFySGVpZ2h0IiwiaGVpZ2h0IiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImpRdWVyeSIsIndkc0Nhcm91c2VsIiwidGhlQ2Fyb3VzZWwiLCJkb1NsaWNrIiwiZG9GaXJzdEFuaW1hdGlvbiIsImZpcnN0U2xpZGUiLCJmaXJzdFNsaWRlQ29udGVudCIsImZpcnN0QW5pbWF0aW9uIiwiYWRkQ2xhc3MiLCJkb0FuaW1hdGlvbiIsInNsaWRlcyIsImFjdGl2ZVNsaWRlIiwiYWN0aXZlQ29udGVudCIsImFuaW1hdGlvbkNsYXNzIiwidW5kZWZpbmVkIiwic3BsaXRBbmltYXRpb24iLCJzcGxpdCIsImFuaW1hdGlvblRyaWdnZXIiLCJlYWNoIiwic2xpZGVDb250ZW50IiwibGFzdENsYXNzIiwicG9wIiwicGxheUJhY2tncm91bmRWaWRlb3MiLCJwbGF5Iiwic2xpY2siLCJhdXRvcGxheSIsImF1dG9wbGF5U3BlZWQiLCJhcnJvd3MiLCJkb3RzIiwiZm9jdXNPblNlbGVjdCIsIndhaXRGb3JBbmltYXRlIiwiU2hvd0hpZGVTZWFyY2hGb3JtIiwiYm9keSIsImhlYWRlclNlYXJjaFRvZ2dsZSIsImhlYWRlclNlYXJjaEZvcm0iLCJzaG93SGlkZVNlYXJjaEZvcm0iLCJoaWRlU2VhcmNoRm9ybSIsInNlYXJjaElzT3BlbiIsInRvZ2dsZVNlYXJjaEZvcm1BcmlhTGFiZWwiLCJ0b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwiLCJldmVudCIsInRhcmdldCIsImRvY3VtZW50IiwiY2xhc3NOYW1lIiwicmVwbGFjZSIsIndkc01vYmlsZU1lbnUiLCJzdWJNZW51Q29udGFpbmVyIiwic3ViU3ViTWVudUNvbnRhaW5lciIsInN1Yk1lbnVQYXJlbnRJdGVtIiwib2ZmQ2FudmFzQ29udGFpbmVyIiwiYWRkRG93bkFycm93IiwidG9nZ2xlU3VibWVudSIsInJlc2V0U3ViTWVudSIsImZvcmNlQ2xvc2VTdWJtZW51cyIsImlzIiwic2xpZGVPdXRTdWJNZW51cyIsImVsIiwicGFyZW50IiwiYWZ0ZXIiLCJlIiwic3ViTWVudSIsImNoaWxkcmVuIiwiJHRhcmdldCIsIm9wZW5TdWJtZW51IiwiZm9jdXMiLCJjc3MiLCJ1bmJpbmQiLCJiaW5kIiwicHJldmVudERlZmF1bHQiLCJ3ZHNNb2RhbCIsIiRtb2RhbFRvZ2dsZSIsIiRmb2N1c2FibGVDaGlsZHJlbiIsIiRwbGF5ZXIiLCIkdGFnIiwiY3JlYXRlRWxlbWVudCIsIiRmaXJzdFNjcmlwdFRhZyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiWVQiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwib3Blbk1vZGFsIiwiY2xvc2VNb2RhbCIsImVzY0tleUNsb3NlIiwiY2xvc2VNb2RhbEJ5Q2xpY2siLCJ0cmFwS2V5Ym9hcmRNYXliZSIsIiRtb2RhbCIsImRhdGEiLCIkaWZyYW1lIiwidXJsIiwiaW5jbHVkZXMiLCJzdG9wVmlkZW8iLCJrZXlDb2RlIiwid2hpY2giLCIkZm9jdXNlZCIsImZvY3VzSW5kZXgiLCJpbmRleCIsInNoaWZ0S2V5Iiwib25Zb3VUdWJlSWZyYW1lQVBJUmVhZHkiLCIkaWZyYW1laWQiLCJQbGF5ZXIiLCJldmVudHMiLCJvblBsYXllclJlYWR5Iiwib25QbGF5ZXJTdGF0ZUNoYW5nZSIsImEiLCJmaXJzdCIsIndkc1ByaW1hcnlOYXZpZ2F0aW9uIiwidG9nZ2xlRm9jdXMiLCJhcHBlbmQiLCJ3ZHNvZmZDYW52YXMiLCJvZmZDYW52YXNDbG9zZSIsIm9mZkNhbnZhc09wZW4iLCJvZmZDYW52YXNTY3JlZW4iLCJjbG9zZW9mZkNhbnZhcyIsInRvZ2dsZW9mZkNhbnZhcyIsIm9wZW5vZmZDYW52YXMiLCJpc1dlYmtpdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsImlzT3BlcmEiLCJpc0llIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiaWQiLCJzdWJzdHJpbmciLCJlbGVtZW50IiwidGVzdCIsInRhZ05hbWUiLCJ0YWJJbmRleCIsIndkc1RhYmxlcyIsInRhYmxlIiwiYWRkRGF0YUxhYmVsIiwidGFibGVIZWFkZXJzIiwidGFibGVSb3ciLCJ0ZCIsImdldCIsInRleHQiLCJXRFNWaWRlb0JhY2tncm91bmRPYmplY3QiLCJ2aWRlb0J1dHRvbiIsImRvVG9nZ2xlUGxheWJhY2siLCJzaWJsaW5ncyIsIndkc1dpbmRvd1JlYWR5IiwibG9hZCIsImFkZEJvZHlDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7QUFLQUEsT0FBT0Msb0JBQVAsR0FBOEIsRUFBOUI7QUFDRSxXQUFVRCxNQUFWLEVBQWtCRSxDQUFsQixFQUFxQkMsR0FBckIsRUFBMkI7O0FBRTVCO0FBQ0FBLEtBQUlDLElBQUosR0FBVyxZQUFXO0FBQ3JCRCxNQUFJRSxLQUFK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aUIsWUFBVztBQUMzQkosTUFBSUssRUFBSixDQUFPUixNQUFQLENBQWNxTCxJQUFkLENBQW9CbEwsSUFBSW1MLFlBQXhCO0FBQ0EsRUFGRDs7QUFJQTtBQUNBbkwsS0FBSW1MLFlBQUosR0FBbUIsWUFBVztBQUM3Qm5MLE1BQUlLLEVBQUosQ0FBTzhELElBQVAsQ0FBWXhCLFFBQVosQ0FBc0IsT0FBdEI7QUFDQSxFQUZEOztBQUlBO0FBQ0E1QyxHQUFHQyxJQUFJQyxJQUFQO0FBQ0EsQ0E1QkMsRUE0QkNKLE1BNUJELEVBNEJTc0MsTUE1QlQsRUE0QmlCdEMsT0FBT29MLGNBNUJ4QixDQUFGIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEFjY29yZGlvbiBibG9jayBmdW5jdGlvbmFsaXR5XG4gKlxuICogQGF1dGhvciBTaGFubm9uIE1hY01pbGxhbiwgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuYWNjb3JkaW9uQmxvY2tUb2dnbGUgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3Ncblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdGh0bWw6ICQoICdodG1sJyApLFxuXHRcdFx0YWNjb3JkaW9uOiAkKCAnLmFjY29yZGlvbicgKSxcblx0XHRcdGl0ZW1zOiAkKCAnLmFjY29yZGlvbi1pdGVtJyApLFxuXHRcdFx0aGVhZGVyczogJCggJy5hY2NvcmRpb24taXRlbS1oZWFkZXInICksXG5cdFx0XHRjb250ZW50czogJCggJy5hY2NvcmRpb24taXRlbS1jb250ZW50JyApLFxuXHRcdFx0YnV0dG9uOiAkKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKSxcblx0XHRcdGFuY2hvcklEOiAkKCB3aW5kb3cubG9jYXRpb24uaGFzaCApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVycy5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCBhcHAudG9nZ2xlQWNjb3JkaW9uICk7XG5cdFx0YXBwLiRjLmJ1dHRvbi5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCBhcHAudG9nZ2xlQWNjb3JkaW9uICk7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAub3Blbkhhc2hBY2NvcmRpb24gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuYWNjb3JkaW9uLmxlbmd0aDtcblx0fTtcblxuXHRhcHAudG9nZ2xlQWNjb3JkaW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBBZGQgdGhlIG9wZW4gY2xhc3MgdG8gdGhlIGl0ZW0uXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkudG9nZ2xlQ2xhc3MoICdvcGVuJyApO1xuXG5cdFx0Ly8gSXMgdGhpcyBvbmUgZXhwYW5kZWQ/XG5cdFx0bGV0IGlzRXhwYW5kZWQgPSAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5oYXNDbGFzcyggJ29wZW4nICk7XG5cblx0XHQvLyBTZXQgdGhpcyBidXR0b24ncyBhcmlhLWV4cGFuZGVkIHZhbHVlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgaXNFeHBhbmRlZCA/ICd0cnVlJyA6ICdmYWxzZScgKTtcblxuXHRcdC8vIFNldCBhbGwgb3RoZXIgaXRlbXMgaW4gdGhpcyBibG9jayB0byBhcmlhLWhpZGRlbj10cnVlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICkubm90KCAkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKSApLmF0dHIoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO1xuXG5cdFx0Ly8gU2V0IHRoaXMgaXRlbSB0byBhcmlhLWhpZGRlbj1mYWxzZS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLWNvbnRlbnQnICkuYXR0ciggJ2FyaWEtaGlkZGVuJywgaXNFeHBhbmRlZCA/ICdmYWxzZScgOiAndHJ1ZScgKTtcblxuXHRcdC8vIEhpZGUgdGhlIG90aGVyIHBhbmVscy5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24tYmxvY2snICkuZmluZCggJy5hY2NvcmRpb24taXRlbScgKS5ub3QoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApICkucmVtb3ZlQ2xhc3MoICdvcGVuJyApO1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtLXRvZ2dsZScgKS5ub3QoICQoIHRoaXMgKSApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyApO1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdGFwcC5vcGVuSGFzaEFjY29yZGlvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCAhIGFwcC4kYy5hbmNob3JJRC5zZWxlY3RvciApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBUcmlnZ2VyIGEgY2xpY2sgb24gdGhlIGJ1dHRvbiBjbG9zZXN0IHRvIHRoaXMgYWNjb3JkaW9uLlxuXHRcdGFwcC4kYy5hbmNob3JJRC5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLnRyaWdnZXIoICdjbGljaycgKTtcblxuXHRcdC8vIE5vdCBzZXR0aW5nIGEgY2FjaGVkIHZhcmlhYmxlIGFzIGl0IGRvZXNuJ3Qgc2VlbSB0byBncmFiIHRoZSBoZWlnaHQgcHJvcGVybHkuXG5cdFx0Y29uc3QgYWRtaW5CYXJIZWlnaHQgPSAkKCAnI3dwYWRtaW5iYXInICkubGVuZ3RoID8gJCggJyN3cGFkbWluYmFyJyApLmhlaWdodCgpIDogMDtcblxuXHRcdC8vIEFuaW1hdGUgdG8gdGhlIGRpdiBmb3IgYSBuaWNlciBleHBlcmllbmNlLlxuXHRcdGFwcC4kYy5odG1sLmFuaW1hdGUoIHtcblx0XHRcdHNjcm9sbFRvcDogYXBwLiRjLmFuY2hvcklELm9mZnNldCgpLnRvcCAtIGFkbWluQmFySGVpZ2h0XG5cdFx0fSwgJ3Nsb3cnICk7XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdGFwcC5pbml0KCk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93LmFjY29yZGlvbkJsb2NrVG9nZ2xlICkgKTtcbiIsIi8qKlxuICogRmlsZSBjYXJvdXNlbC5qc1xuICpcbiAqIERlYWwgd2l0aCB0aGUgU2xpY2sgY2Fyb3VzZWwuXG4gKi9cbndpbmRvdy53ZHNDYXJvdXNlbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHR0aGVDYXJvdXNlbDogJCggJy5jYXJvdXNlbC1ibG9jaycgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvU2xpY2sgKTtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5kb0ZpcnN0QW5pbWF0aW9uICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnRoZUNhcm91c2VsLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBbmltYXRlIHRoZSBmaXJzdCBzbGlkZSBvbiB3aW5kb3cgbG9hZC5cblx0YXBwLmRvRmlyc3RBbmltYXRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEdldCB0aGUgZmlyc3Qgc2xpZGUgY29udGVudCBhcmVhIGFuZCBhbmltYXRpb24gYXR0cmlidXRlLlxuXHRcdGxldCBmaXJzdFNsaWRlID0gYXBwLiRjLnRoZUNhcm91c2VsLmZpbmQoICdbZGF0YS1zbGljay1pbmRleD0wXScgKSxcblx0XHRcdGZpcnN0U2xpZGVDb250ZW50ID0gZmlyc3RTbGlkZS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICksXG5cdFx0XHRmaXJzdEFuaW1hdGlvbiA9IGZpcnN0U2xpZGVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKTtcblxuXHRcdC8vIEFkZCB0aGUgYW5pbWF0aW9uIGNsYXNzIHRvIHRoZSBmaXJzdCBzbGlkZS5cblx0XHRmaXJzdFNsaWRlQ29udGVudC5hZGRDbGFzcyggZmlyc3RBbmltYXRpb24gKTtcblx0fTtcblxuXHQvLyBBbmltYXRlIHRoZSBzbGlkZSBjb250ZW50LlxuXHRhcHAuZG9BbmltYXRpb24gPSBmdW5jdGlvbigpIHtcblx0XHRsZXQgc2xpZGVzID0gJCggdGhpcyApLmZpbmQoICcuc2xpZGUnICksXG5cdFx0XHRhY3RpdmVTbGlkZSA9ICQoIHRoaXMgKS5maW5kKCAnLnNsaWNrLWN1cnJlbnQnICksXG5cdFx0XHRhY3RpdmVDb250ZW50ID0gYWN0aXZlU2xpZGUuZmluZCggJy5zbGlkZS1jb250ZW50JyApLFxuXG5cdFx0XHQvLyBUaGlzIGlzIGEgc3RyaW5nIGxpa2Ugc286ICdhbmltYXRlZCBzb21lQ3NzQ2xhc3MnLlxuXHRcdFx0YW5pbWF0aW9uQ2xhc3MgPSBhY3RpdmVDb250ZW50LmF0dHIoICdkYXRhLWFuaW1hdGlvbicgKTtcblxuXHRcdFx0aWYgKCB1bmRlZmluZWQgPT09IGFuaW1hdGlvbkNsYXNzICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBzcGxpdEFuaW1hdGlvbiA9IGFuaW1hdGlvbkNsYXNzLnNwbGl0KCAnICcgKSxcblxuXHRcdFx0Ly8gVGhpcyBpcyB0aGUgJ2FuaW1hdGVkJyBjbGFzcy5cblx0XHRcdGFuaW1hdGlvblRyaWdnZXIgPSBzcGxpdEFuaW1hdGlvblswXTtcblxuXHRcdC8vIEdvIHRocm91Z2ggZWFjaCBzbGlkZSB0byBzZWUgaWYgd2UndmUgYWxyZWFkeSBzZXQgYW5pbWF0aW9uIGNsYXNzZXMuXG5cdFx0c2xpZGVzLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0bGV0IHNsaWRlQ29udGVudCA9ICQoIHRoaXMgKS5maW5kKCAnLnNsaWRlLWNvbnRlbnQnICk7XG5cblx0XHRcdC8vIElmIHdlJ3ZlIHNldCBhbmltYXRpb24gY2xhc3NlcyBvbiBhIHNsaWRlLCByZW1vdmUgdGhlbS5cblx0XHRcdGlmICggc2xpZGVDb250ZW50Lmhhc0NsYXNzKCAnYW5pbWF0ZWQnICkgKSB7XG5cblx0XHRcdFx0Ly8gR2V0IHRoZSBsYXN0IGNsYXNzLCB3aGljaCBpcyB0aGUgYW5pbWF0ZS5jc3MgY2xhc3MuXG5cdFx0XHRcdGxldCBsYXN0Q2xhc3MgPSBzbGlkZUNvbnRlbnRcblx0XHRcdFx0XHQuYXR0ciggJ2NsYXNzJyApXG5cdFx0XHRcdFx0LnNwbGl0KCAnICcgKVxuXHRcdFx0XHRcdC5wb3AoKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgYm90aCBhbmltYXRpb24gY2xhc3Nlcy5cblx0XHRcdFx0c2xpZGVDb250ZW50LnJlbW92ZUNsYXNzKCBsYXN0Q2xhc3MgKS5yZW1vdmVDbGFzcyggYW5pbWF0aW9uVHJpZ2dlciApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEFkZCBhbmltYXRpb24gY2xhc3NlcyBhZnRlciBzbGlkZSBpcyBpbiB2aWV3LlxuXHRcdGFjdGl2ZUNvbnRlbnQuYWRkQ2xhc3MoIGFuaW1hdGlvbkNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWxsb3cgYmFja2dyb3VuZCB2aWRlb3MgdG8gYXV0b3BsYXkuXG5cdGFwcC5wbGF5QmFja2dyb3VuZFZpZGVvcyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gR2V0IGFsbCB0aGUgdmlkZW9zIGluIG91ciBzbGlkZXMgb2JqZWN0LlxuXHRcdCQoICd2aWRlbycgKS5lYWNoKCBmdW5jdGlvbigpIHtcblxuXHRcdFx0Ly8gTGV0IHRoZW0gYXV0b3BsYXkuIFRPRE86IFBvc3NpYmx5IGNoYW5nZSB0aGlzIGxhdGVyIHRvIG9ubHkgcGxheSB0aGUgdmlzaWJsZSBzbGlkZSB2aWRlby5cblx0XHRcdHRoaXMucGxheSgpO1xuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBLaWNrIG9mZiBTbGljay5cblx0YXBwLmRvU2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdpbml0JywgYXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zICk7XG5cblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwuc2xpY2soIHtcblx0XHRcdGF1dG9wbGF5OiB0cnVlLFxuXHRcdFx0YXV0b3BsYXlTcGVlZDogNTAwMCxcblx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRmb2N1c09uU2VsZWN0OiB0cnVlLFxuXHRcdFx0d2FpdEZvckFuaW1hdGU6IHRydWVcblx0XHR9ICk7XG5cblx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdhZnRlckNoYW5nZScsIGFwcC5kb0FuaW1hdGlvbiApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc0Nhcm91c2VsICkgKTtcbiIsIi8qKlxuICogU2hvdy9IaWRlIHRoZSBTZWFyY2ggRm9ybSBpbiB0aGUgaGVhZGVyLlxuICpcbiAqIEBhdXRob3IgQ29yZXkgQ29sbGluc1xuICovXG53aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3RvclxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdGhlYWRlclNlYXJjaFRvZ2dsZTogJCggJy5zaXRlLWhlYWRlci1hY3Rpb24gLmN0YS1idXR0b24nICksXG5cdFx0XHRoZWFkZXJTZWFyY2hGb3JtOiAkKCAnLnNpdGUtaGVhZGVyLWFjdGlvbiAuZm9ybS1jb250YWluZXInICksXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoVG9nZ2xlLm9uKCAna2V5dXAgdG91Y2hzdGFydCBjbGljaycsIGFwcC5zaG93SGlkZVNlYXJjaEZvcm0gKTtcblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleXVwIHRvdWNoc3RhcnQgY2xpY2snLCBhcHAuaGlkZVNlYXJjaEZvcm0gKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuaGVhZGVyU2VhcmNoVG9nZ2xlLmxlbmd0aDtcblx0fTtcblxuXHQvLyBDaGVja3MgdG8gc2VlIGlmIHRoZSBtZW51IGhhcyBiZWVuIG9wZW5lZC5cblx0YXBwLnNlYXJjaElzT3BlbiA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0aWYgKCBhcHAuJGMuYm9keS5oYXNDbGFzcyggJ3NlYXJjaC1mb3JtLXZpc2libGUnICkgKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0Ly8gQWRkcyB0aGUgdG9nZ2xlIGNsYXNzIGZvciB0aGUgc2VhcmNoIGZvcm0uXG5cdGFwcC5zaG93SGlkZVNlYXJjaEZvcm0gPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS50b2dnbGVDbGFzcyggJ3NlYXJjaC1mb3JtLXZpc2libGUnICk7XG5cblx0XHRhcHAudG9nZ2xlU2VhcmNoRm9ybUFyaWFMYWJlbCgpO1xuXHRcdGFwcC50b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwoKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQvLyBIaWRlcyB0aGUgc2VhcmNoIGZvcm0gaWYgd2UgY2xpY2sgb3V0c2lkZSBvZiBpdHMgY29udGFpbmVyLlxuXHRhcHAuaGlkZVNlYXJjaEZvcm0gPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHRpZiAoICEgJCggZXZlbnQudGFyZ2V0ICkucGFyZW50cyggJ2RpdicgKS5oYXNDbGFzcyggJ3NpdGUtaGVhZGVyLWFjdGlvbicgKSApIHtcblx0XHRcdGFwcC4kYy5ib2R5LnJlbW92ZUNsYXNzKCAnc2VhcmNoLWZvcm0tdmlzaWJsZScgKTtcblx0XHRcdGFwcC50b2dnbGVTZWFyY2hGb3JtQXJpYUxhYmVsKCk7XG5cdFx0XHRhcHAudG9nZ2xlU2VhcmNoVG9nZ2xlQXJpYUxhYmVsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFRvZ2dsZXMgdGhlIGFyaWEtaGlkZGVuIGxhYmVsIG9uIHRoZSBmb3JtIGNvbnRhaW5lci5cblx0YXBwLnRvZ2dsZVNlYXJjaEZvcm1BcmlhTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoRm9ybS5hdHRyKCAnYXJpYS1oaWRkZW4nLCBhcHAuc2VhcmNoSXNPcGVuKCkgPyAnZmFsc2UnIDogJ3RydWUnICk7XG5cdH07XG5cblx0Ly8gVG9nZ2xlcyB0aGUgYXJpYS1oaWRkZW4gbGFiZWwgb24gdGhlIHRvZ2dsZSBidXR0b24uXG5cdGFwcC50b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuaGVhZGVyU2VhcmNoVG9nZ2xlLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgYXBwLnNlYXJjaElzT3BlbigpID8gJ3RydWUnIDogJ2ZhbHNlJyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZVxuXHQkKCBhcHAuaW5pdCApO1xuXG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy5TaG93SGlkZVNlYXJjaEZvcm0gKSApO1xuIiwiLyoqXG4gKiBGaWxlIGpzLWVuYWJsZWQuanNcbiAqXG4gKiBJZiBKYXZhc2NyaXB0IGlzIGVuYWJsZWQsIHJlcGxhY2UgdGhlIDxib2R5PiBjbGFzcyBcIm5vLWpzXCIuXG4gKi9cbmRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSggJ25vLWpzJywgJ2pzJyApO1xuIiwiLyoqXG4gKiBGaWxlOiBtb2JpbGUtbWVudS5qc1xuICpcbiAqIENyZWF0ZSBhbiBhY2NvcmRpb24gc3R5bGUgZHJvcGRvd24uXG4gKi9cbndpbmRvdy53ZHNNb2JpbGVNZW51ID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0Ym9keTogJCggJ2JvZHknICksXG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0c3ViTWVudUNvbnRhaW5lcjogJCggJy5tb2JpbGUtbWVudSAuc3ViLW1lbnUsIC51dGlsaXR5LW5hdmlnYXRpb24gLnN1Yi1tZW51JyApLFxuXHRcdFx0c3ViU3ViTWVudUNvbnRhaW5lcjogJCggJy5tb2JpbGUtbWVudSAuc3ViLW1lbnUgLnN1Yi1tZW51JyApLFxuXHRcdFx0c3ViTWVudVBhcmVudEl0ZW06ICQoICcubW9iaWxlLW1lbnUgbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbiwgLnV0aWxpdHktbmF2aWdhdGlvbiBsaS5tZW51LWl0ZW0taGFzLWNoaWxkcmVuJyApLFxuXHRcdFx0b2ZmQ2FudmFzQ29udGFpbmVyOiAkKCAnLm9mZi1jYW52YXMtY29udGFpbmVyJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRG93bkFycm93ICk7XG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLm9uKCAnY2xpY2snLCBhcHAudG9nZ2xlU3VibWVudSApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5vbiggJ3RyYW5zaXRpb25lbmQnLCBhcHAucmVzZXRTdWJNZW51ICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5vbiggJ3RyYW5zaXRpb25lbmQnLCBhcHAuZm9yY2VDbG9zZVN1Ym1lbnVzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnN1Yk1lbnVDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIFJlc2V0IHRoZSBzdWJtZW51cyBhZnRlciBpdCdzIGRvbmUgY2xvc2luZy5cblx0YXBwLnJlc2V0U3ViTWVudSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gV2hlbiB0aGUgbGlzdCBpdGVtIGlzIGRvbmUgdHJhbnNpdGlvbmluZyBpbiBoZWlnaHQsXG5cdFx0Ly8gcmVtb3ZlIHRoZSBjbGFzc2VzIGZyb20gdGhlIHN1Ym1lbnUgc28gaXQgaXMgcmVhZHkgdG8gdG9nZ2xlIGFnYWluLlxuXHRcdGlmICggJCggdGhpcyApLmlzKCAnbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKSAmJiAhICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHQkKCB0aGlzICkuZmluZCggJ3VsLnN1Yi1tZW51JyApLnJlbW92ZUNsYXNzKCAnc2xpZGVPdXRMZWZ0IGlzLXZpc2libGUnICk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gU2xpZGUgb3V0IHRoZSBzdWJtZW51IGl0ZW1zLlxuXHRhcHAuc2xpZGVPdXRTdWJNZW51cyA9IGZ1bmN0aW9uKCBlbCApIHtcblxuXHRcdC8vIElmIHRoaXMgaXRlbSdzIHBhcmVudCBpcyB2aXNpYmxlIGFuZCB0aGlzIGlzIG5vdCwgYmFpbC5cblx0XHRpZiAoIGVsLnBhcmVudCgpLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSAmJiAhIGVsLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBJZiB0aGlzIGl0ZW0ncyBwYXJlbnQgaXMgdmlzaWJsZSBhbmQgdGhpcyBpdGVtIGlzIHZpc2libGUsIGhpZGUgaXRzIHN1Ym1lbnUgdGhlbiBiYWlsLlxuXHRcdGlmICggZWwucGFyZW50KCkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICYmIGVsLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdGVsLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnN1Yi1tZW51JyApLnJlbW92ZUNsYXNzKCAnc2xpZGVJbkxlZnQnICkuYWRkQ2xhc3MoICdzbGlkZU91dExlZnQnICk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIuZWFjaCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIE9ubHkgdHJ5IHRvIGNsb3NlIHN1Ym1lbnVzIHRoYXQgYXJlIGFjdHVhbGx5IG9wZW4uXG5cdFx0XHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ3NsaWRlSW5MZWZ0JyApICkge1xuXG5cdFx0XHRcdC8vIENsb3NlIHRoZSBwYXJlbnQgbGlzdCBpdGVtLCBhbmQgc2V0IHRoZSBjb3JyZXNwb25kaW5nIGJ1dHRvbiBhcmlhIHRvIGZhbHNlLlxuXHRcdFx0XHQkKCB0aGlzICkucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApLmZpbmQoICcucGFyZW50LWluZGljYXRvcicgKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGZhbHNlICk7XG5cblx0XHRcdFx0Ly8gU2xpZGUgb3V0IHRoZSBzdWJtZW51LlxuXHRcdFx0XHQkKCB0aGlzICkucmVtb3ZlQ2xhc3MoICdzbGlkZUluTGVmdCcgKS5hZGRDbGFzcyggJ3NsaWRlT3V0TGVmdCcgKTtcblx0XHRcdH1cblxuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBBZGQgdGhlIGRvd24gYXJyb3cgdG8gc3VibWVudSBwYXJlbnRzLlxuXHRhcHAuYWRkRG93bkFycm93ID0gZnVuY3Rpb24oKSB7XG5cblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJ2E6Zmlyc3QnICkuYWZ0ZXIoICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBjbGFzcz1cInBhcmVudC1pbmRpY2F0b3JcIiBhcmlhLWxhYmVsPVwiT3BlbiBzdWJtZW51XCI+PHNwYW4gY2xhc3M9XCJkb3duLWFycm93XCI+PC9zcGFuPjwvYnV0dG9uPicgKTtcblx0fTtcblxuXHQvLyBEZWFsIHdpdGggdGhlIHN1Ym1lbnUuXG5cdGFwcC50b2dnbGVTdWJtZW51ID0gZnVuY3Rpb24oIGUgKSB7XG5cblx0XHRsZXQgZWwgPSAkKCB0aGlzICksIC8vIFRoZSBtZW51IGVsZW1lbnQgd2hpY2ggd2FzIGNsaWNrZWQgb24uXG5cdFx0XHRzdWJNZW51ID0gZWwuY2hpbGRyZW4oICd1bC5zdWItbWVudScgKSwgLy8gVGhlIG5lYXJlc3Qgc3VibWVudS5cblx0XHRcdCR0YXJnZXQgPSAkKCBlLnRhcmdldCApOyAvLyB0aGUgZWxlbWVudCB0aGF0J3MgYWN0dWFsbHkgYmVpbmcgY2xpY2tlZCAoY2hpbGQgb2YgdGhlIGxpIHRoYXQgdHJpZ2dlcmVkIHRoZSBjbGljayBldmVudCkuXG5cblx0XHQvLyBGaWd1cmUgb3V0IGlmIHdlJ3JlIGNsaWNraW5nIHRoZSBidXR0b24gb3IgaXRzIGFycm93IGNoaWxkLFxuXHRcdC8vIGlmIHNvLCB3ZSBjYW4ganVzdCBvcGVuIG9yIGNsb3NlIHRoZSBtZW51IGFuZCBiYWlsLlxuXHRcdGlmICggJHRhcmdldC5oYXNDbGFzcyggJ2Rvd24tYXJyb3cnICkgfHwgJHRhcmdldC5oYXNDbGFzcyggJ3BhcmVudC1pbmRpY2F0b3InICkgKSB7XG5cblx0XHRcdC8vIEZpcnN0LCBjb2xsYXBzZSBhbnkgYWxyZWFkeSBvcGVuZWQgc3VibWVudXMuXG5cdFx0XHRhcHAuc2xpZGVPdXRTdWJNZW51cyggZWwgKTtcblxuXHRcdFx0aWYgKCAhIHN1Yk1lbnUuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXG5cdFx0XHRcdC8vIE9wZW4gdGhlIHN1Ym1lbnUuXG5cdFx0XHRcdGFwcC5vcGVuU3VibWVudSggZWwsIHN1Yk1lbnUgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gT3BlbiBhIHN1Ym1lbnUuXG5cdGFwcC5vcGVuU3VibWVudSA9IGZ1bmN0aW9uKCBwYXJlbnQsIHN1Yk1lbnUgKSB7XG5cblx0XHQvLyBFeHBhbmQgdGhlIGxpc3QgbWVudSBpdGVtLCBhbmQgc2V0IHRoZSBjb3JyZXNwb25kaW5nIGJ1dHRvbiBhcmlhIHRvIHRydWUuXG5cdFx0cGFyZW50LmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCB0cnVlICk7XG5cblx0XHQvLyBTbGlkZSB0aGUgbWVudSBpbi5cblx0XHRzdWJNZW51LmFkZENsYXNzKCAnaXMtdmlzaWJsZSBhbmltYXRlZCBzbGlkZUluTGVmdCcgKTtcblx0fTtcblxuXHQvLyBGb3JjZSBjbG9zZSBhbGwgdGhlIHN1Ym1lbnVzIHdoZW4gdGhlIG1haW4gbWVudSBjb250YWluZXIgaXMgY2xvc2VkLlxuXHRhcHAuZm9yY2VDbG9zZVN1Ym1lbnVzID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggJCggZXZlbnQudGFyZ2V0ICkuaGFzQ2xhc3MoICdvZmYtY2FudmFzLWNvbnRhaW5lcicgKSApIHtcblxuXHRcdFx0Ly8gRm9jdXMgb2ZmY2FudmFzIG1lbnUgZm9yIGExMXkuXG5cdFx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmZvY3VzKCk7XG5cblx0XHRcdC8vIFRoZSB0cmFuc2l0aW9uZW5kIGV2ZW50IHRyaWdnZXJzIG9uIG9wZW4gYW5kIG9uIGNsb3NlLCBuZWVkIHRvIG1ha2Ugc3VyZSB3ZSBvbmx5IGRvIHRoaXMgb24gY2xvc2UuXG5cdFx0XHRpZiAoICEgJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdFx0XHRhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUgc2xpZGVJbkxlZnQnICk7XG5cdFx0XHRcdGFwcC4kYy5ib2R5LmNzcyggJ292ZXJmbG93JywgJ3Zpc2libGUnICk7XG5cdFx0XHRcdGFwcC4kYy5ib2R5LnVuYmluZCggJ3RvdWNoc3RhcnQnICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblx0XHRcdFx0YXBwLiRjLmJvZHkuY3NzKCAnb3ZlcmZsb3cnLCAnaGlkZGVuJyApO1xuXHRcdFx0XHRhcHAuJGMuYm9keS5iaW5kKCAndG91Y2hzdGFydCcsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRcdGlmICggISAkKCBlLnRhcmdldCApLnBhcmVudHMoICcuY29udGFjdC1tb2RhbCcgKVswXSApIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc01vYmlsZU1lbnUgKSApO1xuIiwiLyoqXG4gKiBGaWxlIG1vZGFsLmpzXG4gKlxuICogRGVhbCB3aXRoIG11bHRpcGxlIG1vZGFscyBhbmQgdGhlaXIgbWVkaWEuXG4gKi9cbndpbmRvdy53ZHNNb2RhbCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0bGV0ICRtb2RhbFRvZ2dsZSxcblx0XHQkZm9jdXNhYmxlQ2hpbGRyZW4sXG5cdFx0JHBsYXllcixcblx0XHQkdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NjcmlwdCcgKSxcblx0XHQkZmlyc3RTY3JpcHRUYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ3NjcmlwdCcgKVswXSxcblx0XHRZVDtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHQkZmlyc3RTY3JpcHRUYWcucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoICR0YWcsICRmaXJzdFNjcmlwdFRhZyApO1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdCdib2R5JzogJCggJ2JvZHknIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICQoICcubW9kYWwtdHJpZ2dlcicgKS5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gVHJpZ2dlciBhIG1vZGFsIHRvIG9wZW4uXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJy5tb2RhbC10cmlnZ2VyJywgYXBwLm9wZW5Nb2RhbCApO1xuXG5cdFx0Ly8gVHJpZ2dlciB0aGUgY2xvc2UgYnV0dG9uIHRvIGNsb3NlIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLmNsb3NlJywgYXBwLmNsb3NlTW9kYWwgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBoaXR0aW5nIHRoZSBlc2Mga2V5LlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC5lc2NLZXlDbG9zZSApO1xuXG5cdFx0Ly8gQWxsb3cgdGhlIHVzZXIgdG8gY2xvc2UgdGhlIG1vZGFsIGJ5IGNsaWNraW5nIG91dHNpZGUgb2YgdGhlIG1vZGFsLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICdkaXYubW9kYWwtb3BlbicsIGFwcC5jbG9zZU1vZGFsQnlDbGljayApO1xuXG5cdFx0Ly8gTGlzdGVuIHRvIHRhYnMsIHRyYXAga2V5Ym9hcmQgaWYgd2UgbmVlZCB0b1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC50cmFwS2V5Ym9hcmRNYXliZSApO1xuXG5cdH07XG5cblx0Ly8gT3BlbiB0aGUgbW9kYWwuXG5cdGFwcC5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFN0b3JlIHRoZSBtb2RhbCB0b2dnbGUgZWxlbWVudFxuXHRcdCRtb2RhbFRvZ2dsZSA9ICQoIHRoaXMgKTtcblxuXHRcdC8vIEZpZ3VyZSBvdXQgd2hpY2ggbW9kYWwgd2UncmUgb3BlbmluZyBhbmQgc3RvcmUgdGhlIG9iamVjdC5cblx0XHRsZXQgJG1vZGFsID0gJCggJCggdGhpcyApLmRhdGEoICd0YXJnZXQnICkgKTtcblxuXHRcdC8vIERpc3BsYXkgdGhlIG1vZGFsLlxuXHRcdCRtb2RhbC5hZGRDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBBZGQgYm9keSBjbGFzcy5cblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBGaW5kIHRoZSBmb2N1c2FibGUgY2hpbGRyZW4gb2YgdGhlIG1vZGFsLlxuXHRcdC8vIFRoaXMgbGlzdCBtYXkgYmUgaW5jb21wbGV0ZSwgcmVhbGx5IHdpc2ggalF1ZXJ5IGhhZCB0aGUgOmZvY3VzYWJsZSBwc2V1ZG8gbGlrZSBqUXVlcnkgVUkgZG9lcy5cblx0XHQvLyBGb3IgbW9yZSBhYm91dCA6aW5wdXQgc2VlOiBodHRwczovL2FwaS5qcXVlcnkuY29tL2lucHV0LXNlbGVjdG9yL1xuXHRcdCRmb2N1c2FibGVDaGlsZHJlbiA9ICRtb2RhbC5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApO1xuXG5cdFx0Ly8gSWRlYWxseSwgdGhlcmUgaXMgYWx3YXlzIG9uZSAodGhlIGNsb3NlIGJ1dHRvbiksIGJ1dCB5b3UgbmV2ZXIga25vdy5cblx0XHRpZiAoIDAgPCAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoICkge1xuXG5cdFx0XHQvLyBTaGlmdCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBDbG9zZSB0aGUgbW9kYWwuXG5cdGFwcC5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBGaWd1cmUgdGhlIG9wZW5lZCBtb2RhbCB3ZSdyZSBjbG9zaW5nIGFuZCBzdG9yZSB0aGUgb2JqZWN0LlxuXHRcdGxldCAkbW9kYWwgPSAkKCAkKCAnZGl2Lm1vZGFsLW9wZW4gLmNsb3NlJyApLmRhdGEoICd0YXJnZXQnICkgKSxcblxuXHRcdFx0Ly8gRmluZCB0aGUgaWZyYW1lIGluIHRoZSAkbW9kYWwgb2JqZWN0LlxuXHRcdFx0JGlmcmFtZSA9ICRtb2RhbC5maW5kKCAnaWZyYW1lJyApO1xuXG5cdFx0Ly8gT25seSBkbyB0aGlzIGlmIHRoZXJlIGFyZSBhbnkgaWZyYW1lcy5cblx0XHRpZiAoICRpZnJhbWUubGVuZ3RoICkge1xuXG5cdFx0XHQvLyBHZXQgdGhlIGlmcmFtZSBzcmMgVVJMLlxuXHRcdFx0bGV0IHVybCA9ICRpZnJhbWUuYXR0ciggJ3NyYycgKTtcblxuXHRcdFx0Ly8gUmVtb3ZpbmcvUmVhZGRpbmcgdGhlIFVSTCB3aWxsIGVmZmVjdGl2ZWx5IGJyZWFrIHRoZSBZb3VUdWJlIEFQSS5cblx0XHRcdC8vIFNvIGxldCdzIG5vdCBkbyB0aGF0IHdoZW4gdGhlIGlmcmFtZSBVUkwgY29udGFpbnMgdGhlIGVuYWJsZWpzYXBpIHBhcmFtZXRlci5cblx0XHRcdGlmICggISB1cmwuaW5jbHVkZXMoICdlbmFibGVqc2FwaT0xJyApICkge1xuXG5cdFx0XHRcdC8vIFJlbW92ZSB0aGUgc291cmNlIFVSTCwgdGhlbiBhZGQgaXQgYmFjaywgc28gdGhlIHZpZGVvIGNhbiBiZSBwbGF5ZWQgYWdhaW4gbGF0ZXIuXG5cdFx0XHRcdCRpZnJhbWUuYXR0ciggJ3NyYycsICcnICkuYXR0ciggJ3NyYycsIHVybCApO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBVc2UgdGhlIFlvdVR1YmUgQVBJIHRvIHN0b3AgdGhlIHZpZGVvLlxuXHRcdFx0XHQkcGxheWVyLnN0b3BWaWRlbygpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEZpbmFsbHksIGhpZGUgdGhlIG1vZGFsLlxuXHRcdCRtb2RhbC5yZW1vdmVDbGFzcyggJ21vZGFsLW9wZW4nICk7XG5cblx0XHQvLyBSZW1vdmUgdGhlIGJvZHkgY2xhc3MuXG5cdFx0YXBwLiRjLmJvZHkucmVtb3ZlQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gUmV2ZXJ0IGZvY3VzIGJhY2sgdG8gdG9nZ2xlIGVsZW1lbnRcblx0XHQkbW9kYWxUb2dnbGUuZm9jdXMoKTtcblxuXHR9O1xuXG5cdC8vIENsb3NlIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3NlTW9kYWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2xvc2UgaWYgdGhlIHVzZXIgY2xpY2tzIG91dHNpZGUgb2YgdGhlIG1vZGFsXG5cdGFwcC5jbG9zZU1vZGFsQnlDbGljayA9IGZ1bmN0aW9uKCBldmVudCApIHtcblxuXHRcdC8vIElmIHRoZSBwYXJlbnQgY29udGFpbmVyIGlzIE5PVCB0aGUgbW9kYWwgZGlhbG9nIGNvbnRhaW5lciwgY2xvc2UgdGhlIG1vZGFsXG5cdFx0aWYgKCAhICQoIGV2ZW50LnRhcmdldCApLnBhcmVudHMoICdkaXYnICkuaGFzQ2xhc3MoICdtb2RhbC1kaWFsb2cnICkgKSB7XG5cdFx0XHRhcHAuY2xvc2VNb2RhbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBUcmFwIHRoZSBrZXlib2FyZCBpbnRvIGEgbW9kYWwgd2hlbiBvbmUgaXMgYWN0aXZlLlxuXHRhcHAudHJhcEtleWJvYXJkTWF5YmUgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBXZSBvbmx5IG5lZWQgdG8gZG8gc3R1ZmYgd2hlbiB0aGUgbW9kYWwgaXMgb3BlbiBhbmQgdGFiIGlzIHByZXNzZWQuXG5cdFx0aWYgKCA5ID09PSBldmVudC53aGljaCAmJiAwIDwgJCggJy5tb2RhbC1vcGVuJyApLmxlbmd0aCApIHtcblx0XHRcdGxldCAkZm9jdXNlZCA9ICQoICc6Zm9jdXMnICksXG5cdFx0XHRcdGZvY3VzSW5kZXggPSAkZm9jdXNhYmxlQ2hpbGRyZW4uaW5kZXgoICRmb2N1c2VkICk7XG5cblx0XHRcdGlmICggMCA9PT0gZm9jdXNJbmRleCAmJiBldmVudC5zaGlmdEtleSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCwgYW5kIHNoaWZ0IGlzIGhlbGQgd2hlbiBwcmVzc2luZyB0YWIsIGdvIGJhY2sgdG8gbGFzdCBmb2N1c2FibGUgZWxlbWVudC5cblx0XHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWyAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSBdLmZvY3VzKCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9IGVsc2UgaWYgKCAhIGV2ZW50LnNoaWZ0S2V5ICYmIGZvY3VzSW5kZXggPT09ICRmb2N1c2FibGVDaGlsZHJlbi5sZW5ndGggLSAxICkge1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgaXMgdGhlIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGFuZCBzaGlmdCBpcyBub3QgaGVsZCwgZ28gYmFjayB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyBIb29rIGludG8gWW91VHViZSA8aWZyYW1lPi5cblx0YXBwLm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24oKSB7XG5cdFx0bGV0ICRtb2RhbCA9ICQoICdkaXYubW9kYWwnICksXG5cdFx0XHQkaWZyYW1laWQgPSAkbW9kYWwuZmluZCggJ2lmcmFtZScgKS5hdHRyKCAnaWQnICk7XG5cblx0XHQkcGxheWVyID0gbmV3IFlULlBsYXllciggJGlmcmFtZWlkLCB7XG5cdFx0XHRldmVudHM6IHtcblx0XHRcdFx0J29uUmVhZHknOiBhcHAub25QbGF5ZXJSZWFkeSxcblx0XHRcdFx0J29uU3RhdGVDaGFuZ2UnOiBhcHAub25QbGF5ZXJTdGF0ZUNoYW5nZVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHJlYWR5LlxuXHRhcHAub25QbGF5ZXJSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHR9O1xuXG5cdC8vIERvIHNvbWV0aGluZyBvbiBwbGF5ZXIgc3RhdGUgY2hhbmdlLlxuXHRhcHAub25QbGF5ZXJTdGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gU2V0IGZvY3VzIHRvIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCBpbnNpZGUgb2YgdGhlIG1vZGFsIHRoZSBwbGF5ZXIgaXMgaW4uXG5cdFx0JCggZXZlbnQudGFyZ2V0LmEgKS5wYXJlbnRzKCAnLm1vZGFsJyApLmZpbmQoICdhLCA6aW5wdXQsIFt0YWJpbmRleF0nICkuZmlyc3QoKS5mb2N1cygpO1xuXHR9O1xuXG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2RhbCApICk7XG4iLCIvKipcbiAqIEZpbGU6IG5hdmlnYXRpb24tcHJpbWFyeS5qc1xuICpcbiAqIEhlbHBlcnMgZm9yIHRoZSBwcmltYXJ5IG5hdmlnYXRpb24uXG4gKi9cbndpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRzdWJNZW51Q29udGFpbmVyOiAkKCAnLm1haW4tbmF2aWdhdGlvbiAuc3ViLW1lbnUnICksXG5cdFx0XHRzdWJNZW51UGFyZW50SXRlbTogJCggJy5tYWluLW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnYScgKS5vbiggJ2ZvY3VzaW4gZm9jdXNvdXQnLCBhcHAudG9nZ2xlRm9jdXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMuc3ViTWVudUNvbnRhaW5lci5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5maW5kKCAnPiBhJyApLmFwcGVuZCggJzxzcGFuIGNsYXNzPVwiY2FyZXQtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICk7XG5cdH07XG5cblx0Ly8gVG9nZ2xlIHRoZSBmb2N1cyBjbGFzcyBvbiB0aGUgbGluayBwYXJlbnQuXG5cdGFwcC50b2dnbGVGb2N1cyA9IGZ1bmN0aW9uKCkge1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKS50b2dnbGVDbGFzcyggJ2ZvY3VzJyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNQcmltYXJ5TmF2aWdhdGlvbiApICk7XG4iLCIvKipcbiAqIEZpbGU6IG9mZi1jYW52YXMuanNcbiAqXG4gKiBIZWxwIGRlYWwgd2l0aCB0aGUgb2ZmLWNhbnZhcyBtb2JpbGUgbWVudS5cbiAqL1xud2luZG93Lndkc29mZkNhbnZhcyA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxuXHRcdFx0b2ZmQ2FudmFzQ2xvc2U6ICQoICcub2ZmLWNhbnZhcy1jbG9zZScgKSxcblx0XHRcdG9mZkNhbnZhc0NvbnRhaW5lcjogJCggJy5vZmYtY2FudmFzLWNvbnRhaW5lcicgKSxcblx0XHRcdG9mZkNhbnZhc09wZW46ICQoICcub2ZmLWNhbnZhcy1vcGVuJyApLFxuXHRcdFx0b2ZmQ2FudmFzU2NyZWVuOiAkKCAnLm9mZi1jYW52YXMtc2NyZWVuJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXlkb3duJywgYXBwLmVzY0tleUNsb3NlICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0Nsb3NlLm9uKCAnY2xpY2snLCBhcHAuY2xvc2VvZmZDYW52YXMgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZW9mZkNhbnZhcyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4ub24oICdjbGljaycsIGFwcC5jbG9zZW9mZkNhbnZhcyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIFRvIHNob3cgb3Igbm90IHRvIHNob3c/XG5cdGFwcC50b2dnbGVvZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmICggJ3RydWUnID09PSAkKCB0aGlzICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnICkgKSB7XG5cdFx0XHRhcHAuY2xvc2VvZmZDYW52YXMoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXBwLm9wZW5vZmZDYW52YXMoKTtcblx0XHR9XG5cblx0fTtcblxuXHQvLyBTaG93IHRoYXQgZHJhd2VyIVxuXHRhcHAub3Blbm9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYWRkQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYXR0ciggJ2FyaWEtaGlkZGVuJywgZmFsc2UgKTtcblx0fTtcblxuXHQvLyBDbG9zZSB0aGF0IGRyYXdlciFcblx0YXBwLmNsb3Nlb2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNTY3JlZW4ucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIuYXR0ciggJ2FyaWEtaGlkZGVuJywgdHJ1ZSApO1xuXG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4uZm9jdXMoKTtcblx0fTtcblxuXHQvLyBDbG9zZSBkcmF3ZXIgaWYgXCJlc2NcIiBrZXkgaXMgcHJlc3NlZC5cblx0YXBwLmVzY0tleUNsb3NlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdGlmICggMjcgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRhcHAuY2xvc2VvZmZDYW52YXMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gRW5nYWdlIVxuXHQkKCBhcHAuaW5pdCApO1xuXG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc29mZkNhbnZhcyApICk7XG4iLCIvKipcbiAqIEZpbGUgc2tpcC1saW5rLWZvY3VzLWZpeC5qcy5cbiAqXG4gKiBIZWxwcyB3aXRoIGFjY2Vzc2liaWxpdHkgZm9yIGtleWJvYXJkIG9ubHkgdXNlcnMuXG4gKlxuICogTGVhcm4gbW9yZTogaHR0cHM6Ly9naXQuaW8vdldkcjJcbiAqL1xuKCBmdW5jdGlvbigpIHtcblx0dmFyIGlzV2Via2l0ID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ3dlYmtpdCcgKSxcblx0XHRpc09wZXJhID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ29wZXJhJyApLFxuXHRcdGlzSWUgPSAtMSA8IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCAnbXNpZScgKTtcblxuXHRpZiAoICggaXNXZWJraXQgfHwgaXNPcGVyYSB8fCBpc0llICkgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdoYXNoY2hhbmdlJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaWQgPSBsb2NhdGlvbi5oYXNoLnN1YnN0cmluZyggMSApLFxuXHRcdFx0XHRlbGVtZW50O1xuXG5cdFx0XHRpZiAoICEgKCAvXltBLXowLTlfLV0rJC8gKS50ZXN0KCBpZCApICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggaWQgKTtcblxuXHRcdFx0aWYgKCBlbGVtZW50ICkge1xuXHRcdFx0XHRpZiAoICEgKCAvXig/OmF8c2VsZWN0fGlucHV0fGJ1dHRvbnx0ZXh0YXJlYSkkL2kgKS50ZXN0KCBlbGVtZW50LnRhZ05hbWUgKSApIHtcblx0XHRcdFx0XHRlbGVtZW50LnRhYkluZGV4ID0gLTE7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtZW50LmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UgKTtcblx0fVxufSgpICk7XG4iLCIvKipcbiAqIE1ha2UgdGFibGVzIHJlc3BvbnNpdmUgYWdhaW4uXG4gKlxuICogQGF1dGhvciBIYXJpcyBadWxmaXFhclxuICovXG53aW5kb3cud2RzVGFibGVzID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3RvclxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHR0YWJsZTogJCggJ3RhYmxlJyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHNcblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREYXRhTGFiZWwgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMudGFibGUubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFkZHMgZGF0YS1sYWJlbCB0byB0ZCBiYXNlZCBvbiB0aC5cblx0YXBwLmFkZERhdGFMYWJlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IHRhYmxlID0gYXBwLiRjLnRhYmxlO1xuXHRcdGNvbnN0IHRhYmxlSGVhZGVycyA9IHRhYmxlLmZpbmQoICd0aGVhZCB0aCcgKTtcblx0XHRjb25zdCB0YWJsZVJvdyA9IHRhYmxlLmZpbmQoICd0Ym9keSB0cicgKTtcblxuXHRcdHRhYmxlUm93LmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgdGQgPSAkKCB0aGlzICkuZmluZCggJ3RkJyApO1xuXG5cdFx0XHR0ZC5lYWNoKCBmdW5jdGlvbiggaW5kZXggKSB7XG5cdFx0XHRcdGlmICggJCggdGFibGVIZWFkZXJzLmdldCggaW5kZXggKSApICkge1xuXHRcdFx0XHRcdCQoIHRoaXMgKS5hdHRyKCAnZGF0YS1sYWJlbCcsICQoIHRhYmxlSGVhZGVycy5nZXQoIGluZGV4ICkgKS50ZXh0KCkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQvLyBFbmdhZ2Vcblx0JCggYXBwLmluaXQgKTtcblxufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzVGFibGVzICkgKTtcbiIsIi8qKlxuICogVmlkZW8gUGxheWJhY2sgU2NyaXB0LlxuICovXG53aW5kb3cuV0RTVmlkZW9CYWNrZ3JvdW5kT2JqZWN0ID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5ncy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHZpZGVvQnV0dG9uOiAkKCAnLnZpZGVvLXRvZ2dsZScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy52aWRlb0J1dHRvbi5vbiggJ2NsaWNrJywgYXBwLmRvVG9nZ2xlUGxheWJhY2sgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMudmlkZW9CdXR0b24ubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIFZpZGVvIFBsYXliYWNrLlxuXHRhcHAuZG9Ub2dnbGVQbGF5YmFjayA9IGZ1bmN0aW9uKCkge1xuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmNvbnRlbnQtYmxvY2snICkudG9nZ2xlQ2xhc3MoICd2aWRlby10b2dnbGVkJyApO1xuXG5cdFx0aWYgKCAkKCB0aGlzICkucGFyZW50cyggJy5jb250ZW50LWJsb2NrJyApLmhhc0NsYXNzKCAndmlkZW8tdG9nZ2xlZCcgKSApIHtcblx0XHRcdCQoIHRoaXMgKS5zaWJsaW5ncyggJy52aWRlby1iYWNrZ3JvdW5kJyApLnRyaWdnZXIoICdwYXVzZScgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCggdGhpcyApLnNpYmxpbmdzKCAnLnZpZGVvLWJhY2tncm91bmQnICkudHJpZ2dlciggJ3BsYXknICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy5XRFNWaWRlb0JhY2tncm91bmRPYmplY3QgKSApO1xuIiwiLyoqXG4gKiBGaWxlIHdpbmRvdy1yZWFkeS5qc1xuICpcbiAqIEFkZCBhIFwicmVhZHlcIiBjbGFzcyB0byA8Ym9keT4gd2hlbiB3aW5kb3cgaXMgcmVhZHkuXG4gKi9cbndpbmRvdy53ZHNXaW5kb3dSZWFkeSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0fTtcblxuXHQvLyBDYWNoZSBkb2N1bWVudCBlbGVtZW50cy5cblx0YXBwLmNhY2hlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjID0ge1xuXHRcdFx0J3dpbmRvdyc6ICQoIHdpbmRvdyApLFxuXHRcdFx0J2JvZHknOiAkKCBkb2N1bWVudC5ib2R5IClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93LmxvYWQoIGFwcC5hZGRCb2R5Q2xhc3MgKTtcblx0fTtcblxuXHQvLyBBZGQgYSBjbGFzcyB0byA8Ym9keT4uXG5cdGFwcC5hZGRCb2R5Q2xhc3MgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuYm9keS5hZGRDbGFzcyggJ3JlYWR5JyApO1xuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzV2luZG93UmVhZHkgKSApO1xuIl19
