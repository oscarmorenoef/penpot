import { showMessage } from './utils/dom/index.js';
import { getOptionsFromUrl, getUserFromUrl } from './utils/url/index.js';

let options;

document.addEventListener("DOMContentLoaded", async () => {
    const removeLoadingMessage = showMessage('Loading...');
    options = getOptionsFromUrl();
    const { email, password } = getUserFromUrl();
    
    const shouldTryToLogin = !!email && !!password

    try{
        if(email && password) await login(email, password)
        setupPenpotForUxmalUser()
        removeLoadingMessage()
    }catch(e){
        removeLoadingMessage();
        if(shouldTryToLogin) showMessage('Failed authentication');
        else showMessage('Failed to load Penpot');
    }
});

async function login(email, password) {
    await fetch('/api/rpc/command/login-with-password', {
        method: 'POST',
        body: JSON.stringify({"~:email": email, "~:password": password}),
        headers: {
            'Accept': 'application/transit+json,text/event-stream,*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'content-type': 'application/transit+json'
        }
    })
    
    window.location.href =  removeUserCredentialsFromUrl(window.location.href)
}

function removeUserCredentialsFromUrl(url) {
    let newUrl = url;

    const startEmailPosition = newUrl.indexOf('&email=')
    const endEmailPosition = newUrl.slice(startEmailPosition + 1).indexOf('&')

    newUrl = newUrl.slice(0, startEmailPosition) + (endEmailPosition === -1 ? '' : newUrl.slice(startEmailPosition + endEmailPosition + 1))

    const startPasswordPosition = newUrl.indexOf('&password=')
    const endPasswordPosition = newUrl.slice(startPasswordPosition + 1).indexOf('&')

    newUrl = newUrl.slice(0, startPasswordPosition) + (endPasswordPosition === -1 ? '' : newUrl.slice(startPasswordPosition + endPasswordPosition + 1))
    
    return newUrl
}

async function setupPenpotForUxmalUser() {
    if(options.access === 'restricted'){
        addAppOberserver();
    }
}

function addAppOberserver() {
    const observer = new MutationObserver(appMutationsHandler);

    observer.observe(document.getElementById('app'), {
        childList: true,
        subtree: true
    });
}

function appMutationsHandler(mutationsList){
    mutationsList.forEach((mutation) => {
        if (mutation.type !== 'childList') return

        mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return
            removeElements(node)
            replaceElements(node)
        });
    });
}

function removeElements(node) {
    selectorsToRemove.forEach(selector => {
        let elementToRemove = node.querySelector(selector)
        while(elementToRemove){
            elementToRemove.parentNode.removeChild(elementToRemove)
            elementToRemove = node.querySelector(selector)
        }
    })
}

function replaceElements(node) {
    selectorsToReplace.forEach(({ selector, newElement }) => {
        let elementToReplace = node.querySelector(selector)
        while(elementToReplace){
            elementToReplace.parentNode.replaceChild(newElement(elementToReplace), elementToReplace)
            elementToReplace = node.querySelector(selector)
        }
    })
}

const selectorsToRemove = [
    'header .main_ui_workspace_left_header__main-icon',
    'header .main_ui_workspace_left_header__project-name',
    'header .main_ui_ds_buttons_icon_button__icon-button',
    'aside#right-sidebar-aside .main_ui_workspace_right_header__comments-section',
    'aside#right-sidebar-aside .main_ui_workspace_right_header__viewer-btn',
    'aside#right-sidebar-aside .main_ui_workspace_right_header__history-section',
]

const selectorsToReplace = [
    { selector: 'header .main_ui_workspace_left_header__file-name', newElement: (fileNameElement) => {
        const fileName = fileNameElement.getAttribute('title');
        const newFileNameElement = document.createElement('span');
        newFileNameElement.innerHTML = fileName;
        return newFileNameElement
    }}
]