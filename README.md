# wc-mac-input
[![NPM](https://nodei.co/npm/wc-mac-input.png?mini=true)](https://www.npmjs.com/package/wc-mac-input)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/wc-mac-input)


Mac address input web component.



## Install

    $ npm install wc-mac-input

## Syntax

```html
<script src="mac-input.js"></script>

<form action="#" method="POST" onsubmit="return form_submit(event)">
    <label for="mac-input">Mac address:</label>
    <mac-input id="mac-input" name="mac"></mac-input>
    <input type="submit" value="submit" />
</form>
```

## Demo page
The demo page: https://yishiashia.github.io/wc-mac-input/
## Usage

If you want to customize this web component, you can import the library and 
implement your new class by extend `MacInput`.

```js
import MacInput from "wc-mac-input";

class customizedMacInput extends MacInput {
    // override here
}

```
