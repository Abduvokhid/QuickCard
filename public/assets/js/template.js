let count = 1

function addSingleLine () {
  const valueElement = document.createElement('input')
  valueElement.setAttribute('type', 'text')
  valueElement.className = 'form-control disabled'
  valueElement.setAttribute('disabled', '')
  return valueElement
}

function addMultiLine () {
  const valueElement = document.createElement('textarea')
  valueElement.className = 'form-control no-resize disabled'
  valueElement.setAttribute('disabled', '')
  return valueElement
}

function addSingleSelect () {
  const valueElement = document.createElement('textarea')
  valueElement.className = 'form-control disabled'
  valueElement.setAttribute('name', `item_${count}_values`)
  valueElement.setAttribute('rows', '4')
  valueElement.setAttribute('placeholder', 'Возможные варианты. Каждая строка 1 вариант')
  return valueElement
}

function addMultiSelect () {
  const valueElement = document.createElement('textarea')
  valueElement.className = 'form-control disabled'
  valueElement.setAttribute('name', `item_${count}_values`)
  valueElement.setAttribute('rows', '4')
  valueElement.setAttribute('placeholder', 'Возможные варианты. Каждая строка 1 вариант')
  return valueElement
}

function addNecessaryElements (value, text) {
  const form = document.getElementById('add_template')

  const container = document.createElement('div')
  container.className = 'd-flex flex-wrap'

  const labelContainer = document.createElement('div')
  labelContainer.className = 'col-12 col-lg-1 bold'

  const labelElement = document.createElement('span')
  labelElement.className = 'text-muted'
  labelElement.textContent = text

  const nameContainer = document.createElement('div')
  nameContainer.className = 'col-12 col-md-4 mt-2 mt-lg-0'

  const nameElement = document.createElement('input')
  nameElement.setAttribute('type', 'text')
  nameElement.className = 'form-control'
  nameElement.setAttribute('name', `item_${count}_name`)
  nameElement.setAttribute('placeholder', 'Название элемента')

  const keyElement = document.createElement('input')
  keyElement.setAttribute('type', 'hidden')
  keyElement.setAttribute('value', 'multi_select')
  keyElement.setAttribute('name', `item_${count}_key`)

  const valueContainer = document.createElement('div')
  valueContainer.className = 'col-12 col-md-8 col-lg-7 ps-md-3 mt-2 mt-lg-0'

  let valueElement

  switch (value) {
    case 'single_line':
      valueElement = addSingleLine()
      break
    case 'multi_line':
      valueElement = addMultiLine()
      break
    case 'single_select':
      valueElement = addSingleSelect()
      break
    case 'multi_select':
      valueElement = addMultiSelect()
  }

  labelContainer.append(labelElement)
  nameContainer.append(nameElement, keyElement)
  valueContainer.append(valueElement)
  container.append(labelContainer, nameContainer, valueContainer)
  form.append(container)
}

function onAddElementClick () {
  const value = document.getElementById('add_element').value

  switch (value) {
    case 'single_line':
      addNecessaryElements(value, 'Single line:')
      break
    case 'multi_line':
      addNecessaryElements(value, 'Multi line:')
      break
    case 'single_select':
      addNecessaryElements(value, 'Single select:')
      break
    case 'multi_select':
      addNecessaryElements(value, 'Multi select:')
  }
  count = count + 1
}