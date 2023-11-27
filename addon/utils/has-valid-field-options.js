export function hasValidFieldOptions(
  fieldModel,
  requiredProperties = ['conceptScheme']
) {
  if (!fieldModel.options) {
    console.error(
      `Options are invalid. For field Field "${fieldModel.label}" (${fieldModel.displayType})`
    );

    return false;
  }

  const missingProperties = [];
  for (const required of requiredProperties) {
    if (!Object.keys(fieldModel.options).includes(required)) {
      missingProperties.push(required);
    }
  }

  if (missingProperties.length !== 0) {
    console.warn(
      `Field "${fieldModel.label}" (${fieldModel.displayType}) is missing keys: `,
      missingProperties.join(', ')
    );

    return false;
  }

  return true;
}
