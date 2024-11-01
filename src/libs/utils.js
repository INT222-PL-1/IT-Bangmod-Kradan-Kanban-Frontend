export function convertStatus(status) {
  switch (status) {
    case 'DONE':
      return 'Done'
    case 'TO_DO':
      return 'To Do'
    case 'DOING':
      return 'Doing'
    case 'NO_STATUS':
      return 'No Status'
    default:
      return status
  }
}

export function formatDateTime(dateTime) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }

  return new Date(dateTime).toLocaleString('en-GB', options)
}

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}

export function colorValidator(value) {
  if (value.length === 7 && value[0] === '#') {
    if (value.slice(1).match(/^[0-9a-fA-F]+$/)) {
      return true
    }
  }
  return false
}

export function superArraySorter(array, sortBy, sortDirection) {
  if (!['asc', 'desc'].includes(sortDirection)) {
    throw new Error('Sort direction must be "asc" or "desc"')
  }

  if (!array.length) return []

  const copyArray = [...array]

  const getField = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  if (array.some((obj) => getField(obj, sortBy) === undefined)) {
    throw new Error('Invalid sortBy key')
  }

  const fieldTypes = array.map((obj) => typeof getField(obj, sortBy))
  const uniqueFieldTypes = new Set(fieldTypes)

  if (uniqueFieldTypes.size > 1) {
    throw new Error('Mixed types for sortBy key')
  }

  const fieldType = fieldTypes[0]

  if (fieldType === 'string') {
    copyArray.sort(
      (a, b) =>
        getField(a, sortBy).localeCompare(getField(b, sortBy)) * (sortDirection === 'asc' ? 1 : -1)
    )
  } else if (fieldType === 'number') {
    copyArray.sort(
      (a, b) => (getField(a, sortBy) - getField(b, sortBy)) * (sortDirection === 'asc' ? 1 : -1)
    )
  } else {
    throw new Error('Invalid sortBy key type')
  }

  return copyArray
}

export function parseJwtPayload(token) {
  return JSON.parse(atob(token.split('.')[1]));
}

export function errorArrayToString(errors) {
  return errors.map((error) => error.field + ' ' + error.message).join('\n')
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('success');
  } catch (err) {
    console.error('Failed to copy!', err);
  }
}

export function humanReadDate(rawDate) {

	const date = new Date(rawDate)

	if (date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
		if (date.getHours() === new Date().getHours()) {
			if (date.getMinutes() === new Date().getMinutes()) {
				return 'just now'
			}

			return new Date().getMinutes() - date.getMinutes()  + ' minutes ago'
		}
		return 'today at ' + date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric'
		})
	}

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	})
}

export async function waitForStorage(key, timeout = 5000) {
  return new Promise((resolve, reject) => {
    let timeElapsed = 0
    const interval = 100 // check every 100ms
    const checkStorage = setInterval(() => {
      const value = localStorage.getItem(key)
      if (value) {
        clearInterval(checkStorage)
        resolve(value)
      }
      timeElapsed += interval
      if (timeElapsed >= timeout) {
        clearInterval(checkStorage)
        reject(new Error(`Timeout: ${key} not found in localStorage`))
      }
    }, interval)
  })
}

export function formatFileSize(size) {
  if (size === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}