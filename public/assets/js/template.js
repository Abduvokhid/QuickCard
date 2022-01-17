let count = 0

function deleteItem (count) {
  return function () {
    const idElement = document.getElementById(`item.${count}.id`)
    if (idElement) {
      const deletedElement = document.getElementById('deleted')
      if (deletedElement) {
        const list = JSON.parse(deletedElement.value)
        list.push(idElement.value)
        deletedElement.value = JSON.stringify(list)
      }
    }
    const element = document.getElementById(`item.${count}.name`)
    const parent = element.parentElement.parentElement
    parent.remove()
  }
}

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

function addNecessaryElements (value, text, id = undefined, name = undefined, values = undefined) {
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
  nameElement.setAttribute('id', `item.${count}.name`)
  nameElement.setAttribute('placeholder', 'Название элемента')
  if (name) nameElement.value = name

  const keyElement = document.createElement('input')
  keyElement.setAttribute('type', 'hidden')
  keyElement.setAttribute('value', value)
  keyElement.setAttribute('name', `item.${count}.key`)

  if (id) {
    const idElement = document.createElement('input')
    idElement.setAttribute('type', 'hidden')
    idElement.setAttribute('value', id)
    idElement.setAttribute('name', `item.${count}.id`)
    idElement.setAttribute('id', `item.${count}.id`)
    nameContainer.append(idElement)
  }

  const valueContainer = document.createElement('div')
  valueContainer.className = 'col-12 col-md-87 col-lg-6 ps-md-3 mt-2 mt-lg-0'

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

  const deleteContainer = document.createElement('div')
  deleteContainer.className = 'col-12 col-md-1 ps-md-3 mt-2 mt-lg-0'

  const deleteElement = document.createElement('button')
  deleteElement.className = 'btn btn-danger'
  deleteElement.textContent = 'Удалить'
  deleteElement.type = 'button'
  deleteElement.onclick = deleteItem(count)

  labelContainer.append(labelElement)
  nameContainer.append(nameElement, keyElement)
  valueContainer.append(valueElement)
  deleteContainer.append(deleteElement)
  container.append(labelContainer, nameContainer, valueContainer, deleteContainer)
  form.append(container)
  count = count + 1
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
}

function populateOnLoad () {
  const element = document.getElementById('items')
  if (!element) return
  const items = JSON.parse(element.value)
  console.log(items)

  for (const item of items) {
    switch (item.type) {
      case 'single_line':
        addNecessaryElements(item.type, 'Single line:', item.id, item.name)
        break
      case 'multi_line':
        addNecessaryElements(item.type, 'Multi line:', item.id, item.name)
        break
      case 'single_select':
        addNecessaryElements(item.type, 'Single select:', item.id, item.name, JSON.parse(item.value).join('\r\n'))
        break
      case 'multi_select':
        addNecessaryElements(item.type, 'Multi select:', item.id, item.name, JSON.parse(item.value).join('\r\n'))
    }
  }
}

window.onload = () => populateOnLoad()