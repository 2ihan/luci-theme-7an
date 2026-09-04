'use strict';
'require baseclass';
'require ui';

/**
 * Native JavaScript slide animation utilities
 * Replaces jQuery slideUp/slideDown functionality with better performance
 */
const SlideAnimations = {
	/**
	 * Animation durations in milliseconds
	 */
	durations: {
		fast: 200,
		normal: 400,
		slow: 600
	},

	/**
	 * Map to track running animations and their cleanup functions
	 */
	runningAnimations: new WeakMap(),

	/**
	 * Slide element down (show) with animation
	 * @param {Element} element - DOM element to animate
	 * @param {string|number} duration - Animation duration ('fast', 'normal', 'slow' or milliseconds)
	 * @param {function} callback - Optional callback function when animation completes
	 */
	slideDown: function(element, duration, callback) {
		if (!element) {
			console.warn('SlideAnimations.slideDown: No element provided');
			return;
		}
		
		// Stop any existing animation on this element
		this.stop(element);
		
		// Convert duration string to milliseconds
		const animDuration = typeof duration === 'string' ? 
			this.durations[duration] || this.durations.normal : 
			(duration || this.durations.normal);
		
		// Store original styles
		const originalStyles = {
			display: element.style.display,
			overflow: element.style.overflow,
			height: element.style.height,
			transition: element.style.transition
		};
		
		// Set initial state for animation
		element.style.display = 'block';
		element.style.overflow = 'hidden';
		element.style.height = '0px';
		element.style.transition = `height ${animDuration}ms ease-out`;
		
		// Force reflow to ensure initial state is applied
		element.offsetHeight;
		
		// Get the target height
		const targetHeight = element.scrollHeight;
		
		// Animate to full height
		element.style.height = targetHeight + 'px';
		
		// Set up cleanup function
		const cleanup = () => {
			element.style.height = originalStyles.height || '';
			element.style.overflow = originalStyles.overflow || '';
			element.style.transition = originalStyles.transition || '';
			
			// Remove from running animations map
			this.runningAnimations.delete(element);
			
			if (callback && typeof callback === 'function') {
				try {
					callback.call(element);
				} catch (e) {
					console.error('SlideAnimations callback error:', e);
				}
			}
		};
		
		// Store cleanup function for potential cancellation
		const timeoutId = setTimeout(cleanup, animDuration);
		this.runningAnimations.set(element, { timeoutId, cleanup });
	},

	/**
	 * Slide element up (hide) with animation
	 * @param {Element} element - DOM element to animate
	 * @param {string|number} duration - Animation duration ('fast', 'normal', 'slow' or milliseconds)
	 * @param {function} callback - Optional callback function when animation completes
	 */
	slideUp: function(element, duration, callback) {
		if (!element) {
			console.warn('SlideAnimations.slideUp: No element provided');
			return;
		}
		
		// Stop any existing animation on this element
		this.stop(element);
		
		// Convert duration string to milliseconds
		const animDuration = typeof duration === 'string' ? 
			this.durations[duration] || this.durations.normal : 
			(duration || this.durations.normal);
		
		// Store original styles
		const originalStyles = {
			display: element.style.display,
			overflow: element.style.overflow,
			height: element.style.height,
			transition: element.style.transition
		};
		
		// Get current height before hiding
		const currentHeight = element.scrollHeight;
		
		// Set initial state for animation
		element.style.overflow = 'hidden';
		element.style.height = currentHeight + 'px';
		element.style.transition = `height ${animDuration}ms ease-out`;
		
		// Force reflow to ensure initial state is applied
		element.offsetHeight;
		
		// Animate to zero height
		element.style.height = '0px';
		
		// Set up cleanup function
		const cleanup = () => {
			element.style.display = 'none';
			element.style.height = originalStyles.height || '';
			element.style.overflow = originalStyles.overflow || '';
			element.style.transition = originalStyles.transition || '';
			
			// Remove from running animations map
			this.runningAnimations.delete(element);
			
			if (callback && typeof callback === 'function') {
				try {
					callback.call(element);
				} catch (e) {
					console.error('SlideAnimations callback error:', e);
				}
			}
		};
		
		// Store cleanup function for potential cancellation
		const timeoutId = setTimeout(cleanup, animDuration);
		this.runningAnimations.set(element, { timeoutId, cleanup });
	},

	/**
	 * Stop all running animations on an element
	 * @param {Element} element - DOM element to stop animations on
	 */
	stop: function(element) {
		if (!element) return;
		
		const animationData = this.runningAnimations.get(element);
		if (animationData) {
			// Clear the timeout
			clearTimeout(animationData.timeoutId);
			
			// Run cleanup immediately
			animationData.cleanup();
		}
		
		// Clear transition to immediately stop any CSS animation
		element.style.transition = '';
		
		// Force reflow to apply changes immediately
		element.offsetHeight;
	},

	/**
	 * Check if element has running animation
	 * @param {Element} element - DOM element to check
	 * @returns {boolean} - True if element has running animation
	 */
	isAnimating: function(element) {
		return this.runningAnimations.has(element);
	}
};

const GoflowIcons = {
	status: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9h4v11H5V9zm5-6h4v17h-4V3zm5 8h4v9h-4v-9z"/></svg>',
	system: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7zm7.4-2.6c.05-.3.1-.6.1-.9s-.05-.6-.1-.9l2-1.6a.5.5 0 0 0 .1-.6l-1.9-3.3a.5.5 0 0 0-.6-.2l-2.4 1a7 7 0 0 0-1.6-.9l-.4-2.6a.5.5 0 0 0-.5-.4h-3.8a.5.5 0 0 0-.5.4l-.4 2.6a7 7 0 0 0-1.6.9l-2.4-1a.5.5 0 0 0-.6.2L2.9 8.9a.5.5 0 0 0 .1.6l2 1.6c-.05.3-.1.6-.1.9s.05.6.1.9l-2 1.6a.5.5 0 0 0-.1.6l1.9 3.3c.1.2.4.3.6.2l2.4-1c.5.4 1 .7 1.6.9l.4 2.6c0 .2.2.4.5.4h3.8c.3 0 .5-.2.5-.4l.4-2.6a7 7 0 0 0 1.6-.9l2.4 1c.2.1.5 0 .6-.2l1.9-3.3a.5.5 0 0 0-.1-.6l-2-1.6z"/></svg>',
	network: '<svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M957.06 511.84c0 246.74-200.15 446.76-447 446.76S63 758.58 63 511.84 263.13 65.09 510 65.09s447.06 200.02 447.06 446.75z m-81.28 0c0-201.56-164.07-365.52-365.76-365.52s-365.75 164-365.75 365.52S308.33 877.37 510 877.37s365.78-163.96 365.78-365.53z"/><path d="M713.22 511.84c0 246.74-91 446.76-203.2 446.76s-203.19-200-203.19-446.76S397.8 65.09 510 65.09s203.22 200.02 203.22 446.75z m-81.28 0c0-237.41-86.52-365.52-121.92-365.52S388.1 274.43 388.1 511.84 474.62 877.37 510 877.37s121.94-128.11 121.94-365.53z"/><path d="M144.27 308.78h731.51v81.23H144.27zM144.27 593.07h731.51v81.23H144.27z"/></svg>',
	services: '<svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M850.14 490.87h-63.4V321.8c0-46.71-37.83-84.54-84.54-84.54H533.13v-63.4c0-58.33-47.34-105.67-105.67-105.67S321.8 115.53 321.8 173.86v63.4H152.73c-46.71 0-84.11 37.83-84.11 84.54l-.22 160.61h63.19c62.98 0 114.12 51.15 114.12 114.13S194.57 710.66 131.59 710.66H68.4l-.21 160.61c0 46.71 37.83 84.54 84.54 84.54h160.61v-63.4c0-62.98 51.15-114.13 114.13-114.13s114.12 51.15 114.12 114.13v63.4H702.2c46.71 0 84.54-37.83 84.54-84.54V702.2h63.4c58.33 0 105.67-47.34 105.67-105.67S908.47 490.87 850.14 490.87z"/></svg>',
	vpn: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3zm-1 13.5l6-6-1.4-1.4L11 12.7 9.4 11 8 12.4l3 3.1z"/></svg>',
	firewall: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3zm-1 13.5l6-6-1.4-1.4L11 12.7 9.4 11 8 12.4l3 3.1z"/></svg>',
	istore: '<svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M409.29 475.35H175.48c-36.65 0-66.06-29.42-66.06-66.06V175.48c0-36.13 29.94-66.06 66.06-66.06h233.81c36.65 0 66.06 29.42 66.06 66.06v233.81c0 36.65-29.42 66.06-66.06 66.06zM409.29 914.58H175.48c-36.65 0-66.06-29.42-66.06-66.06V614.71c0-36.65 29.42-66.06 66.06-66.06h233.81c36.65 0 66.06 29.42 66.06 66.06v233.81c0 36.13-29.42 66.06-66.06 66.06zM848.52 914.58H614.71c-36.65 0-66.06-29.42-66.06-66.06V614.71c0-36.65 29.42-66.06 66.06-66.06h233.81c36.65 0 66.06 29.42 66.06 66.06v233.81c0 36.13-29.94 66.06-66.06 66.06zM930.58 246.19L777.81 93.42c-25.81-25.81-67.61-25.81-93.42 0L531.61 246.19c-25.81 25.81-25.81 67.61 0 93.42l152.78 152.78c25.81 25.81 67.61 25.81 93.42 0l152.77-152.78c25.81-26.32 25.81-68.13 0-93.42z"/></svg>',
	logout: '<svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M863.4 493.3L744.2 344.2c-5.8-7.2-14.4-11.2-23.3-11.2-3.3 0-6.6.5-9.9 1.7-11.9 4.2-19.9 15.5-19.9 28.1v89.5H452.5c-32.9 0-59.6 26.7-59.6 59.6s26.7 59.6 59.6 59.6H691V661c0 12.7 8 23.9 19.9 28.1 3.2 1.1 6.6 1.7 9.9 1.7 8.9 0 17.5-4 23.3-11.2l119.3-149.1c8.8-10.8 8.8-26.3 0-37.2zM571.8 750.5H332.7c-32.7 0-59.2-26.7-59.2-59.6V333v-.5c0-32.7 26.7-59.2 59.7-59.2h238.5c32.9 0 59.6-26.7 59.6-59.6s-26.7-59.6-59.6-59.6H273.6c-65.9 0-119.3 53.4-119.3 119.3v477.1c0 65.9 53.4 119.3 119.3 119.3h298.2c32.9 0 59.6-26.7 59.6-59.6 0-33-26.7-59.7-59.6-59.7z"/></svg>',
	default: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>'
};

/**
 * Argon Theme Menu Module
 * Handles rendering and interaction of the main navigation menu and sidebar
 */
return baseclass.extend({
	/**
	 * Initialize the menu module
	 * Load menu data and trigger rendering
	 */
	__init__: function () {
		ui.menu.load().then(L.bind(this.render, this));
	},

	/**
	 * Main render function for the menu system
	 * @param {Object} tree - Menu tree structure from LuCI
	 */
	render: function (tree) {
		var node = tree;
		var url = '';

		this.renderModeMenu(node);

		// Render tab menu if we're deep enough in the navigation hierarchy
		if (L.env.dispatchpath.length >= 3) {
			for (var i = 0; i < 3 && node; i++) {
				node = node.children[L.env.dispatchpath[i]];
				url = url + (url ? '/' : '') + L.env.dispatchpath[i];
			}

			if (node) {
				this.renderTabMenu(node, url);
			}
		}

		// Attach event listeners for sidebar toggle functionality
		var sidebarToggle = document.querySelector('a.showSide');
		var darkMask = document.querySelector('.darkMask');
		
		if (sidebarToggle) {
			sidebarToggle.addEventListener('click', ui.createHandlerFn(this, 'handleSidebarToggle'));
		}
		if (darkMask) {
			darkMask.addEventListener('click', ui.createHandlerFn(this, 'handleSidebarToggle'));
		}
	},

	/**
	 * Handle menu expand/collapse functionality
	 * Manages the sliding animation and active states of menu items
	 * @param {Event} ev - Click event from menu item
	 */
	handleMenuExpand: function (ev) {
		var target = ev.currentTarget || ev.target;

		if (!target.classList || !target.classList.contains('menu')) {
			target = target.closest ? target.closest('a.menu') : null;
		}

		if (!target) {
			return;
		}

		var slide = target.parentNode;
		var slideMenu = target.nextElementSibling;
		var shouldCollapse = false;

		// Close all currently active submenus
		var activeMenus = document.querySelectorAll('.main .main-left .nav > li > ul.active');
		activeMenus.forEach(function (ul) {
			// Stop any running animations and slide up
			SlideAnimations.stop(ul);
			// Remove active classes immediately when starting slideUp animation
			ul.classList.remove('active');
			ul.previousElementSibling.classList.remove('active');
			ul.previousElementSibling.setAttribute('aria-expanded', 'false');
			SlideAnimations.slideUp(ul, 'fast');
			
			// Check if we're clicking on an already open menu (should collapse it)
			if (!shouldCollapse && ul === slideMenu) {
				shouldCollapse = true;
			}
		});

		// Exit if there's no submenu to show
		if (!slideMenu) {
			return;
		}

		// Open the submenu if it's not already open
		if (!shouldCollapse) {
			// Find the slide menu within the slide element
			var slideMenuElement = slide.querySelector(".slide-menu");
			if (slideMenuElement) {
				// Add active classes immediately when starting slideDown animation
				slideMenu.classList.add('active');
				target.classList.add('active');
				target.setAttribute('aria-expanded', 'true');
				SlideAnimations.slideDown(slideMenuElement, 'fast');
			}
			target.blur(); // Remove focus from the clicked element
		}
		
		// Prevent default link behavior and event bubbling
		ev.preventDefault();
		ev.stopPropagation();
	},

	/**
	 * Render the main navigation menu
	 * Creates hierarchical menu structure with active states and click handlers
	 * @param {Object} tree - Menu tree node to render
	 * @param {string} url - Base URL for menu items
	 * @param {number} level - Current nesting level (0-based)
	 * @returns {Element} - Generated menu element
	 */
	renderMainMenu: function (tree, url, level) {
		var currentLevel = (level || 0) + 1;
		var menuContainer = E('ul', { 'class': level ? 'slide-menu' : 'nav' });
		var children = ui.menu.getChildren(tree);

		// Don't render empty menus or menus deeper than 2 levels
		if (children.length === 0 || currentLevel > 2) {
			return E([]);
		}

		// Generate menu items for each child
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var isActive = (
				(L.env.dispatchpath[currentLevel] === child.name) && 
				(L.env.dispatchpath[currentLevel - 1] === tree.name)
			);
			
			// Recursively render submenu
			var submenu = this.renderMainMenu(child, url + '/' + child.name, currentLevel);
			var hasChildren = submenu.children.length > 0;
			
			// Determine CSS classes based on state
			var slideClass = hasChildren ? 'slide' : '';
			var menuClass = hasChildren ? 'menu' : 'food';
			
			if (isActive) {
				menuContainer.classList.add('active');
				slideClass += ' active';
				menuClass += ' active';
			}

			var title = String(child.title || child.name);
			var linkChildren = currentLevel === 1 ? [
				this.renderMenuIcon(child.name),
				E('span', { 'class': 'menu-text' }, [_(title)])
			] : [_(title)];

			// Create menu item with link and submenu
			var menuItem = E('li', { 'class': slideClass }, [
				E('a', {
					'href': L.url(url, child.name),
					'click': (currentLevel === 1) ? ui.createHandlerFn(this, 'handleMenuExpand') : null,
					'class': menuClass,
					'data-title': title.replace(/ /g, '_'),
					'aria-expanded': hasChildren ? (isActive ? 'true' : 'false') : null
				}, linkChildren),
				submenu
			]);
			
			menuContainer.appendChild(menuItem);
		}

		// Append to main menu container if this is the top level
		if (currentLevel === 1) {
			var mainMenuElement = document.querySelector('#mainmenu');
			if (mainMenuElement) {
				mainMenuElement.appendChild(menuContainer);
				mainMenuElement.style.display = '';
			}
		}
		
		return menuContainer;
	},

	renderMenuIcon: function (name) {
		var key = String(name || '').toLowerCase().replace(/-/g, '_');
		var span = E('span', { 'class': 'menu-icon', 'aria-hidden': 'true' });

		span.innerHTML = GoflowIcons[key] || GoflowIcons.default;

		return span;
	},

	renderModeMenu: function (tree) {
		var menu = document.querySelector('#modemenu');
		var children = ui.menu.getChildren(tree);

		for (var i = 0; i < children.length; i++) {
			var isActive = (L.env.requestpath.length ? children[i].name == L.env.requestpath[0] : i == 0);
			if (i > 0)
				menu.appendChild(E([], ['\u00a0|\u00a0']));
			menu.appendChild(E('li', {}, [
				E('a', {
					'href': L.url(children[i].name),
					'class': isActive ? 'active' : null
				}, [_(children[i].title)])
			]));
			if (isActive)
				this.renderMainMenu(children[i], children[i].name);
		}
		if (menu.children.length > 1)
			menu.style.display = '';
	},

	/**
	 * Render tab navigation menu
	 * Creates horizontal tab menu for deeper navigation levels
	 * @param {Object} tree - Menu tree node to render
	 * @param {string} url - Base URL for tab items
	 * @param {number} level - Current nesting level (0-based)
	 * @returns {Element} - Generated tab menu element
	 */
	renderTabMenu: function (tree, url, level) {
		var container = document.querySelector('#tabmenu');
		var currentLevel = (level || 0) + 1;
		var tabContainer = E('ul', { 'class': 'tabs' });
		var children = ui.menu.getChildren(tree);
		var activeNode = null;

		// Don't render empty tab menus
		if (children.length === 0) {
			return E([]);
		}

		// Generate tab items for each child
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var isActive = (L.env.dispatchpath[currentLevel + 2] === child.name);
			var activeClass = isActive ? ' active' : '';
			var className = 'tabmenu-item-%s %s'.format(child.name, activeClass);

			var tabItem = E('li', { 'class': className }, [
				E('a', { 'href': L.url(url, child.name) }, [_(child.title)])
			]);
			
			tabContainer.appendChild(tabItem);

			// Store reference to active node for recursive rendering
			if (isActive) {
				activeNode = child;
			}
		}

		// Append tab container to main tab menu element
		if (container) {
			container.appendChild(tabContainer);
			container.style.display = '';

			// Recursively render nested tab menus if there's an active node
			if (activeNode) {
				var nestedTabs = this.renderTabMenu(activeNode, url + '/' + activeNode.name, currentLevel);
				if (nestedTabs.children.length > 0) {
					container.appendChild(nestedTabs);
				}
			}
		}

		return tabContainer;
	},

	/**
	 * Handle sidebar toggle functionality
	 * Toggles the mobile/responsive sidebar menu visibility
	 * @param {Event} ev - Click event from sidebar toggle button or dark mask
	 */
	handleSidebarToggle: function (ev) {
		var showSideButton = document.querySelector('a.showSide');
		var sidebar = document.querySelector('#mainmenu');
		var darkMask = document.querySelector('.darkMask');
		var scrollbarArea = document.querySelector('.main-right');

		// Check if any required elements are missing
		if (!showSideButton || !sidebar || !darkMask || !scrollbarArea) {
			console.warn('Sidebar toggle elements not found');
			return;
		}

		// Toggle sidebar visibility and related states
		if (showSideButton.classList.contains('active')) {
			// Close sidebar
			showSideButton.classList.remove('active');
			sidebar.classList.remove('active');
			scrollbarArea.classList.remove('active');
			darkMask.classList.remove('active');
		} else {
			// Open sidebar
			showSideButton.classList.add('active');
			sidebar.classList.add('active');
			scrollbarArea.classList.add('active');
			darkMask.classList.add('active');
		}
	}
});
