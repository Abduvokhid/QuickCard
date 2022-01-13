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

function addSingleSelect (values) {
  const valueElement = document.createElement('textarea')
  valueElement.className = 'form-control disabled'
  valueElement.setAttribute('name', `item.${count}.values`)
  valueElement.setAttribute('rows', '4')
  valueElement.setAttribute('placeholder', 'Возможные варианты. Каждая строка 1 вариант')
  if (values) valueElement.textContent = values
  return valueElement
}

function addMultiSelect (values) {
  const valueElement = document.createElement('textarea')
  valueElement.className = 'form-control disabled'
  valueElement.setAttribute('name', `item.${count}.values`)
  valueElement.setAttribute('rows', '4')
  valueElement.setAttribute('placeholder', 'Возможные варианты. Каждая строка 1 вариант')
  if (values) valueElement.textContent = values
  return valueElement
}

function addNecessaryElements (value, text, id = undefined, values = undefined) {
  const form = document.getElementById('add_template')

  const container = document.createElement('div')
  container.className = 'row pt-3 d-flex flex-wrap'

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
  nameElement.setAttribute('name', `item.${count}.name`)
  nameElement.setAttribute('placeholder', 'Название элемента')

  const keyElement = document.createElement('input')
  keyElement.setAttribute('type', 'hidden')
  keyElement.setAttribute('value', value)
  keyElement.setAttribute('name', `item.${count}.key`)

  if (id) {
    const idElement = document.createElement('input')
    idElement.setAttribute('type', 'hidden')
    idElement.setAttribute('value', id)
    idElement.setAttribute('name', `item.${count}.id`)
    nameContainer.append(idElement)
  }

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
      valueElement = addSingleSelect(values)
      break
    case 'multi_select':
      valueElement = addMultiSelect(values)
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

function populateOnLoad () {
  const items = JSON.parse(document.getElementById('items').value)

  for (const item of items) {
    switch (item.type) {
      case 'single_line':
        addNecessaryElements(item.type, 'Single line:', item.id)
        break
      case 'multi_line':
        addNecessaryElements(item.type, 'Multi line:', item.id)
        break
      case 'single_select':
        addNecessaryElements(item.type, 'Single select:', item.id, item.value.join('\r\n'))
        break
      case 'multi_select':
        addNecessaryElements(item.type, 'Multi select:', item.id, item.value.join('\r\n'))
    }
  }

  count = 100000

}

window.onload = () => populateOnLoad()