
/**
 * Shows a message in the center of the screen
 * @param {string} message - message
 * @returns {function(): void}
 */
export function showMessage(message){
    const container = document.createElement('div');
    container.style.cssText = `
        position: absolute;
        z-index: 10;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-background-primary);
    `;

    const content = document.createElement('div')
    content.innerHTML = message;

    container.appendChild(content);

    document.body.appendChild(container);

    return () => {
        document.body.removeChild(container);
    }
}