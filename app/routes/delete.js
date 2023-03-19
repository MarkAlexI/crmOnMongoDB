function deleteFromDB(id) {
  fetch('/records/' + id, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8' 
    }
  });
}