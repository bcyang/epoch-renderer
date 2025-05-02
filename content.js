
function replaceEpochTimestamps() {
    const calendarEmoji = "\u{1F4C5}"; // Unicode for Calendar
    const threeOclockEmoji = "\u{1F550}"; // Unicode for 3 o'clock
    const watchEmoji = "\u{231A}";  // Unicode fo Watch
    const tinyClockEmoji = "\u{23F2}"; // Unicode for Tiny Clock
    const emoji = tinyClockEmoji;
    const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                // Match long or float numbers possibly representing epoch time
                return /\b\d{10,13}\b(\.\d+)?(?:[eE][+-]?\d+)?\b/.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        }
    );

    const nodes = [];
    let currentNode;

    while (currentNode = treeWalker.nextNode()) {
        nodes.push(currentNode);
    }

    nodes.forEach(node => {
        node.textContent = node.textContent.replace(/(\b\d{10,13}\b(\.\d+)?(?:[eE][+-]?\d+)?)\b/g, (match) => {
            const EPOCH_2015_01_01 = 1420070400000; // Epoch time for 2015-01-01
            const EPOCH_2100_12_31 = 4133894400000; // Epoch time for 2100-12-31
            let timestamp = parseFloat(match);
            let epoch_for_date;
            if (timestamp > EPOCH_2015_01_01 && timestamp < EPOCH_2100_12_31) {
                // input in mseconds
                epoch_for_date = timestamp;

            } else if (timestamp > EPOCH_2015_01_01 / 1000 && timestamp < EPOCH_2100_12_31 / 1000) {
                // input in seconds
                epoch_for_date = timestamp * 1000;
            } else {
                // not a timestamp that we can render
                return match;
            }
            // 2025-04-21 17:57:55.000
            let renderedDate = new Date(epoch_for_date).toISOString()
                .replace('T', ' ')
                .replace('Z', '')
                .replace(/\.0+$/, '');
            let originalText = ' (' + match + ')';
            return emoji + renderedDate + originalText + emoji;
        });
    });
}

chrome.storage.sync.get('setting', ({ setting }) => {
    const disabled = (setting || {}).disabled || false;
    if (! disabled) {
        // Run the replacement when the script is loaded
        replaceEpochTimestamps();
    }
});
