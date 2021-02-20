let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  // chrome.storage.sync.set({ color })
  // console.log('Default background color set to %cgreen', `color: ${color}`);
  // "Dev mode". Reload extension all the time.
})

chrome.action.onClicked.addListener(() => {
  chrome.runtime.reload()
  console.log('hit that! reloaded')
})
