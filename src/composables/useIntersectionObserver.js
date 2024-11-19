const intersectionHandler = (isIntersectingFn) =>
  function handleIntersection(entries) {
    entries.forEach((entry) => {
      isIntersectingFn(entry)
    })
  }

function observeElement(
  element,
  isIntersectingFn,
  options = { threshold: 0.5, rootMargin: '0px', root: null }
) {
  const handleIntersection = intersectionHandler(isIntersectingFn)
  const observer = new IntersectionObserver(handleIntersection, options)
  observer.observe(element)
}

export default { observeElement }
