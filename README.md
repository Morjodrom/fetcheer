# fetcheer

A small JS fetch wrapper to work in a couple with [JSend][1].
Feel free to use as a boilerplate and a plain extension point.

###
##! The library is unstable and not intended to a direct usage, please, consider using it as a boilerplate.

[1]: http://labs.omniti.com/labs/jsend

# Basic usage
```javascript
import Fetcheer from 'fetcheer'
return Fetcheer.request(input, init) // purely like fetch(input, init)
      .then(Fetcheer.check200) // trivial 200 code checker
      .then(response => {
      	   // standard object of the Response interface
      })
      .catch(error => {
         // server responded with the code different from 200
      })
```

# Usage with JSend
```javascript
import Fetcheer from 'fetcheer'
Fetcheer.getJsend('/some-handler/')
   .then(jsendResponse => {
      // do something with jsend
   })
   .catch(error => {
      // server responded with the code different from 200
      // or jsend is not parsed
   })
```

# Post queries
```javascript
import Fetcheer from 'fetcheer'
/**
 * @type {{name: string, address: {street: string}, photo: File}}
 */
const user = {
    name: 'Ivan',
    address: {street: 'Ever Green str.'},
    photo: file
}
const postBody = Fetcheer.objectToFormData(user)
const postOptions = Fetcheer.getPostOptions(postBody)
return Fetcheer.getJsend('/user-save-handler/', postOptions)
    .then()
    // ...
    .catch()
```

# JSend handling sugar
```javascript
import Fetcheer from 'fetcheer'
Fetcheer.getJsend('some url')
.then(Fetcheer.checkJsendSuccess) // check if the jsend has success status
.then(data => {
   // this code is called ONLY for successful a JSend
})
.catch(/** @param {string|string[]|*} error - message from jsend with error status or data from jsend fail */
    error => { 
})

```