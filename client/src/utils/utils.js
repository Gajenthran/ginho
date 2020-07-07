export const parseQuery = (queryString) => {
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
};

export const addQuery = (window, query) => {
  var url = `${window.location.origin}${window.location.pathname}?`

  for (let field in query) {
    url += `${field}=${query[field]}&`;
  }
  url = url.slice(0, -1);
  return url;
};

export const checkDuplicateValues = (array, value) => {
  const found = array.find(el => el.id === value);
  return found ? true : false;
}

export const mergeArrays = (...arrays) => {
  let jointArray = []

  arrays.forEach(array => {
    jointArray = [...jointArray, ...array]
  });
  return [...new Set([...jointArray])]
};

export const filteredArray = (arr) => arr.reduce((acc, current) => {
  const x = acc.find(item => item.id === current.id);
  if (!x) {
    return acc.concat([current]);
  } else {
    return acc;
  }
}, []);

export const arrayToObject = (array) => {
  var objs = [];
  for (var i = 0; i < array.length; i++) {
    objs.push({
      'id': array[i],
      'text': array[i]
    });
  }
  return objs;
};
