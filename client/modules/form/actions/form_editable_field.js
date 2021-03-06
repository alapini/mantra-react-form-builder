export default {
  setSelected({LocalState}, id) {
    if (!id) {
      return LocalState.set(
        'CANNOT_SELECT_NULL_ID', 'Id is required'
      )
    }

    let form_fields = LocalState.get('FORM:FORM_FIELDS')
    LocalState.set(
      'FORM:SELECTED_ELEMENT',
      id === LocalState.get('FORM:SELECTED_ELEMENT')?undefined:id // unselect if current element is selected
    );
  },
  editElement({LocalState}, id) {
    if (!id) {
      return LocalState.set(
        'CANNOT_FIND_THIS_ID_IN_FORM_FIELDS', 'This field is not available in the form fields'
      )
    }
    //deselect element, prevent arrow keys moving element when editing
    LocalState.set('FORM:SELECTED_ELEMENT', undefined)
    LocalState.set('CANNOT_FIND_THIS_ID_IN_FORM_FIELDS', null)

    var form_fields = LocalState.get('FORM:FORM_FIELDS')
    var element = form_fields[id]
    element['edit'] = true
    form_fields[id] = element
    LocalState.set('FORM:FORM_FIELDS', form_fields)
  },
  closeEditing({LocalState}, id) {
    if (!id) {
      return LocalState.set(
        'CANNOT_FIND_THIS_ID_IN_FORM_FIELDS', 'This field is not available in the form fields'
      )
    }

    LocalState.set('CANNOT_FIND_THIS_ID_IN_FORM_FIELDS', null)

    var form_fields = LocalState.get('FORM:FORM_FIELDS')
    var element = form_fields[id]

    element['edit'] = false
    form_fields[id] = element
    LocalState.set('FORM:FORM_FIELDS', form_fields)
  },
  deleteElement({LocalState}, id) {
    if (!id) {
      return LocalState.set(
        'CANNOT_FIND_THIS_ID_IN_FORM_FIELDS', 'This field is not available in the form fields'
      )
    }

    LocalState.set('CANNOT_FIND_THIS_ID_IN_FORM_FIELDS', null)

    var form_fields = LocalState.get('FORM:FORM_FIELDS')
    delete form_fields[id]
    LocalState.set('FORM:FORM_FIELDS', form_fields)
  },
  updateElement({LocalState}, id, params) {
    if (!id) {
      return LocalState.set(
        'CANNOT_FIND_THIS_ID_IN_FORM_FIELDS', 'This field is not available in the form fields'
      )
    }

    LocalState.set('CANNOT_FIND_THIS_ID_IN_FORM_FIELDS', null)

    var form_fields = LocalState.get('FORM:FORM_FIELDS')

    var element = form_fields[id]
    // console.log('updating')
    // console.log('STATE BEFORE ===> ')
    // console.log('Params: ', params)
    // console.log('Element: ', element)
    // console.log('Form Fields: ', form_fields)
    // console.log('END ')
    element['ui'] = element['ui'] || {}

    let updateElement = (ele, key, value) => {
      ele['editSchema']['properties'][key]['default'] = value
    }

    if (params && params['label']) {
      element['def']['title'] = params['label']
      updateElement(element, 'label', params['label'])
    }

    if (params && params['class']) {
      element['ui']['classNames'] = params['class']
      updateElement(element, 'class', params['class'])
    }

    if (params && params['name']) {
      updateElement(element, 'name', params['name'])
    }

    if (params && params['defaultValue']) {
      element['def']['default'] = params['defaultValue']
      updateElement(element, 'defaultValue', params['defaultValue'])
    }

    if (params && params['hint']) {
      element['ui']['ui:help'] = params['hint']
      updateElement(element, 'hint', params['hint'])
    }

    if (params && params['placeHolder']) {
      element['def']['description'] = params['placeHolder']
      updateElement(element, 'placeHolder', params['placeHolder'])
    }

    if (params && params['depth']) {
      var cls = params['class'];

      if (params['depth'] != 0) {
        element['def']['ext'] = element['def']['ext'] || {}
        element['def']['ext']['depth'] = params['depth'];
        element['def']['ext']['class'] = 'col-md-offset-' + params['depth'];
      }

      // updateElement(element, 'depth', params['depth'])
    }

    let name = ''
    if (params && params['name']) {
      name = params['name']
    }

    element['edit'] = false

    if (name) {
      console.log(name)
      let reorderFormFields = (fields, o, n, ele) => {
        let cloned = {}
        for (let k in fields) {
          if (k != o) {
            cloned[k] = fields[k]
          } else {
            cloned[n] = element
          }
        }

        return cloned
      }

      form_fields = reorderFormFields(form_fields, id, name, element);
    }

    // console.log('STATE AFTER ===> ')
    console.log('Form Fields: ', form_fields)
    // console.log('END ')
    LocalState.set('FORM:FORM_FIELDS', form_fields)
  }
}
