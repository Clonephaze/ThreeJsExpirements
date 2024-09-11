import homeTemplate from '../html/home.html';
import aboutTemplate from '../html/about.html';

// Define a flag to determine if we're running on GitHub Pages
const isGithubPages = window.location.hostname === 'clonephaze.github.io';

/**
 * This function takes a hash string as an argument and updates the content of the page
 * and the page title based on the hash. If the hash is invalid, it redirects to the home page.
 * @param {string} hash The hash to use for updating the page.
 */
function updateContentAndTitle(hash: string): void {
    let template: string; // The html template to use for the page
    let pageTitleText: string; // The text to use for the page title

    // Switch statement to determine which data to use
    switch (hash) {
        case 'About':
            template = aboutTemplate;
            pageTitleText = 'About';
            break;
        case 'Home':
            template = homeTemplate; 
            pageTitleText = 'Home';
            break;
        default:
            // If the hash is invalid, use the Home page template and page title
            // and redirect to the Home page
            template = homeTemplate;
            pageTitleText = 'Home';
            if (isGithubPages) {
                window.location.href = window.location.origin + '/ThreeJsExpirements/#Home';
            } else {
                window.location.href = window.location.origin + '#Home';
            }
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
    return;
}

/**
 * This function is called when the page loads and it updates the page content and title
 * based on the hash in the URL, then returns a boolean value indicating if the page has finished loading.
 */
export function loadHtmlOnLoad(): boolean {
    let loaded: boolean = false;
    const urlPath = window.location.pathname; // Get the URL path
    const hash: string = window.location.hash.slice(1) || ''; // Get the hash from the URL

    // Check if the URL path contains '/ThreeJsExpirements/' for GitHub Pages
    if (isGithubPages && !urlPath.includes('/ThreeJsExpirements/')) {
        // Redirect to the correct path if '/ThreeJsExpirements/' is missing
        window.location.href = window.location.origin + '/ThreeJsExpirements/#' + hash;
    } else {
        updateContentAndTitle(hash);
    }
    
    setupNavigation(); // Call the function to set up the navigation
    loaded = true;
    return loaded;
}

/**
 * This function sets up the event listener for the popstate event on the window object.
 * The popstate event is fired when the user navigates back or forward in the browser history.
 * The event handler function is called when the event is fired and it updates the page content and title
 * based on the hash in the URL.
 */
function setupNavigation(): void {
    // Add an event listener to the window object for the popstate event
    window.addEventListener('popstate', (event: PopStateEvent) => {
        // Get the URL path and hash from the event state or the current URL
        const urlPath = window.location.pathname;
        const hash = event.state?.hash || window.location.hash.slice(1) || '';

        // If the URL path contains '/ThreeJsExpirements/' for GitHub Pages, update the content and title
        if (isGithubPages && !urlPath.includes('/ThreeJsExpirements/')) {
            // Redirect to the correct path if '/ThreeJsExpirements/' is missing
            window.location.href = window.location.origin + '/ThreeJsExpirements/#' + hash;
        } else {
            updateContentAndTitle(hash);
        }
    });
    return;
}
