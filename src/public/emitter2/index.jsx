import { EventEmitter2 } from 'eventemitter2'

const emitter2 = new EventEmitter2({

  //  这个设置`真`使用通配符。它默认为`假`。
  //  wildcard: true,

  //  分隔符用于分割空间，默认为`。`。
  //  delimiter: '::',

  //  这个设置`真`如果你想发出newlistener事件。默认值是`真`。
 //   newListener: false,

  //  听众可以分配到一个事件的最大数量，默认为10。
 // maxListeners: 20
})

export default emitter2