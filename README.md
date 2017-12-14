# vue-swipe
a lightweight swipe directive for vue.js
### NOTICE - this directive has NO realtime feedback, use it in the case of doing sth after swiping. e.g., switch page tab after the (left-to-right/right-to-left)swipe gesture operating

## Usage
### 1. import the directive:
```js
import vueSwipe from 'src/directives/vue-swipe'
vueSwipe.use();
```

### 2. work on the template:

with callback name directly:

```html
<div class="cards" v-swipe="onSwipe">
    <!--some other DOM -->
</div>
```

OR
with options:

```html
<div class="cards" v-swipe="{fn:onSwipe, slipMinTime:5000}">
    <!--some other DOM -->
</div>
```
