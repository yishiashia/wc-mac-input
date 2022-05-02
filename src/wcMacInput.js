const validChar = [
  'a', 'b', 'c', 'd', 'e', 'f',
  'A', 'B', 'C', 'D', 'E', 'F',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

export default class MacInput extends HTMLElement {
  static formAssociated = true

  constructor () {
    super()

    this.inputSlots = []
    this.macStr = ['', '', '', '', '', '']
    this.failCount = 0

    // shadow dom
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = this.template()

    // Get access to the internal form control APIs
    this.internals_ = this.attachInternals()
    // internal value for this control
    this.value_ = '00-00-00-00-00-00'
  }

  connectedCallback () {
    this.inputSlots[0] = this.shadowRoot.querySelector('input:nth-child(1)')
    this.inputSlots[1] = this.shadowRoot.querySelector('input:nth-child(2)')
    this.inputSlots[2] = this.shadowRoot.querySelector('input:nth-child(3)')
    this.inputSlots[3] = this.shadowRoot.querySelector('input:nth-child(4)')
    this.inputSlots[4] = this.shadowRoot.querySelector('input:nth-child(5)')
    this.inputSlots[5] = this.shadowRoot.querySelector('input:nth-child(6)')
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

  // Form controls usually expose a "value" property
  get value () {
    return this.value_
  }

  set value (v) {
    this.value_ = v
  }

  get form () { return this.internals_.form }
  get type () { return this.localName }
  get validity () { return this.internals_.validity }
  get validationMessage () { return this.internals_.validationMessage }
  get willValidate () { return this.internals_.willValidate }

  checkValidity () { return this.internals_.checkValidity() }
  reportValidity () { return this.internals_.reportValidity() }

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
          // console.log(inputIndex);
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
    this.internals_.setFormValue(this.value_)
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
          <input type="hidden" name="" />
        </div>
      `
  }
}
