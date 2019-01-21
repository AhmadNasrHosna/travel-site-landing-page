import MobileMenu     from './modules/MobileMenu';
import RevealOnScroll from './modules/RevealOnScroll';
import StickyHeader   from './modules/StickyHeader';
import Modal          from './modules/Modal';
import $              from 'jquery';

const mobileMenu = new MobileMenu();
const stickyHeader = new StickyHeader();
const modal = new Modal();

new RevealOnScroll($(".feature-item"), "85%");
new RevealOnScroll($(".testimonial"), "60%");
