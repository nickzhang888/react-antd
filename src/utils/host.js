import events from "events"
import noop from 'lodash/noop'
import isEmpty from 'lodash/isEmpty'

export let host = {
    getState: noop,
    dispatch: noop,
    subscribe: () => {
        func()
    }
}
export const emitter = new events.EventEmitter()

export function getHost() {
    return host;
}
export function setHost(host_) {
    if (!isEmpty(host_)) {
        host = host_;
        emitter.emit('change', host)
    }
}