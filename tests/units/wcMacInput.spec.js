import { render, fireEvent, cleanup } from '@testing-library/dom'
import '@testing-library/jest-dom';
import MacInput from '../../src/wcMacInput';

describe('wcMacInput.js', () => {

  window.customElements.define('mac-input', MacInput);

  test('Render mac-input element with text type in JSDOM', () => {

    let eventCounter = 0

    document.body.innerHTML = `
      <h1>Custom element test</h1>
      <mac-input id="mac-input" name="mac"></mac-input>
    `;

    // 1. Check shadow dom element is rendered
    const customElement = document.getElementById('mac-input');
    expect(customElement === null).toBeFalsy();

    customElement.addEventListener('change', function(e) {
      // changeValue = e.target.value_
      eventCounter++;
    });

    // 2. check valid input on inputs
    let inputEl;
    let result = '';
    let testCount = 0;
    for(let i=1; i<7; i++) {
      result = Array(i).fill("AA").join("-") + Array(6-i).fill("-").join("")
      for(let j=1; j<i; j++) {
        inputEl = customElement.shadowRoot.querySelector(`input:nth-child(${j})`)
        inputEl.value = "AA"
      }
      inputEl = customElement.shadowRoot.querySelector(`input:nth-child(${i})`)
      inputEl.value = "AA"
      fireEvent.input(inputEl, {
        bubbles: true,
        cancelable: true
      })
      testCount++
      expect(document.querySelector('input[name=mac]').value === result)
      expect(testCount === eventCounter)
    }

    // 3. check valid input on input 1
    window.alert = function() {
      /* do nothing */
    }
    for(let i=1; i<7; i++) {
      result = Array(i-1).fill("AA").join("-") + "-A" + Array(6-i).fill("-").join("")
      for(let j=1; j<i; j++) {
        inputEl = customElement.shadowRoot.querySelector(`input:nth-child(${j})`)
        inputEl.value = "AA"
      }
      inputEl = customElement.shadowRoot.querySelector(`input:nth-child(${i})`)
      inputEl.value = "AG"
      fireEvent.input(inputEl, {
        bubbles: true,
        cancelable: true
      })
      testCount++;
      expect(document.querySelector('input[name=mac]').value === result)
      expect(testCount === eventCounter)
    }
  });

});
