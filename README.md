# fetcheer

A small JS fetch wrapper to work in a couple with [JSend][1].
Feel free to use as a boilerplate and a plain extension point.

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