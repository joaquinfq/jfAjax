# jfAjax [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

OOP library for processing AJAX requests.

## Usage

[![npm install jfAjax](https://nodei.co/npm/jf-ajax.png?compact=true)](https://npmjs.org/package/jf-ajax/)

### Examples

#### NodeJS

```js
const jfAjax  = require('jf-ajax/build/jf.ajax.min');
// You need a lib implementing XMLHttpRequest interface.
const Xhr2    = require('xhr2');
const request = new jfAjax.request.Get(
    {
        debug : true, // To see headers and body
        xhr   : new Xhr2(),
        url   : 'http://localhost:3333/api/items'
    }
);
request.on('req-error',   e => console.log('ERROR: ', e.errors));
request.on('req-success', e => console.log('SUCCESS: ', e.response));
request.on('req-end',     e => console.log('END: -- Time: %dms', e.request.chrono.getTime()));
request.send();
```

#### Browser

```html
<script src="/path/to/jf.ajax.min.js"></script>
<script>
const request = new jf.ajax.request.Get(
    {
        // Placeholders for URL.
        data  : {
            itemId : 1
        },
        // You can omit this because XMLHttpRequest is used by default.
        xhr   : new XMLHttpRequest(),
        url   : 'http://localhost:3333/api/items/{itemId}'
    }
);
request.on('req-error',   e => console.log('ERROR: ', e.errors));
request.on('req-success', e => console.log('SUCCESS: ', e.response));
request.on('req-end',     e => console.log('END: -- Time: %dms', e.request.chrono.getTime()));
request.send();
</script>
```

### Extending jfAjax

You can implement your own logic extending classes provided by `jfAjax` library.

```html
<script src="/path/to/jf.ajax.min.js"></script>
<script>
//--------
class MyResponse extends jf.ajax.response.Default {
    //...
    getErrors()
    {
        return [
            // Errors customized by class
        ];
    }
    //...
}
//--------
class MyApiItemsGet extends jf.ajax.request.Get {
    constructor(config)
    {
        super(
            Object.assign(
                {
                    url      : 'http://localhost:3333/api/items',
                    response : new MyResponse(),
                    // You can use another class implementing XMLHttpRequest 
                    // interface for sending request, e.g. jfXhrSimulate.
                    xhr      : new XMLHttpRequest()
                },
                config
            )
        );
    }
    
    _onRequestError(e)
    {
        super._onRequestError(e);
        this.showErrors(e.errors);
    }
    
    _onRequestSuccess(e)
    {
        super._onRequestSuccess(e);
        this.showItems(e.response);
    }
    
    showErrors(errors)
    {
        // Code for rendering errors in browser.
    }
    
    showItems(items)
    {
        // Code for rendering items in browser.
    }
}
//--------
new MyApiItemsGet().send();
</script>
```
