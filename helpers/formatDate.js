const formatDate = (dateStr) => {
  const dd = dateStr.substr(0, 2);
  const mm = dateStr.substr(3, 2);
  const yyyy = dateStr.substr(6, 4);

  return yyyy + "-" + mm + "-" + dd;
};

module.exports = formatDate;