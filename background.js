// background.js

chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get('setting', ({setting}) => {
        const origDisabled = (setting || {}).disabled || false;
        const newDisabled = !origDisabled;
        // set/store the new state
        chrome.storage.sync.set({ setting: {disabled: newDisabled} }, () => {
            // don't care
            // set the icon
            chrome.action.setIcon({ path: newDisabled ? 'icons/48/off.png' : 'icons/48/on.png' });
        });
    });
});