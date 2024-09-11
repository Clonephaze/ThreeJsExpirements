// Import the SCSS stylesheet
import '../scss/style.scss';
// Import the src index.html file, which will be processed by the HtmlWebpackPlugin to create the root index.html
import '../html/index.html';

// Import the loadHtmlOnLoad and setupNavigation functions from the pageLoader module
import { loadHtmlOnLoad } from './pageLoader';
import { initThreeJS } from './three';

// Set up an event listener for when the page finishes loading that calls required onload functions
window.onload = () => {
    if (loadHtmlOnLoad()) {
        initThreeJS();
    }
};