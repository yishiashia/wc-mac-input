import { render, fireEvent, cleanup } from '@testing-library/dom'
import '@testing-library/jest-dom';
import MacInput from '../../src/wcMacInput';

describe('wcMacInput.js', () => {

  window.customElements.define('mac-input', MacInput);
  document.body.innerHTML = `
  <h1>Custom element test</h1>
  <mac-input id="mac-input" name="mac"></mac-input>
  `;
  const customElement = document.getElementById('mac-input');

  let eventCounter = 0

  test('Render mac-input element in JSDOM', () => {

    // 1. Check shadow dom element is rendered
    expect(customElement === null).toBeFalsy();
    // 2. Check input fields count to be 6
    const inputElements = customElement.querySelectorAll('input')
    expect(inputElements.length === 6)

  });

  test('Simulate keyin with mac-input element', () => {
    customElement.addEventListener('change', function(e) {
      // changeValue = e.target.value_
      eventCounter++;
    });

    // check valid input on inputs
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
  })

  test('Simulate invalid keyin with mac-input element', () => {
    let inputEl;
    let result = '';
    let testCount = 0;

    eventCounter = 0
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

  test('Test backspace key press event', () => {
    let inputSlots = []
    inputSlots[0] = customElement.shadowRoot.querySelector('input:nth-child(1)')
    inputSlots[1] = customElement.shadowRoot.querySelector('input:nth-child(2)')
    inputSlots[2] = customElement.shadowRoot.querySelector('input:nth-child(3)')
    inputSlots[3] = customElement.shadowRoot.querySelector('input:nth-child(4)')
    inputSlots[4] = customElement.shadowRoot.querySelector('input:nth-child(5)')
    inputSlots[5] = customElement.shadowRoot.querySelector('input:nth-child(6)')

    inputSlots[0].value = "AA"
    inputSlots[1].value = "AA"
    inputSlots[2].value = "AA"
    inputSlots[3].value = ""

    fireEvent.keyDown(inputSlots[3], {
      key: "Backspace",
      code: "Backspace",
      keyCode: 8,
      charCode: 8
    })
    fireEvent.input(inputSlots[3], {
      bubbles: true,
      cancelable: true
    })
    expect(document.querySelector('input[name=mac]').value === "AA-AA-A---")
  });

  test('Remove event listener after disconnectedCallback is called', () => {
    let events = {};
    document.addEventListener = jest.fn((event, callback) => {
      events[event] = callback;
    });

    document.removeEventListener = jest.fn((event, callback) => {
      delete events[event];
    });

    document.body.innerHTML = `
    <h1>Custom element test</h1>
    <mac-input id="mac-input" name="mac"></mac-input>
    `;
    console.log(events);
  });

});
