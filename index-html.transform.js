module.exports = (targetOptions, indexHtml) => {
  const index = indexHtml.replace(/2015/g, "5");
  return index;
};
