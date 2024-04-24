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
  console.log(dateTime)
  return new Date(dateTime).toLocaleString()
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
