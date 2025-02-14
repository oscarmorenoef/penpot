
/**
 * Get user credentials from URL query string
 * @returns {{  email: string, password: string }} credentials - User credentials 
 */
export function getUserFromUrl() {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.split('?')[1]);
    const email = hashParams.get("email");
    const password = hashParams.get("password");
    return { email, password }
}

/**
 * @typedef {Object} Options
 * @property {'restricted' | 'full'} access - The unique identifier.
 */

/**
 * Get options object from URL query string
 * @returns {Options}
 */
export function getOptionsFromUrl() {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.split('?')[1]);
    const access = hashParams.get("access") || 'full';
    return { access }
}