import $ from 'jquery';
import smoothScroll from 'jquery-smooth-scroll';

class StickyHeader {
    constructor() {
        this.siteHeader = $('.site-header');
        this.headerTriggerElement = $('.large-hero__title');
        this.pageSections = $('.page-section');
        this.headerLinks = $('.primary-nav a');
        this.createHeaderWaypoint();
        this.createPageSectionWaypoint();
        this.addSmoothScrolling();
    }

    addSmoothScrolling() {
        this.headerLinks.smoothScroll();
    }

    createHeaderWaypoint() {
        const that = this;
        new Waypoint({
            element: that.headerTriggerElement[0],
            handler: () => {
                that.siteHeader.toggleClass('site-header--dark');
            }
        });
    }

    createPageSectionWaypoint() {
        const that = this;
        this.pageSections.each(function () {
            const currentSection = this;
            new Waypoint({
                element: currentSection,
                handler: (direction) => {
                    if (direction === "down") {
                        const matchingHeaderLink = currentSection.getAttribute('data-matching-link');
                        that.headerLinks.removeClass('is-current-link');
                        $(matchingHeaderLink).toggleClass('is-current-link');
                    }
                },
                offset: '6.5%'
            });

            new Waypoint({
                element: currentSection,
                handler: (direction) => {
                    if (direction === "up") {
                        const matchingHeaderLink = currentSection.getAttribute('data-matching-link');
                        that.headerLinks.removeClass('is-current-link');
                        $(matchingHeaderLink).toggleClass('is-current-link');
                    }
                },
                offset: '-80%'
            });
        });
    }
}

export default StickyHeader;