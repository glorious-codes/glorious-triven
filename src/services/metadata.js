const _public = {};

_public.hasMetadata = fileContent => {
  const containsMetadataDivider = new RegExp(/^---\n$/m);
  return containsMetadataDivider.test(fileContent);
};

module.exports = _public;
