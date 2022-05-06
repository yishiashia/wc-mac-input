import '@webcomponents/webcomponentsjs/webcomponents-bundle'
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'
import '@webcomponents/custom-elements/custom-elements.min.js'

const validChar = [
  'a', 'b', 'c', 'd', 'e', 'f',
  'A', 'B', 'C', 'D', 'E', 'F',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

export default class MacInput extends HTMLElement {
  constructor () {
    super()

    this.inputSlots = []
    this.macStr = ['', '', '', '', '', '']
    this.failCount = 0

    // shadow dom
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = this.template()

    this.realInput = null
    this.value_ = '00-00-00-00-00-00'
  }

  connectedCallback () {
    this.inputSlots[0] = this.shadowRoot.querySelector('input:nth-child(1)')
    this.inputSlots[1] = this.shadowRoot.querySelector('input:nth-child(2)')
    this.inputSlots[2] = this.shadowRoot.querySelector('input:nth-child(3)')
    this.inputSlots[3] = this.shadowRoot.querySelector('input:nth-child(4)')
    this.inputSlots[4] = this.shadowRoot.querySelector('input:nth-child(5)')
    this.inputSlots[5] = this.shadowRoot.querySelector('input:nth-child(6)')

    this.realInput = document.createElement('input')
    this.realInput.name = this.attributes.name.value
    this.realInput.type = 'hidden'
    this.realInput.id = 'mac-real-input'
    this.realInput.value = this.value_
    this.appendChild(this.realInput)

    this.addEventListener('click', this._onClick)
    const macInputElement = this
    this._onKeyInput = this._onKeyInput.bind(macInputElement)
    this._onKeyDown = this._onKeyDown.bind(macInputElement)
    this.inputSlots.forEach(function (element) {
      element.addEventListener('input', macInputElement._onKeyInput)
      element.addEventListener('keydown', macInputElement._onKeyDown)
    })
  }

  disconnectedCallback () {
    this.removeEventListener('click', this._onClick)
    const macInputElement = this
    this.inputSlots.forEach(function (element) {
      element.removeEventListener('input', macInputElement._onKeyInput)
      element.removeEventListener('keydown', macInputElement._onKeyDown)
    })
  }

  _onClick (e) {
    setTimeout(() => {
      const inputIndex = Math.floor(this.macStr.join('').length / 2)
      if (this.inputSlots[inputIndex]) {
        this.inputSlots[inputIndex].focus()
      }
    }, 300)
  }

  _onKeyDown (e) {
    const inputIndex = Array.from(e.target.parentNode.children).indexOf(e.target)
    const keyin = parseInt(e.which || e.keyCode)
    if (!isNaN(keyin)) {
      if (keyin === 8 && e.target.value === '') {
        if (inputIndex > 0) {
          this.inputSlots[inputIndex - 1].focus()
          this.inputSlots[inputIndex - 1].dispatchEvent(new KeyboardEvent('keypress', { code: 8 }))
        }
      }
    }
  }

  _onKeyInput (e) {
    const inputIndex = Array.from(e.target.parentNode.children).indexOf(e.target)
    this.macStr[inputIndex] = ''
    for (let i = 0; i < e.target.value.length; i++) {
      if (validChar.includes(e.target.value.charAt(i))) {
        this.macStr[inputIndex] += e.target.value.charAt(i).toUpperCase()
      }
    }
    if (e.target.value.length !== this.macStr[inputIndex].length) {
      this.failCount += 1
      if (this.failCount % 3 === 0) {
        alert('Please valid mac address character (a-f, A-F or 0-9)')
      }
    }
    e.target.value = this.macStr[inputIndex]
    if (e.target.value.length === 2) {
      if (inputIndex < 5) {
        this.inputSlots[inputIndex + 1].focus()
      }
    }
    if ('createEvent' in document) {
      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('change', false, true)
      this.dispatchEvent(evt)
    } else {
      this.fireEvent('onchange')
    }
    this.value_ = this.macStr.join('-').toUpperCase()
    if (this.realInput) {
      this.realInput.value = this.value_
    }
  }

  template () {
    return `
        <style>
          input { width: 50px; }
        </style>
        <div class="wrapper">
          <input type="text" maxlength="2"> -
          <input type="text" maxlength="2"> -
          <input type="text" maxlength="2"> -
          <input type="text" maxlength="2"> -
          <input type="text" maxlength="2"> -
          <input type="text" maxlength="2">
        </div>
      `
  }
}
