import homeTemplate from '../html/home.html';
import aboutTemplate from '../html/about.html';


/**
 * This function takes a hash string as an argument and updates the content of the page
 * and the page title based on the hash. If the hash is invalid, it redirects to the home page.
 * @param {string} hash The hash to use for updating the page.
 */
function updateContentAndTitle(hash: string) {
    let template: string; // The html template to use for the page
    let pageTitleText: string; // The text to use for the page title

    // Switch statement to determine which data to use
    switch (hash) {
        case 'About':
            template = aboutTemplate; // The About page template
            pageTitleText = 'About'; // The page title for the About page
            break;
        case 'Home':
            template = homeTemplate; // The Home page template
            pageTitleText = 'Home'; // The page title for the Home page
             // Log the hash for debugging purposes
            break;
        default:
            // If the hash is invalid, use the Home page template and page title
            // and redirect to the Home page
            template = homeTemplate;
            pageTitleText = 'Home';
            window.location.href = window.location.origin + '#Home';
            break;
    }

    // Get the content section element from the DOM
    const contentSection: HTMLElement | null = document.getElementById('contentSection');

    // If the content section element exists, update its innerHTML with the template
    if (contentSection) {
        contentSection.innerHTML = template;
    }

    // Update the page title
    document.title = pageTitleText;
}

/**
 * This function is called when the page loads and it updates the page content and title
 * based on the hash in the URL.
 */
export function loadHtmlOnLoad() {
    const hash: string = window.location.hash.slice(1) || ''; // Get the hash from the URL
    updateContentAndTitle(hash); // Call the function to update the page content and title

    setupNavigation();
}

/**
 * This function sets up the event listener for the popstate event on the window object.
 * The popstate event is fired when the user navigates back or forward in the browser history.
 * The event handler function is called when the event is fired and it updates the page content and title
 * based on the hash in the URL.
 */
function setupNavigation() {

    // Add an event listener to the window object for the popstate event
    window.addEventListener('popstate', (event: PopStateEvent) => {
        // Get the hash from the event state or the current URL if the event state is null
        const hash = event.state?.hash || window.location.hash.slice(1) || '';

        // Call the function to update the page content and title
        updateContentAndTitle(hash);
    });
}
