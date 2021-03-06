class EventElement {
    constructor(subEventName, isAsync, funct) {
        this.subEventName = subEventName;
        this.isAsync = isAsync;
        this.funct = funct;
    }
}
class Event {
    constructor(parent) {
        this.partent = parent;
        this.elementsMap = new Map();
        this.elements = new Array();
    }
    getParent() {
        return this.parent;
    }
    condition(...args) {
        let result = true;
        this.elements.some((element) => {
            if (!element.funct(...args)) {
                result = false;
                return false;
            }
        });
        return result;
    }
    call(...args) {
        this.elements.some((element) => {
            element.funct(...args);
        });
    }
    has(subEventName) {
        return this.elementsMap.has(subEventName);
    }
    remove(subEventName) {
        if (!this.has(subEventName))
            return false;
        this.elementsMap.delete(subEventName);
        this.elements.splice(this._getIndex(subEventName), 1);
        return true;
    }
    delete(subEventName) {
        this.remove(subEventName);
    }
    clear() {
        this.elementsMap.clear();
        this.elements.length = 0;
    }
    replace(subEventName, funct) {
        if (!this.has(subEventName))
            return false;
        this.elementsMap.get(subEventName).funct = funct;
        this.elements[this._getIndex(subEventName)].funct = funct;
        return true;
    }
    prepend(subEventName, funct, isAsyncOpt) {
        let obj = new EventElement(subEventName, isAsyncOpt, funct);
        this.elementsMap.set(subEventName, obj);
        this.elements.unshift(obj);
    }
    append(subEventName, funct, isAsyncOpt) {
        let obj = new EventElement(subEventName, isAsyncOpt, funct);
        this.elementsMap.set(subEventName, obj);
        this.elements.push(obj);
    }
    insertBefore(subEventNameSeek, subEventName, funct, isAsyncOpt) {
        let index = this._getIndex(subEventNameSeek);
        let obj = new EventElement(subEventName, isAsyncOpt, funct);
        this.elementsMap.set(subEventName, obj);
        this.elements.splice(index, 0, obj);
    }
    insertAfter(subEventNameSeek, subEventName, funct, isAsyncOpt) {
        let index = this._getIndex(subEventNameSeek);
        let obj = new EventElement(subEventName, isAsyncOpt, funct);
        this.elementsMap.set(subEventName, obj);
        this.elements.splice(index + 1, 0, obj);
    }
    _getIndex(subEventNameSeek) {
        return this.elements.findIndex((element) => element.subEventName == subEventNameSeek);
    }
}
class Events {
    constructor() {
        this.elementsMap = new Map();
    }
    condition(eventName, ...args) {
        return new Promise((resolve, reject) => {
            let element = this.elementsMap.get(eventName);
            if (element)
                resolve(element.condition());
            resolve(true);
        });
    }
    emit(...args) {
        this.call(...args);
    }
    call(eventName, ...args) {
        return new Promise((resolve, reject) => {
            let element;
            element = this.elementsMap.get("pre_" + eventName);
            if (element)
                element.call(...args);
            element = this.elementsMap.get(eventName);
            if (element)
                element.call(...args);
            element = this.elementsMap.get("post_" + eventName);
            if (element)
                element.call(...args);
            resolve();
        });
    }
    has(eventName, subEventName) {
        if (!this.elementsMap.has(eventName))
            return false;
        if (!subEventName)
            return true;
        return this.elementsMap.get(eventName).has(subEventName);
    }
    remove(eventName, subEventName) {
        if (!this.has(eventName))
            return false;
        if (!subEventName) {
            this.elementsMap.delete(eventName);
            return true;
        }
        return this.elementsMap.get(eventName).remove(subEventName);
    }
    delete(eventName, subEventName) {
        this.remove(eventName, subEventName);
    }
    clear(eventName) {
        if (!eventName) {
            this.elementsMap.clear();
            return;
        }
        this.elementsMap.get(eventName).clear();
    }
    prepend(eventName, subEventName, funct, isAsyncOpt) {
        this._attainEvent(eventName).prepend(subEventName, funct, isAsyncOpt);
    }
    on(...args) {
        this.append(...args);
    }
    append(eventName, subEventName, funct, isAsyncOpt) {
        if (typeof subEventName === "function") {
            let values = Object.values(arguments);
            values.splice(1, 0, "_");
            this.append(...values);
            return;
        }
        this._attainEvent(eventName).append(subEventName, funct, isAsyncOpt);
    }
    insertBefore(eventName, subEventName, subEventNameSeek, funct, isAsyncOpt) {
        if (typeof subEventNameSeek === "function") {
            let values = Object.values(arguments);
            values.splice(1, 0, "_");
            this.insertBefore(...values);
            return;
        }
        this._attainEvent(eventName).insertBefore(subEventName, subEventNameSeek, funct, isAsyncOpt);
    }
    insertAfter(eventName, subEventName, subEventNameSeek, funct, isAsyncOpt) {
        if (typeof subEventNameSeek === "function") {
            let values = Object.values(arguments);
            values.splice(1, 0, "_");
            this.insertAfter(...values);
            return;
        }
        this._attainEvent(eventName).insertAfter(subEventName, subEventNameSeek, funct, isAsyncOpt);
    }
    _attainEvent(eventName) {
        if (!this.elementsMap.has(eventName))
            this.elementsMap.set(eventName, new Event(this));
        return this.elementsMap.get(eventName);
    }
}
export default Events;
