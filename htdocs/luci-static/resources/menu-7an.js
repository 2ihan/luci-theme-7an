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

const MenuIconMap = {
	status: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
	system: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
	services: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
	network: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
	modem: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 14V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/></svg>',
	nas: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
	vpn: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
	docker: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
	control: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
	statistics: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
	bandwidth_monitor: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l3 8 4-16 3 8h4"/></svg>',
	asterisk: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07L19.07 4.93"/></svg>',
	logout: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
	default: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
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
		var icon = MenuIconMap[key] || MenuIconMap.default;
		var span = E('span', { 'class': 'menu-icon', 'aria-hidden': 'true' });

		span.innerHTML = icon;

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
