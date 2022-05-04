# wc-mac-input

Mac address input web component.

[![NPM](https://nodei.co/npm/wc-mac-input.png?mini=true)](https://www.npmjs.com/package/wc-mac-input)

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
The demo page: https://yishiashia.github.io/mac-input.html
## Usage

If you want to customize this web component, you can import the library and 
implement your new class by extend `wcMacInput`.

```js
import MacInput from "wcMacInput";

class customizedMacInput extends MacInput {
    // override here
}

```
