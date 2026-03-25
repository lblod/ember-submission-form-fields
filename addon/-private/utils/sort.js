export function byOrder(a, b) {
  return a.order.localeCompare(b.order, undefined, { numeric: true });
}

export function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
}

export function getOrderForOption(orderBy, tripleSubject, store, metaGraph) {
  const orderStatement = store.any(
    tripleSubject,
    orderBy,
    undefined,
    metaGraph,
  );

  return `${orderStatement?.value ?? ''}`;
}
