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
  // console.log(dateTime)

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
