const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }
};

const createEventHub = () => ({
    hub: Object.create(null),
    on(event, handle) {
        if (!this.hub[event]) {
            this.hub[event] = [];
        }
        this.hub[event].push(handle);
    },
    emit(event, data) {
        if (this.hub[event]) {
            this.hub[event].forEach(handler => handler(data));
        }
    },
    off(event, handler) {
        const i = (this.hub[event] || []).findIndex(h => h === handler);
        if (i > -1) {
            this.hub[event].splice(i, 1);
        }
    }
});

const runAsync = fn => {
    const blob = `const fn = ${fn.toString()}; postMessage(fn());`;
    const worker = new Worker(
        URL.createObjectURL(new Blob([blob]), {
            type: 'application/javascript; charset=utf-8'
        })
    )
    return new Promise((resolve, reject) => {
        worker.onmessage = ({ data }) => {
            resolve(data), worker.terminate();
        };
        worker.onerror = err => {
            reject(err), worker.terminate();
        }
    });
};
