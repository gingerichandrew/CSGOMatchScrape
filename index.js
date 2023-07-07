(async () => {
    const src = chrome.runtime.getURL("/src/app.js");
    const contentMain = await import(src);
    contentMain.app();
})();